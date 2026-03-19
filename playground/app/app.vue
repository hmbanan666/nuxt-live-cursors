<template>
  <div
    :style="{ minHeight: '300vh', margin: '-8px', padding: '0', fontFamily: 'system-ui, sans-serif', color: '#e5e5e5', backgroundColor: '#0a0a0a' }"
  >
    <!-- Hero -->
    <div
      :style="{ padding: '80px 32px', textAlign: 'center', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)' }"
    >
      <p
        :style="{ fontSize: '14px', color: '#a855f7', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }"
      >
        nuxt module
      </p>
      <h1
        :style="{ fontSize: '64px', fontWeight: 800, margin: '0 0 16px', color: '#c084fc' }"
      >
        Live Cursors
      </h1>
      <p :style="{ fontSize: '20px', color: '#737373', maxWidth: '500px', margin: '0 auto 40px' }">
        See who's browsing your site in real time. Zero config, plug and play.
      </p>
      <div :style="{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }">
        <button
          :style="{
            padding: '12px 28px',
            borderRadius: '9999px',
            border: 'none',
            background: fakeCursorsActive ? 'linear-gradient(135deg, #ef4444, #f97316)' : 'linear-gradient(135deg, #a855f7, #3b82f6)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600,
            boxShadow: fakeCursorsActive ? '0 0 30px rgba(239,68,68,0.3)' : '0 0 30px rgba(168,85,247,0.3)',
            transition: 'all 300ms',
          }"
          @click="toggleFakeCursors"
        >
          {{ fakeCursorsActive ? 'Stop simulation' : 'Launch fake cursors' }}
        </button>
      </div>
      <div :style="{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '16px' }">
        <button
          v-for="loc in locales"
          :key="loc.value"
          :style="{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: locale === loc.value ? '1px solid #a855f7' : '1px solid #333',
            backgroundColor: locale === loc.value ? 'rgba(168,85,247,0.15)' : 'transparent',
            color: locale === loc.value ? '#c084fc' : '#737373',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            transition: 'all 200ms',
          }"
          @click="locale = loc.value"
        >
          {{ loc.label }}
        </button>
      </div>
      <p :style="{ fontSize: '13px', color: '#525252', margin: 0 }">
        {{ fakeCursorsActive ? `${fakeCount} visitors wandering around...` : 'Click to spawn 3 fake visitors' }}
      </p>
    </div>

    <!-- Features grid -->
    <div :style="{ padding: '64px 32px', maxWidth: '900px', margin: '0 auto' }">
      <h2 :style="{ fontSize: '32px', fontWeight: 700, textAlign: 'center', marginBottom: '48px' }">
        Features
      </h2>
      <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }">
        <div
          v-for="feature in features"
          :key="feature.title"
          :style="{
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #1a1a1a',
            backgroundColor: '#111',
            transition: 'border-color 300ms',
          }"
        >
          <div :style="{ fontSize: '32px', marginBottom: '12px' }">
            {{ feature.icon }}
          </div>
          <h3 :style="{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }">
            {{ feature.title }}
          </h3>
          <p :style="{ fontSize: '14px', color: '#737373', lineHeight: '1.5', margin: 0 }">
            {{ feature.desc }}
          </p>
        </div>
      </div>
    </div>

    <!-- Code snippet -->
    <div :style="{ padding: '64px 32px', textAlign: 'center' }">
      <h2 :style="{ fontSize: '32px', fontWeight: 700, marginBottom: '32px' }">
        One line to add
      </h2>
      <div
        :style="{ display: 'inline-block', padding: '20px 32px', borderRadius: '12px', backgroundColor: '#111', border: '1px solid #1a1a1a', fontFamily: 'monospace', fontSize: '16px' }"
      >
        <span :style="{ color: '#525252' }">&lt;</span><span :style="{ color: '#a855f7' }">LiveCursors</span>
        <span :style="{ color: '#3b82f6' }"> locale</span><span :style="{ color: '#525252' }">=</span><span
          :style="{ color: '#06b6d4' }"
        >"{{ locale }}"</span>
        <span :style="{ color: '#525252' }"> /&gt;</span>
      </div>
    </div>

    <!-- Testimonials / fun cards -->
    <div :style="{ padding: '64px 32px', maxWidth: '900px', margin: '0 auto' }">
      <h2 :style="{ fontSize: '32px', fontWeight: 700, textAlign: 'center', marginBottom: '48px' }">
        What people say
      </h2>
      <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }">
        <div
          v-for="(quote, i) in quotes"
          :key="i"
          :style="{
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #1a1a1a',
            backgroundColor: '#111',
          }"
        >
          <p
            :style="{ fontSize: '14px', color: '#a3a3a3', lineHeight: '1.6', margin: '0 0 16px', fontStyle: 'italic' }"
          >
            "{{ quote.text }}"
          </p>
          <div :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
            <div
              :style="{ width: '32px', height: '32px', borderRadius: '9999px', background: quote.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }"
            >
              {{ quote.emoji }}
            </div>
            <div>
              <p :style="{ fontSize: '13px', fontWeight: 600, margin: 0 }">
                {{ quote.name }}
              </p>
              <p :style="{ fontSize: '12px', color: '#525252', margin: 0 }">
                {{ quote.role }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div
      :style="{ padding: '80px 32px', textAlign: 'center', background: 'linear-gradient(135deg, #0a0a0a 0%, #0a1a2e 50%, #0a0a0a 100%)' }"
    >
      <div :style="{ display: 'flex', justifyContent: 'center', gap: '64px', flexWrap: 'wrap' }">
        <div v-for="stat in stats" :key="stat.label">
          <p
            :style="{ fontSize: '48px', fontWeight: 800, margin: '0 0 4px', color: '#38bdf8' }"
          >
            {{ stat.value }}
          </p>
          <p :style="{ fontSize: '14px', color: '#525252', margin: 0 }">
            {{ stat.label }}
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div :style="{ padding: '48px 32px', textAlign: 'center', borderTop: '1px solid #1a1a1a' }">
      <p :style="{ fontSize: '14px', color: '#404040', margin: 0 }">
        Built with Nuxt, WebSockets, and a bit of magic.
      </p>
    </div>

    <LiveCursors :locale="locale" />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

const features = [
  { icon: '👆', title: 'Real-time cursors', desc: 'See every visitor\'s cursor moving live on your page.' },
  { icon: '🎭', title: 'Random identities', desc: 'Each visitor gets a fun animal name and unique avatar.' },
  { icon: '🔌', title: 'Zero config', desc: 'Drop in the component and it just works. WebSocket included.' },
  { icon: '🌍', title: 'i18n ready', desc: 'Built-in English and Russian. Add your own locales easily.' },
  { icon: '📍', title: 'Page-aware', desc: 'Cursors only appear from visitors on the same page.' },
  { icon: '🎨', title: 'Customizable', desc: 'Slots, props, position control. Make it yours.' },
]

const quotes = [
  { text: 'Finally my landing page feels alive. Visitors love seeing each other.', name: 'Curious Cat', role: 'indie hacker', emoji: '🐱', color: '#7c3aed' },
  { text: 'Added it to our docs site. Now we know someone is actually reading them.', name: 'Bold Eagle', role: 'tech lead', emoji: '🦅', color: '#2563eb' },
  { text: 'The shuffle button is oddly satisfying. I\'ve been clicking it for 10 minutes.', name: 'Warm Otter', role: 'designer', emoji: '🦦', color: '#0891b2' },
]

const stats = [
  { value: '0kb', label: 'client dependencies' },
  { value: '<1s', label: 'setup time' },
  { value: '50ms', label: 'update interval' },
  { value: '∞', label: 'fun factor' },
]

const locale = ref('en')
const locales = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
]

const fakeCursorsActive = ref(false)
const fakeCount = ref(0)
const fakeSockets: WebSocket[] = []
const fakeIntervals: ReturnType<typeof setInterval>[] = []

function createFakeCursor() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const ws = new WebSocket(`${protocol}//${window.location.host}/_live-cursors-ws`)

  const maxY = window.innerHeight
  let x = 0.2 + Math.random() * 0.6
  let y = 100 + Math.random() * (maxY - 200)
  let dx = (Math.random() - 0.5) * 0.006
  let dy = (Math.random() - 0.5) * 2

  ws.onopen = () => {
    fakeCount.value++

    const interval = setInterval(() => {
      x += dx
      y += dy

      if (x < 0.05 || x > 0.95) {
        dx = -dx
      }
      if (y < 50 || y > maxY - 50) {
        dy = -dy
      }

      dx += (Math.random() - 0.5) * 0.002
      dy += (Math.random() - 0.5) * 0.8

      ws.send(JSON.stringify({
        type: 'move',
        x: Math.max(0, Math.min(1, x)),
        y: Math.round(Math.max(0, Math.min(maxY, y))),
        page: '/',
      }))
    }, 100)

    fakeIntervals.push(interval)
  }

  ws.onclose = () => {
    fakeCount.value = Math.max(0, fakeCount.value - 1)
  }

  fakeSockets.push(ws)
}

function stopFakeCursors() {
  fakeIntervals.forEach(clearInterval)
  fakeIntervals.length = 0
  fakeSockets.forEach((ws) => {
    ws.onclose = null
    ws.close()
  })
  fakeSockets.length = 0
  fakeCount.value = 0
}

function toggleFakeCursors() {
  if (fakeCursorsActive.value) {
    stopFakeCursors()
    fakeCursorsActive.value = false
  } else {
    for (let i = 0; i < 3; i++) {
      createFakeCursor()
    }
    fakeCursorsActive.value = true
  }
}

onUnmounted(() => {
  stopFakeCursors()
})
</script>
