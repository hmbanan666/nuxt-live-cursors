import { createAvatar } from '@nextorders/avatar'
import { defineEventHandler, getQuery, getRouterParam, setResponseHeader } from 'nitropack/runtime'

const EMOTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const
const CLOTHING = ['amber', 'green', 'blue', 'teal', 'pink', 'violet'] as const

type Emotion = typeof EMOTIONS[number]
type Clothing = typeof CLOTHING[number]

export default defineEventHandler((event) => {
  const seed = getRouterParam(event, 'seed') || 'default'
  const query = getQuery(event)

  const gender = query.gender === 'female' ? 'female' : 'male'
  const emotion = (EMOTIONS.includes(Number(query.emotion) as Emotion) ? Number(query.emotion) : 5) as Emotion
  const clothing = (CLOTHING.includes(query.clothing as Clothing) ? query.clothing : 'blue') as Clothing

  const svg = createAvatar({ seed, gender, emotion, clothing })

  setResponseHeader(event, 'Content-Type', 'image/svg+xml')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  return svg
})
