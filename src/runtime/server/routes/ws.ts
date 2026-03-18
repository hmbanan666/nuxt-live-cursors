import type { Peer } from 'crossws'
import { defineWebSocketHandler } from 'h3'

interface CursorData {
  id: string
  x: number
  y: number
  nameKey: string
  color: string
  avatar: string
  page: string
}

const peers = new Map<Peer, CursorData>()

const nameKeys = [
  'curiousCat', 'silentFox', 'bravePanda', 'luckyOwl',
  'swiftFalcon', 'calmWhale', 'wildTiger', 'shyDeer',
  'boldEagle', 'kindBear', 'smartCrow', 'freeWolf',
  'warmOtter', 'coolLynx', 'fastHare', 'wiseTurtle',
  'deepSquid', 'loudParrot', 'softMoth', 'brightBee',
]

const colors = [
  '#f43f5e', '#8b5cf6', '#3b82f6', '#06b6d4',
  '#10b981', '#f59e0b', '#ec4899', '#6366f1',
  '#14b8a6', '#ef4444', '#a855f7', '#0ea5e9',
]

const genders = ['male', 'female'] as const
const clothingColors = ['amber', 'green', 'blue', 'teal', 'pink', 'violet'] as const

function getRandomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

function generateAvatarUrl(seed: string): string {
  const gender = getRandomItem(genders)
  const emotion = Math.floor(Math.random() * 10) + 1
  const clothing = getRandomItem(clothingColors)
  return `/api/live-cursors-avatar/${seed}?gender=${gender}&emotion=${emotion}&clothing=${clothing}`
}

function broadcastCursors(exclude?: Peer) {
  const cursors = Array.from(peers.values())
  const message = JSON.stringify({ type: 'cursors', cursors })

  for (const peer of peers.keys()) {
    if (peer !== exclude) {
      peer.send(message)
    }
  }
}

function broadcastOnline() {
  const users = Array.from(peers.values()).map(p => ({
    id: p.id,
    nameKey: p.nameKey,
    color: p.color,
    avatar: p.avatar,
  }))
  const msg = JSON.stringify({ type: 'online', count: peers.size, users })
  for (const p of peers.keys()) {
    p.send(msg)
  }
}

export default defineWebSocketHandler({
  open(peer) {
    const id = crypto.randomUUID().slice(0, 8)
    const data: CursorData = {
      id,
      x: -100,
      y: -100,
      nameKey: getRandomItem(nameKeys),
      color: getRandomItem(colors),
      avatar: generateAvatarUrl(id),
      page: '/',
    }
    peers.set(peer, data)

    peer.send(JSON.stringify({ type: 'welcome', ...data, count: peers.size }))

    const existingCursors = Array.from(peers.values()).filter(p => p.id !== id)
    peer.send(JSON.stringify({ type: 'cursors', cursors: existingCursors }))

    broadcastOnline()
  },

  message(peer, message) {
    const data = peers.get(peer)
    if (!data) return

    try {
      const msg = JSON.parse(message.text())
      if (msg.type === 'move') {
        data.x = msg.x
        data.y = msg.y
        data.page = msg.page || '/'
        broadcastCursors(peer)
      }
      else if (msg.type === 'shuffle') {
        data.nameKey = getRandomItem(nameKeys)
        data.color = getRandomItem(colors)
        data.avatar = generateAvatarUrl(crypto.randomUUID().slice(0, 8))
        peer.send(JSON.stringify({ type: 'updated', nameKey: data.nameKey, color: data.color, avatar: data.avatar }))
        broadcastCursors()
        broadcastOnline()
      }
    }
    catch {
      // ignore malformed messages
    }
  },

  close(peer) {
    peers.delete(peer)
    broadcastCursors()
    broadcastOnline()
  },
})
