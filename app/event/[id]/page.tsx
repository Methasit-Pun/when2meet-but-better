"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format, eachDayOfInterval, parse } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AvailabilityGrid } from "@/components/availability-grid"
import { ResultsGrid } from "@/components/results-grid"

// Add import for clipboard functionality and toast notifications
import { useToast } from "@/hooks/use-toast"
import { ClipboardCopyIcon } from "lucide-react"

interface EventData {
  id: string
  name: string
  dateRange: { from: string; to: string }
  timeRange: { start: string; end: string }
  timezone: string
  participants?: Participant[]
}

interface Participant {
  name: string
  availability: Record<string, boolean[]>
}

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const [eventData, setEventData] = useState<EventData | null>(null)
  const [userName, setUserName] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [activeTab, setActiveTab] = useState("availability")
  const [availability, setAvailability] = useState<Record<string, boolean[]>>({})

  // Add toast hook inside the component
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, we would fetch this from a server
    const storedEvent = localStorage.getItem(`event-${id}`)

    if (storedEvent) {
      const parsedEvent = JSON.parse(storedEvent)

      // Convert date strings back to Date objects
      parsedEvent.dateRange = {
        from: new Date(parsedEvent.dateRange.from),
        to: new Date(parsedEvent.dateRange.to),
      }

      setEventData(parsedEvent)

      // Initialize availability data structure
      if (!parsedEvent.participants) {
        parsedEvent.participants = []
        localStorage.setItem(`event-${id}`, JSON.stringify(parsedEvent))
      }
    } else {
      // Event not found, redirect to home
      router.push("/")
    }
  }, [id, router])

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()

    if (!eventData) return

    // Check if user already exists
    const existingParticipant = eventData.participants?.find((p) => p.name === userName)

    if (existingParticipant) {
      // In a real app, we would validate the password
      // For demo purposes, we'll just sign them in
      setAvailability(existingParticipant.availability)
    } else {
      // Create a new participant
      const newAvailability: Record<string, boolean[]> = {}

      // Initialize availability for each day
      const days = eachDayOfInterval({
        start: eventData.dateRange.from,
        end: eventData.dateRange.to,
      })

      days.forEach((day) => {
        const dateKey = format(day, "yyyy-MM-dd")
        const startTime = parse(eventData.timeRange.start, "HH:mm", new Date())
        const endTime = parse(eventData.timeRange.end, "HH:mm", new Date())

        // Calculate number of 30-minute slots
        const slotCount =
          (endTime.getHours() * 60 + endTime.getMinutes() - (startTime.getHours() * 60 + startTime.getMinutes())) / 30

        newAvailability[dateKey] = Array(slotCount).fill(false)
      })

      setAvailability(newAvailability)

      // Add new participant to event data
      const updatedEventData = { ...eventData }
      updatedEventData.participants = [
        ...(updatedEventData.participants || []),
        { name: userName, availability: newAvailability },
      ]

      // Save updated event data
      localStorage.setItem(`event-${id}`, JSON.stringify(updatedEventData))
      setEventData(updatedEventData)
    }

    setIsSignedIn(true)
  }

  const handleAvailabilityChange = (dateKey: string, slotIndex: number, isAvailable: boolean) => {
    const newAvailability = { ...availability }
    newAvailability[dateKey][slotIndex] = isAvailable
    setAvailability(newAvailability)

    // Update participant data in event
    if (eventData) {
      const updatedEventData = { ...eventData }
      const participantIndex = updatedEventData.participants?.findIndex((p) => p.name === userName) || -1

      if (participantIndex >= 0 && updatedEventData.participants) {
        updatedEventData.participants[participantIndex].availability = newAvailability
        localStorage.setItem(`event-${id}`, JSON.stringify(updatedEventData))
        setEventData(updatedEventData)
      }
    }
  }

  const handleSaveAvailability = () => {
    setActiveTab("results")
  }

  // Add a share function after the handleSaveAvailability function
  const handleShareLink = () => {
    const eventUrl = window.location.href
    navigator.clipboard.writeText(eventUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Event link has been copied to clipboard",
      })
    })
  }

  if (!eventData) {
    return <div className="container mx-auto p-8 text-center">Loading event data...</div>
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>{eventData.name}</CardTitle>
              <CardDescription>
                {format(eventData.dateRange.from, "MMM d")} - {format(eventData.dateRange.to, "MMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password (Optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="To edit your availability later"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                  />
                  <p className="text-xs text-slate-500">Set a password if you want to edit your availability later</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={!userName}>
                  Sign In
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-6">
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            {/* Add the share button in the header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>{eventData.name}</CardTitle>
                <CardDescription>
                  {format(eventData.dateRange.from, "MMM d")} - {format(eventData.dateRange.to, "MMM d, yyyy")}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleShareLink}>
                  <ClipboardCopyIcon className="h-4 w-4" />
                  Share Link
                </Button>
                <span className="text-sm text-slate-500 ml-2">Signed in as:</span>
                <span className="font-medium">{userName}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="availability">Mark Availability</TabsTrigger>
                <TabsTrigger value="results">View Results</TabsTrigger>
              </TabsList>
              <TabsContent value="availability" className="pt-6">
                <div className="space-y-6">
                  <div className="bg-slate-100 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Instructions</h3>
                    <p className="text-sm text-slate-600">
                      Click and drag to select times when you're available. Click again to deselect.
                    </p>
                  </div>

                  {eventData.dateRange && (
                    <AvailabilityGrid
                      dateRange={eventData.dateRange}
                      timeRange={eventData.timeRange}
                      availability={availability}
                      onAvailabilityChange={handleAvailabilityChange}
                    />
                  )}

                  <div className="flex justify-end">
                    <Button onClick={handleSaveAvailability}>Save & View Results</Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="results" className="pt-6">
                {eventData.participants && eventData.participants.length > 0 ? (
                  <ResultsGrid
                    dateRange={eventData.dateRange}
                    timeRange={eventData.timeRange}
                    participants={eventData.participants}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No availability data yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

