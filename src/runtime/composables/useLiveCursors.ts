import type { ModuleOptions } from '../../module'
import { useRoute, useRuntimeConfig } from '#imports'
import { onMounted, onUnmounted, ref } from 'vue'

export interface CursorInfo {
  id: string
  /** X position as fraction of viewport width (0-1) */
  x: number
  /** Y position as absolute page coordinate in pixels */
  y: number
  nameKey: string
  color: string
  avatar: string
  page: string
}

export interface OnlineUser {
  id: string
  nameKey: string
  color: string
  avatar: string
}

export function useLiveCursors() {
  const cursors = ref<CursorInfo[]>([])
  const onlineUsers = ref<OnlineUser[]>([])
  const myId = ref('')
  const myNameKey = ref('')
  const myColor = ref('')
  const myAvatar = ref('')
  const onlineCount = ref(0)
  const isConnected = ref(false)

  let ws: WebSocket | null = null
  let throttleTimer: ReturnType<typeof setTimeout> | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let lastSent = 0

  const route = useRoute()
  const config = useRuntimeConfig()
  const liveCursors = (config.public.liveCursors || {}) as Partial<ModuleOptions>
  const wsPath = liveCursors.wsPath || '/_live-cursors-ws'
  const throttleMs = liveCursors.throttleMs || 50
  const stripPrefixes = liveCursors.stripLocalePrefixes || []

  function normalizePath(path: string): string {
    if (stripPrefixes.length === 0) {
      return path
    }
    for (const prefix of stripPrefixes) {
      if (path === `/${prefix}` || path === `/${prefix}/`) {
        return '/'
      }
      if (path.startsWith(`/${prefix}/`)) {
        return path.slice(prefix.length + 1)
      }
    }
    return path
  }

  function connect() {
    if (import.meta.server) {
      return
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = `${protocol}//${window.location.host}${wsPath}`

    ws = new WebSocket(url)

    ws.onopen = () => {
      isConnected.value = true
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)

        if (msg.type === 'welcome') {
          myId.value = msg.id
          myNameKey.value = msg.nameKey
          myColor.value = msg.color
          myAvatar.value = msg.avatar
          onlineCount.value = msg.count
        } else if (msg.type === 'updated') {
          myNameKey.value = msg.nameKey
          myColor.value = msg.color
          myAvatar.value = msg.avatar
        } else if (msg.type === 'cursors') {
          const myPage = normalizePath(route.path)
          cursors.value = msg.cursors.filter(
            (c: CursorInfo) => c.id !== myId.value && c.page === myPage,
          )
        } else if (msg.type === 'online') {
          onlineCount.value = msg.count
          onlineUsers.value = msg.users
        }
      } catch {
        // ignore
      }
    }

    ws.onclose = () => {
      isConnected.value = false
      cursors.value = []
      onlineUsers.value = []
      reconnectTimer = setTimeout(connect, 3000)
    }
  }

  function sendPosition(x: number, y: number) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return
    }

    const now = Date.now()
    if (now - lastSent < throttleMs) {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          throttleTimer = null
          sendPosition(x, y)
        }, throttleMs)
      }
      return
    }

    lastSent = now
    ws.send(JSON.stringify({
      type: 'move',
      x,
      y: Math.round(y),
      page: normalizePath(route.path),
    }))
  }

  function onMouseMove(e: MouseEvent) {
    const xFraction = e.clientX / window.innerWidth
    sendPosition(xFraction, e.clientY + window.scrollY)
  }

  function shuffle() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'shuffle' }))
    }
  }

  onMounted(() => {
    connect()
    window.addEventListener('mousemove', onMouseMove)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    if (throttleTimer) {
      clearTimeout(throttleTimer)
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
    }
    if (ws) {
      ws.onclose = null
      ws.close()
    }
  })

  return {
    cursors,
    onlineUsers,
    myId,
    myNameKey,
    myColor,
    myAvatar,
    onlineCount,
    isConnected,
    shuffle,
  }
}
