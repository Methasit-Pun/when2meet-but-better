import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      <header className="container mx-auto py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">MeetTime</h1>
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link href="/about" className="text-slate-600 hover:text-slate-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-slate-600 hover:text-slate-900">
                  Help
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Find the perfect time to meet</h2>
            <p className="text-lg text-slate-600 mb-6">
              MeetTime makes it easy to find meeting times that work for everyone. Create an event, share the link, and
              watch as the best meeting times emerge.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link href="/create">Create Event</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/join">Join Event</Link>
              </Button>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>How it works</CardTitle>
              <CardDescription>Simple steps to find the perfect meeting time</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Create an event</h3>
                    <p className="text-sm text-slate-600">Set your event name, dates, and time range</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Share with participants</h3>
                    <p className="text-sm text-slate-600">Send the unique event link to all participants</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Mark availability</h3>
                    <p className="text-sm text-slate-600">Everyone marks when they're available</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Find the best time</h3>
                    <p className="text-sm text-slate-600">See when everyone is available at a glance</p>
                  </div>
                </li>
              </ol>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/create">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="container mx-auto py-6 text-center text-slate-600">
        <p>© {new Date().getFullYear()} MeetTime. All rights reserved.</p>
      </footer>
    </div>
  )
}

