/// <reference types="vite/client" />
/// <reference types="@samrum/vite-plugin-web-extension/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  // eslint-disable-next-line ts/no-empty-object-type
  const component: DefineComponent<{}, {}, any>
  export default component
}
