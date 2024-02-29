# esbuild-plugin-compress

[![Build](https://github.com/Liber-UFPE/esbuild-plugin-compress/actions/workflows/build.yml/badge.svg)](https://github.com/Liber-UFPE/esbuild-plugin-compress/actions/workflows/build.yml)
[![CodeQL](https://github.com/Liber-UFPE/esbuild-plugin-compress/actions/workflows/codeql.yml/badge.svg)](https://github.com/Liber-UFPE/esbuild-plugin-compress/actions/workflows/codeql.yml)

An esbuild plugin to compress output using gzip, brotli, and deflate. Based on [Node's zlib API](https://nodejs.org/api/zlib.html).

## Install

```shell
npm install esbuild-plugin-compress --save-dev
```

## Usage

> [!IMPORTANT]
> `metafile: true` option is required to generate the compressed files. See more about [metafile in esbuild docs](https://esbuild.github.io/api/#metafile).

```javascript
import esbuild from "esbuild";
import compressPlugin from "esbuild-plugin-compress";

const compress = compressPlugin();

esbuild.build({
  entryPoints: ["src/index.js"],
  bundle: true,
  metafile: true,
  outfile: "dist/index.js",
  plugins: [compress],
}).catch(() => process.exit(1));
```

Or when customizing the compression options:

```javascript
import esbuild from "esbuild";
import compressPlugin from "esbuild-plugin-compress";

const compress = compressPlugin({
  gzip: true,
  brotli: false,
  gzipOptions: { level: constants.Z_BEST_SPEED },
  deflateOptions: { level: constants.Z_DEFAULT_COMPRESSION },
  excludes: ["**/*.{webp,avif,jpg,png}"]
});

esbuild.build({
  entryPoints: ["src/index.js"],
  bundle: true,
  metafile: true,
  outfile: "dist/index.js",
  plugins: [compress],
}).catch(() => process.exit(1));
```

## Options

- `gzip`: Enable gzip compression.
    - type: `boolean`
    - default: `true`
- `brotli`: Enable brotli compression.
    - type: `boolean`
    - default: `true`
- `deflate`: Enable deflate compression.
    - type: `boolean`
    - default: `true`
- `excludes`: glob patterns to exclude files from compression.
    - type: `string[]`
    - default: `[]`
- `gzipOptions`: `ZlibOptions` for gzip compression.
    - type: `ZlibOptions`
    - default: `{level: constants.Z_BEST_COMPRESSION}`
- `deflateOptions`: `ZlibOptions` for deflate compression.
    - type: `ZlibOptions`
    - default: `{level: constants.Z_BEST_COMPRESSION}`
- `brotliOptions`: `BrotliOptions` for brotli compression.
    - type: `BrotliOptions`
    - default: `{}`
