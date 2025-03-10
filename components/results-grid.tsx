"use client"

import { format, eachDayOfInterval, parse, addMinutes } from "date-fns"

interface Participant {
  name: string
  availability: Record<string, boolean[]>
}

interface ResultsGridProps {
  dateRange: { from: Date; to: Date }
  timeRange: { start: string; end: string }
  participants: Participant[]
}

export function ResultsGrid({ dateRange, timeRange, participants }: ResultsGridProps) {
  const days = eachDayOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  })

  const startTime = parse(timeRange.start, "HH:mm", new Date())
  const endTime = parse(timeRange.end, "HH:mm", new Date())

  // Calculate number of 30-minute slots
  const slotCount =
    (endTime.getHours() * 60 + endTime.getMinutes() - (startTime.getHours() * 60 + startTime.getMinutes())) / 30

  // Calculate availability heatmap
  const calculateHeatmap = () => {
    const heatmap: Record<string, number[]> = {}

    days.forEach((day) => {
      const dateKey = format(day, "yyyy-MM-dd")
      heatmap[dateKey] = Array(slotCount).fill(0)

      participants.forEach((participant) => {
        if (participant.availability[dateKey]) {
          participant.availability[dateKey].forEach((isAvailable, slotIndex) => {
            if (isAvailable) {
              heatmap[dateKey][slotIndex]++
            }
          })
        }
      })
    })

    return heatmap
  }

  const heatmap = calculateHeatmap()
  const maxAvailability = participants.length

  // Find best time slots (most participants available)
  const findBestTimeSlots = () => {
    let bestScore = 0
    let bestSlots: { dateKey: string; slotIndex: number; score: number }[] = []

    Object.entries(heatmap).forEach(([dateKey, scores]) => {
      scores.forEach((score, slotIndex) => {
        if (score > bestScore) {
          bestScore = score
          bestSlots = [{ dateKey, slotIndex, score }]
        } else if (score === bestScore && bestScore > 0) {
          bestSlots.push({ dateKey, slotIndex, score })
        }
      })
    })

    return bestSlots
  }

  const bestTimeSlots = findBestTimeSlots()

  return (
    <div className="space-y-6">
      {bestTimeSlots.length > 0 && <></>}

      <div className="overflow-x-auto">
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
                <div
                  key={`time-${index}`}
                  className="text-xs text-slate-500 h-[30px] flex items-center justify-end pr-2"
                >
                  {format(addMinutes(startTime, index * 30), "h:mm a")}
                </div>
              ))}
            </div>

            {/* Heatmap cells */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${days.length}, 1fr)`,
                gridTemplateRows: `repeat(${slotCount}, 30px)`,
              }}
            >
              {days.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd")

                return Array.from({ length: slotCount }).map((_, slotIndex) => {
                  const availableCount = heatmap[dateKey]?.[slotIndex] || 0
                  const opacity = maxAvailability > 0 ? availableCount / maxAvailability : 0
                  const isBestTime = bestTimeSlots.some(
                    (slot) => slot.dateKey === dateKey && slot.slotIndex === slotIndex,
                  )

                  return (
                    <div
                      key={`${dateKey}-${slotIndex}`}
                      className={`border border-slate-200 relative ${isBestTime ? "ring-2 ring-green-500 z-10" : ""}`}
                      style={{
                        backgroundColor: `rgba(var(--primary-rgb), ${opacity})`,
                      }}
                    >
                      {availableCount > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          {availableCount}
                        </div>
                      )}
                    </div>
                  )
                })
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-2">Participants ({participants.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {participants.map((participant, index) => (
            <div key={index} className="bg-slate-50 px-3 py-2 rounded-md text-sm">
              {participant.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

