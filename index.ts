import {ZlibOptions, BrotliOptions} from "zlib";
import picomatch from "picomatch";
import {Plugin} from "esbuild";
import {constants, createBrotliCompress, createDeflate, createGzip} from "node:zlib";
import fs from "node:fs";
import pipe from "node:stream/promises";

interface CompressOptions {
    gzip: boolean;
    brotli: boolean;
    deflate: boolean;
    excludes: string[];
    gzipOptions: ZlibOptions;
    deflateOptions: ZlibOptions;
    brotliOptions: BrotliOptions;
}

const defaultOptions: CompressOptions = {
    gzip: true,
    brotli: true,
    deflate: true,
    excludes: [],
    gzipOptions: {
        level: constants.Z_BEST_COMPRESSION,
    },
    deflateOptions: {
        level: constants.Z_BEST_COMPRESSION,
    },
    brotliOptions: {},
}

const compressGzip = async (file: string, options: ZlibOptions) => {
    await pipe.pipeline(
        fs.createReadStream(file),
        createGzip(options),
        fs.createWriteStream(`${file}.gz`)
    );
}

const compressDeflate = async (file: string, options: ZlibOptions) => {
    await pipe.pipeline(
        fs.createReadStream(file),
        createDeflate(options),
        fs.createWriteStream(`${file}.zz`)
    );
}

const compressBrotli = async (file: string, options: BrotliOptions) => {
    await pipe.pipeline(
        fs.createReadStream(file),
        createBrotliCompress(options),
        fs.createWriteStream(`${file}.br`)
    );
}

function compressPlugin(options: CompressOptions = defaultOptions): Plugin {
    return {
        name: "esbuild-plugin-compress",
        setup(build) {
            build.onEnd(result => {
                if (!result.metafile) {
                    throw new Error("Expected metafile, but it does not exist. Please set `metafile: true` in the esbuild options.");
                }

                const resolvedOptions = {...defaultOptions, ...options};

                const files = Object.keys(result.metafile.outputs);
                const picoExcludes = resolvedOptions.excludes.map(exclude => picomatch(exclude));

                files.forEach(async file => {
                    if (picoExcludes.some(exclude => exclude(file))) {
                        return;
                    }

                    if (resolvedOptions.gzip) {
                        await compressGzip(file, resolvedOptions.gzipOptions);
                    }

                    if (resolvedOptions.deflate) {
                        await compressDeflate(file, resolvedOptions.deflateOptions);
                    }

                    if (resolvedOptions.brotli) {
                        await compressBrotli(file, resolvedOptions.brotliOptions);
                    }
                });
            })
        }
    };
}

module.exports = compressPlugin;
