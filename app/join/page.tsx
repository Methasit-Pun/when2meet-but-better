"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function JoinEvent() {
  const router = useRouter()
  const [eventId, setEventId] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, we would validate the event ID on the server
    const storedEvent = localStorage.getItem(`event-${eventId}`)

    if (storedEvent) {
      router.push(`/event/${eventId}`)
    } else {
      setError("Event not found. Please check the ID and try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Join an Event</CardTitle>
            <CardDescription>Enter the event ID to join</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event-id">Event ID</Label>
                <Input
                  id="event-id"
                  placeholder="Enter event ID"
                  value={eventId}
                  onChange={(e) => {
                    setEventId(e.target.value)
                    setError("")
                  }}
                  required
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={!eventId}>
                Join Event
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

