// ============================================
// PUSHER REAL-TIME INTEGRATION
// WebSockets and real-time events
// ============================================

import Pusher from 'pusher'
import PusherClient from 'pusher-js'

export type PusherConfig = {
  appId: string
  key: string
  secret: string
  cluster: string
}

// ============================================
// SERVER-SIDE PUSHER
// ============================================

let pusherServer: Pusher | null = null

export function getPusherServer(config?: PusherConfig): Pusher {
  if (!pusherServer) {
    const appId = config?.appId || process.env.PUSHER_APP_ID!
    const key = config?.key || process.env.NEXT_PUBLIC_PUSHER_KEY!
    const secret = config?.secret || process.env.PUSHER_SECRET!
    const cluster = config?.cluster || process.env.NEXT_PUBLIC_PUSHER_CLUSTER!

    pusherServer = new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    })
  }

  return pusherServer
}

export async function triggerEvent(channel: string, event: string, data: any) {
  const pusher = getPusherServer()
  await pusher.trigger(channel, event, data)
  return { success: true }
}

export async function triggerBatch(channels: string[], event: string, data: any) {
  const pusher = getPusherServer()
  await pusher.trigger(channels, event, data)
  return { success: true }
}

// ============================================
// CLIENT-SIDE PUSHER
// ============================================

let pusherClient: PusherClient | null = null

export function getPusherClient(): PusherClient {
  if (!pusherClient) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY!
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER!

    pusherClient = new PusherClient(key, {
      cluster,
    })
  }

  return pusherClient
}

export function subscribe(channelName: string) {
  const pusher = getPusherClient()
  return pusher.subscribe(channelName)
}

export function unsubscribe(channelName: string) {
  const pusher = getPusherClient()
  pusher.unsubscribe(channelName)
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export async function sendNotification(userId: string, notification: any) {
  return triggerEvent(`user-${userId}`, 'notification', notification)
}

export async function broadcastMessage(channel: string, message: any) {
  return triggerEvent(channel, 'message', message)
}

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Server-side: Trigger Event
import { triggerEvent } from '@/lib/integrations/pusher'

await triggerEvent('chat-room-1', 'new-message', {
  user: 'John',
  message: 'Hello!',
  timestamp: new Date(),
})

// Client-side: Subscribe to Events
'use client'

import { useEffect } from 'react'
import { subscribe } from '@/lib/integrations/pusher'

export function Chat() {
  useEffect(() => {
    const channel = subscribe('chat-room-1')

    channel.bind('new-message', (data: any) => {
      console.log('New message:', data)
    })

    return () => {
      channel.unbind_all()
    }
  }, [])

  return <div>Chat Component</div>
}
*/
