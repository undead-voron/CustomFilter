import path from 'node:path'
import process from 'node:process'
import webExtension from '@samrum/vite-plugin-web-extension'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import swc from 'vite-plugin-swc-transform'

import { getManifest } from './src/manifest'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {

    logLevel: 'info',
    plugins: [
      vue({ script: { propsDestructure: true } }),
      webExtension({
        manifest: getManifest(Number(env.MANIFEST_VERSION) || 3),
        additionalInputs: {
          scripts: [{ fileName: './src/entries/post_install/main.ts', webAccessible: true }],
        },
      }),
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
  }
})
