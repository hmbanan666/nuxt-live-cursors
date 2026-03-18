import { addComponentsDir, addImportsDir, addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions {
  /** WebSocket endpoint path. Default: '/_live-cursors-ws' */
  wsPath: string
  /** Avatar API endpoint path. Default: '/_live-cursors-avatar' */
  avatarPath: string
  /** Throttle interval in ms for cursor position updates. Default: 50 */
  throttleMs: number
  /** Locale prefixes to strip from page paths for cross-locale cursor visibility. E.g. ['en', 'de'] */
  stripLocalePrefixes: string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-live-cursors',
    configKey: 'liveCursors',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    wsPath: '/_live-cursors-ws',
    avatarPath: '/_live-cursors-avatar',
    throttleMs: 50,
    stripLocalePrefixes: [] as string[],
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Enable Nitro WebSocket
    nuxt.options.nitro = nuxt.options.nitro || {}
    nuxt.options.nitro.experimental = nuxt.options.nitro.experimental || {}
    nuxt.options.nitro.experimental.websocket = true

    // Provide module options to runtime
    nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {}
    nuxt.options.runtimeConfig.public.liveCursors = {
      wsPath: options.wsPath,
      avatarPath: options.avatarPath,
      throttleMs: options.throttleMs,
      stripLocalePrefixes: options.stripLocalePrefixes,
    } as ModuleOptions

    // Register server routes
    addServerHandler({
      route: options.wsPath,
      handler: resolve('./runtime/server/routes/ws'),
    })

    addServerHandler({
      route: `${options.avatarPath}/:seed`,
      method: 'get',
      handler: resolve('./runtime/server/routes/avatar/[seed].get'),
    })

    // Register composables
    addImportsDir(resolve('./runtime/composables'))

    // Register components
    addComponentsDir({
      path: resolve('./runtime/components'),
    })
  },
})
