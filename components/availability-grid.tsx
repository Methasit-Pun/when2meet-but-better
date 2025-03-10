"use client"

import { useState, useRef, useEffect } from "react"
import { format, eachDayOfInterval, parse, addMinutes } from "date-fns"

interface AvailabilityGridProps {
  dateRange: { from: Date; to: Date }
  timeRange: { start: string; end: string }
  availability: Record<string, boolean[]>
  onAvailabilityChange: (dateKey: string, slotIndex: number, isAvailable: boolean) => void
}

export function AvailabilityGrid({ dateRange, timeRange, availability, onAvailabilityChange }: AvailabilityGridProps) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionValue, setSelectionValue] = useState(true)
  const gridRef = useRef<HTMLDivElement>(null)

  const days = eachDayOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  })

  const startTime = parse(timeRange.start, "HH:mm", new Date())
  const endTime = parse(timeRange.end, "HH:mm", new Date())

  // Calculate number of 30-minute slots
  const slotCount =
    (endTime.getHours() * 60 + endTime.getMinutes() - (startTime.getHours() * 60 + startTime.getMinutes())) / 30

  // Generate time labels
  const timeLabels = []
  let currentTime = startTime
  for (let i = 0; i <= slotCount; i++) {
    timeLabels.push(format(currentTime, "h:mm a"))
    currentTime = addMinutes(currentTime, 30)
  }

  const handleMouseDown = (dateKey: string, slotIndex: number) => {
    const currentValue = availability[dateKey][slotIndex]
    setSelectionValue(!currentValue)
    setIsSelecting(true)
    onAvailabilityChange(dateKey, slotIndex, !currentValue)
  }

  // Update the handleMouseOver function to allow continuous selection across days
  const handleMouseOver = (dateKey: string, slotIndex: number) => {
    if (isSelecting) {
      onAvailabilityChange(dateKey, slotIndex, selectionValue)
    }
  }

  const handleMouseUp = () => {
    setIsSelecting(false)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsSelecting(false)
    }

    window.addEventListener("mouseup", handleGlobalMouseUp)
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [])

  return (
    <div className="overflow-x-auto" ref={gridRef}>
      <div className="min-w-[600px]">
        {/* Day headers */}
        <div className="grid grid-cols-[100px_1fr] mb-2">
          <div className="text-sm font-medium text-slate-500">Time</div>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
            {days.map((day) => (
              <div key={format(day, "yyyy-MM-dd")} className="text-center text-sm font-medium">
                <div>{format(day, "EEE")}</div>
                <div>{format(day, "MMM d")}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-[100px_1fr]">
          {/* Time labels */}
          <div className="grid" style={{ gridTemplateRows: `repeat(${slotCount}, 30px)` }}>
            {Array.from({ length: slotCount }).map((_, index) => (
              <div key={`time-${index}`} className="text-xs text-slate-500 h-[30px] flex items-center justify-end pr-2">
                {format(addMinutes(startTime, index * 30), "h:mm a")}
              </div>
            ))}
          </div>

          {/* Availability cells */}
          {/* Update the grid container to allow for continuous selection */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${days.length}, 1fr)`,
              gridTemplateRows: `repeat(${slotCount}, 30px)`,
              userSelect: "none", // Prevent text selection during dragging
            }}
            onMouseLeave={() => setIsSelecting(false)}
          >
            {days.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd")

              return Array.from({ length: slotCount }).map((_, slotIndex) => {
                const isAvailable = availability[dateKey]?.[slotIndex] || false

                return (
                  <div
                    key={`${dateKey}-${slotIndex}`}
                    className={`border border-slate-200 cursor-pointer transition-colors ${
                      isAvailable ? "bg-primary/80 hover:bg-primary/90" : "bg-slate-50 hover:bg-slate-100"
                    }`}
                    onMouseDown={() => handleMouseDown(dateKey, slotIndex)}
                    onMouseOver={() => handleMouseOver(dateKey, slotIndex)}
                    onMouseUp={handleMouseUp}
                    style={{
                      borderRight: slotIndex === slotCount - 1 ? "1px solid #e2e8f0" : "none",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  />
                )
              })
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

