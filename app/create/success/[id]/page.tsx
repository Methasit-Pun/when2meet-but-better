"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ClipboardCopyIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function EventCreatedPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params
  const [eventData, setEventData] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // In a real app, we would fetch this from a server
    const storedEvent = localStorage.getItem(`event-${id}`)

    if (storedEvent) {
      const parsedEvent = JSON.parse(storedEvent)
      setEventData(parsedEvent)
    } else {
      // Event not found, redirect to home
      router.push("/")
    }
  }, [id, router])

  const eventUrl = typeof window !== "undefined" ? `${window.location.origin}/event/${id}` : `/event/${id}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl).then(() => {
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Event link has been copied to clipboard",
      })

      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!eventData) {
    return <div className="container mx-auto p-8 text-center">Loading event data...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <CheckIcon className="h-5 w-5" />
              </div>
              Event Created!
            </CardTitle>
            <CardDescription>Your event "{eventData.name}" has been created successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600 mb-2">Share this link with participants:</p>
              <div className="flex items-center gap-2">
                <code className="bg-slate-100 px-3 py-2 rounded text-sm flex-1 overflow-x-auto">{eventUrl}</code>
                <Button variant="outline" size="icon" onClick={handleCopyLink} className="flex-shrink-0">
                  {copied ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ClipboardCopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button asChild className="w-full">
              <Link href={`/event/${id}`}>Go to Event</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

