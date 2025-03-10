"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TimeRangePickerProps {
  startTime: string
  endTime: string
  onStartTimeChange: (time: string) => void
  onEndTimeChange: (time: string) => void
}

export function TimeRangePicker({ startTime, endTime, onStartTimeChange, onEndTimeChange }: TimeRangePickerProps) {
  // Generate time options in 30-minute increments
  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, "0")
      const formattedMinute = minute.toString().padStart(2, "0")
      timeOptions.push(`${formattedHour}:${formattedMinute}`)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="start-time">Start Time</Label>
        <Select value={startTime} onValueChange={onStartTimeChange}>
          <SelectTrigger id="start-time">
            <SelectValue placeholder="Start time" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={`start-${time}`} value={time}>
                {formatTimeDisplay(time)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="end-time">End Time</Label>
        <Select value={endTime} onValueChange={onEndTimeChange}>
          <SelectTrigger id="end-time">
            <SelectValue placeholder="End time" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={`end-${time}`} value={time} disabled={time <= startTime}>
                {formatTimeDisplay(time)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// Helper function to format time for display (24h to 12h format)
function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
}

