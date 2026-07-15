import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Shield, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom";

export default function Hero() {
    const navigate = useNavigate()
  return (
    <section className="min-h-[90vh] flex items-center">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Side */}
          <div>
            <div className="inline-flex items-center rounded-full border bg-muted px-4 py-1 text-sm">
              <Zap className="mr-2 h-4 w-4 text-yellow-500" />
              Real-time Messaging Platform
            </div>

            <h1 className="mt-6 text-5xl font-bold tracking-tight lg:text-7xl">
              Chat Smarter.
              <span className="block text-primary">Connect Faster.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Experience seamless conversations with real-time messaging,
              instant notifications, secure authentication, file sharing, and
              one-click PDF exports.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" onClick={()=>navigate('/signup')}>
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button size="lg" variant="outline" onClick={()=>navigate('/about')}>
                Learn More
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Secure Authentication
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                Live Messaging
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-3xl border bg-card p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-semibold">General Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    3 members online
                  </p>
                </div>

                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>

              <div className="space-y-4">
                <div className="max-w-[75%] rounded-2xl bg-muted p-3">
                  <p className="text-sm">
                    Hey! Did you finish the project?
                  </p>
                </div>

                <div className="ml-auto max-w-[75%] rounded-2xl bg-primary p-3 text-primary-foreground">
                  <p className="text-sm">
                    Yep! Real-time chat, notifications, and PDF export are all
                    working 🚀
                  </p>
                </div>

                <div className="max-w-[75%] rounded-2xl bg-muted p-3">
                  <p className="text-sm">
                    Nice! Let's deploy it next.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 border-t pt-4">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm outline-none"
                  disabled
                />

                <Button size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}