import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'

export interface CursorInfo {
  id: string
  x: number
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
  let lastSent = 0

  const route = useRoute()
  const config = useRuntimeConfig()
  const wsPath = config.public.liveCursors?.wsPath || '/_ws'
  const throttleMs = config.public.liveCursors?.throttleMs || 50

  function connect() {
    if (import.meta.server) return

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
        }
        else if (msg.type === 'updated') {
          myNameKey.value = msg.nameKey
          myColor.value = msg.color
          myAvatar.value = msg.avatar
        }
        else if (msg.type === 'cursors') {
          cursors.value = msg.cursors.filter(
            (c: CursorInfo) => c.id !== myId.value && c.page === route.path,
          )
        }
        else if (msg.type === 'online') {
          onlineCount.value = msg.count
          onlineUsers.value = msg.users
        }
      }
      catch {
        // ignore
      }
    }

    ws.onclose = () => {
      isConnected.value = false
      cursors.value = []
      onlineUsers.value = []
      setTimeout(connect, 3000)
    }
  }

  function sendPosition(x: number, y: number) {
    if (!ws || ws.readyState !== WebSocket.OPEN) return

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
      x: Math.round(x),
      y: Math.round(y),
      page: route.path,
    }))
  }

  function onMouseMove(e: MouseEvent) {
    sendPosition(e.clientX + window.scrollX, e.clientY + window.scrollY)
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
    if (throttleTimer) clearTimeout(throttleTimer)
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
