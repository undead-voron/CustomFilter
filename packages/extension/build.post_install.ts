import path from 'node:path'

import fs from 'fs-extra'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue';
import swc from 'vite-plugin-swc-transform';
import {resolve} from 'path';

async function buildPostInstall(workingDir: string): Promise<void> {
  const bundleFileName = 'post_install_build'
  console.log("show check")
  await build({
    configFile: false,
    logLevel: 'info',
    build: {
        outDir: workingDir,
        emptyOutDir: false,
        minify: true,
        // lib: {
        //     entry: 'src/entries/post_install/index.html',
        //     formats: ['umd'],
        //     name: bundleFileName,
        //     fileName: bundleFileName,
        // },
        rollupOptions: {
            input: {
              welcome: resolve(__dirname, 'src/entries/post_install/index.html')
            }
          }
    },
    plugins: [
        vue({ script: { propsDestructure: true } }),
        swc({
          swcOptions: {
            jsc: {
              target: 'es2022',
              transform: {
                legacyDecorator: true,
                decoratorMetadata: true,
                useDefineForClassFields: false,
              },
              // externalHelpers: true,
            },
          },
        }),
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './src'),
        },
    },
  })
}

export default buildPostInstall
