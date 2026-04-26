import { Button } from '#/components/ui/button'
import { useNavigate } from '@tanstack/react-router'

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden bg-bg-base py-12 px-4 sm:py-16 sm:px-6 lg:py-24 lg:px-8">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute -left-20 -top-32 h-64 w-64 rounded-full bg-accent-teal/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-32 h-64 w-64 rounded-full bg-accent-blue/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
          {/* Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4 sm:mb-6 leading-tight">
              Connect with trusted drivers.{' '}
              <span className="text-accent-teal">Explore your journey.</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary mb-6 sm:mb-8 max-w-2xl leading-relaxed">
              TourMe connects tourists seeking reliable drivers with drivers
              looking for meaningful trips. Create your itinerary, get
              competitive bids, and travel with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                variant="default"
                onClick={() => navigate({ to: '/auth/tourist/register' })}
                className="w-full sm:w-auto"
              >
                Join as Tourist
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate({ to: '/auth/driver/register' })}
                className="w-full sm:w-auto"
              >
                Become a Driver
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 sm:mt-12 flex flex-wrap gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-status-success" />
                Verified drivers
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-status-success" />
                Secure payments
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-status-success" />
                24/7 support
              </div>
            </div>
          </div>

          {/* Illustration placeholder */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full h-80 bg-bg-elevated rounded-lg border border-border-subtle flex items-center justify-center">
              <img
                src="https://avatar.vercel.sh/asas"
                alt=""
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
