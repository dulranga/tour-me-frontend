import { Button } from '#/components/ui/button'
import { useNavigate } from '@tanstack/react-router'

export function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden bg-bg-elevated py-12 px-4 sm:py-16 sm:px-6 lg:py-20 lg:px-8">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute -left-20 -top-32 h-64 w-64 rounded-full bg-accent-teal/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-32 h-64 w-64 rounded-full bg-accent-blue/10 blur-3xl" />

      <div className="relative mx-auto max-w-2xl text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-4 sm:mb-6">
          Ready to get started?
        </h2>

        <p className="text-base sm:text-lg text-text-secondary mb-8 sm:mb-12">
          Join thousands of travelers and drivers already using TourMe to connect safely and transparently.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
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
            variant="outline"
            onClick={() => navigate({ to: '/auth/driver/register' })}
            className="w-full sm:w-auto"
          >
            Become a Driver
          </Button>
        </div>

        <p className="mt-8 sm:mt-10 text-sm text-text-muted">
          Already have an account?{' '}
          <a
            href="/auth/tourist/login"
            className="font-semibold text-accent-teal hover:text-accent-blue transition-colors"
          >
            Sign in here
          </a>
        </p>
      </div>
    </section>
  )
}
