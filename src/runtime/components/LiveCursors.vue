<template>
  <div
    :style="{
      pointerEvents: 'none',
      position: 'fixed',
      inset: '0',
      zIndex: 100,
      overflow: 'hidden',
    }"
  >
    <TransitionGroup name="live-cursor">
      <div
        v-for="cursor in cursors"
        :key="cursor.id"
        :style="{
          position: 'absolute',
          transition: 'all 150ms ease-out',
          left: `${cursor.x - scrollX}px`,
          top: `${cursor.y - scrollY}px`,
        }"
      >
        <svg
          width="18"
          height="22"
          viewBox="0 0 18 22"
          fill="none"
          :style="{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }"
        >
          <path
            d="M2.5 1L16 12.5H8.5L5.5 21L2.5 1Z"
            :fill="cursor.color"
            stroke="white"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
        <div
          :style="{
            marginLeft: '12px',
            marginTop: '-4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            borderRadius: '9999px',
            padding: '2px 10px 2px 2px',
            fontSize: '12px',
            fontWeight: 500,
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)',
            backgroundColor: cursor.color,
          }"
        >
          <img
            :src="cursor.avatar"
            :alt="cursorName(cursor)"
            :style="{
              height: '24px',
              width: '24px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255,255,255,0.2)',
            }"
          >
          <slot name="cursor-name" :cursor="cursor">
            {{ cursorName(cursor) }}
          </slot>
        </div>
      </div>
    </TransitionGroup>
  </div>

  <!-- Profile popover -->
  <Transition name="live-cursor-pop">
    <div
      v-if="showProfile"
      :style="{
        position: 'fixed',
        bottom: '64px',
        left: '50%',
        zIndex: 50,
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        borderRadius: '16px',
        border: '1px solid rgba(64,64,64,0.5)',
        backgroundColor: 'rgba(23,23,23,0.9)',
        padding: '16px 24px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
      }"
    >
      <img
        :src="myAvatar"
        :style="{
          height: '64px',
          width: '64px',
          borderRadius: '9999px',
          outline: `2px solid ${myColor}`,
          outlineOffset: '2px',
        }"
      >
      <span
        :style="{
          borderRadius: '9999px',
          padding: '2px 10px',
          fontSize: '14px',
          fontWeight: 500,
          color: 'white',
          backgroundColor: myColor,
        }"
      >
        <slot name="my-name">
          {{ resolveName(myNameKey) }}
        </slot>
      </span>
      <p :style="{ fontSize: '12px', color: '#737373', margin: 0 }">
        {{ labels.you }}
      </p>
      <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
        <slot name="profile-actions" :shuffle="shuffle">
          <button
            :style="{
              borderRadius: '8px',
              backgroundColor: '#262626',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#d4d4d4',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 150ms',
            }"
            @mouseover="($event.target as HTMLElement).style.backgroundColor = '#404040'"
            @mouseleave="($event.target as HTMLElement).style.backgroundColor = '#262626'"
            @click="shuffle"
          >
            {{ labels.shuffle }}
          </button>
        </slot>
      </div>
    </div>
  </Transition>

  <!-- Online bar -->
  <Transition name="live-cursor-fade">
    <button
      v-if="onlineCount > 0"
      :style="{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        zIndex: 50,
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderRadius: '9999px',
        border: '1px solid rgba(64,64,64,0.5)',
        backgroundColor: 'rgba(23,23,23,0.8)',
        padding: '8px 16px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(8px)',
        cursor: 'pointer',
        transition: 'all 150ms',
        fontFamily: 'inherit',
      }"
      @mouseover="($event.currentTarget as HTMLElement).style.backgroundColor = 'rgba(23,23,23,1)'"
      @mouseleave="($event.currentTarget as HTMLElement).style.backgroundColor = 'rgba(23,23,23,0.8)'"
      @click="showProfile = !showProfile"
    >
      <span
        :style="{
          position: 'relative',
          display: 'flex',
          height: '8px',
          width: '8px',
          flexShrink: 0,
        }"
      >
        <span
          :style="{
            position: 'absolute',
            display: 'inline-flex',
            height: '100%',
            width: '100%',
            borderRadius: '9999px',
            backgroundColor: '#4ade80',
            opacity: 0.75,
            animation: 'live-cursor-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
          }"
        />
        <span
          :style="{
            position: 'relative',
            display: 'inline-flex',
            height: '8px',
            width: '8px',
            borderRadius: '9999px',
            backgroundColor: '#22c55e',
          }"
        />
      </span>
      <div :style="{ display: 'flex' }">
        <img
          v-for="(user, index) in onlineUsers.slice(0, 8)"
          :key="user.id"
          :src="user.avatar"
          :alt="userName(user)"
          :title="userName(user)"
          :style="{
            height: '24px',
            width: '24px',
            borderRadius: '9999px',
            outline: '2px solid #171717',
            marginLeft: index > 0 ? '-6px' : '0',
          }"
        >
        <div
          v-if="onlineUsers.length > 8"
          :style="{
            height: '24px',
            width: '24px',
            borderRadius: '9999px',
            backgroundColor: '#404040',
            fontSize: '10px',
            fontWeight: 500,
            color: '#a3a3a3',
            outline: '2px solid #171717',
            marginLeft: '-6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }"
        >
          +{{ onlineUsers.length - 8 }}
        </div>
      </div>
      <span :style="{ fontSize: '12px', color: '#a3a3a3' }">
        <slot name="online-text" :count="onlineCount">
          {{ labels.online.replace('{count}', String(onlineCount)) }}
        </slot>
      </span>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CursorInfo, OnlineUser } from '../composables/useLiveCursors'
import { useLiveCursors } from '../composables/useLiveCursors'
import { getLocale } from '../locales'

const props = withDefaults(defineProps<{
  /** Display locale. Built-in: 'en', 'ru'. Default: 'en' */
  locale?: string
}>(), {
  locale: 'en',
})

const l = computed(() => getLocale(props.locale))
const labels = computed(() => l.value.ui)

const { cursors, onlineUsers, onlineCount, myNameKey, myColor, myAvatar, shuffle } = useLiveCursors()

function resolveName(nameKey: string) {
  return l.value.names[nameKey] || nameKey
}

function cursorName(cursor: CursorInfo) {
  return resolveName(cursor.nameKey)
}

function userName(user: OnlineUser) {
  return resolveName(user.nameKey)
}

const scrollX = ref(0)
const scrollY = ref(0)
const showProfile = ref(false)

if (import.meta.client) {
  const onScroll = () => {
    scrollX.value = window.scrollX
    scrollY.value = window.scrollY
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })
}
</script>

<style>
@keyframes live-cursor-ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.live-cursor-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.live-cursor-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.live-cursor-enter-from,
.live-cursor-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.live-cursor-fade-enter-active,
.live-cursor-fade-leave-active {
  transition: opacity 0.3s ease;
}
.live-cursor-fade-enter-from,
.live-cursor-fade-leave-to {
  opacity: 0;
}

.live-cursor-pop-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.live-cursor-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.live-cursor-pop-enter-from,
.live-cursor-pop-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px) scale(0.95);
}
</style>
