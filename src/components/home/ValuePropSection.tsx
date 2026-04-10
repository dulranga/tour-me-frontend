import { CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

export function ValuePropSection() {
  return (
    <section className="bg-bg-base py-12 px-4 sm:py-16 sm:px-6 lg:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-3 sm:mb-4">
            Why choose TourMe?
          </h2>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
            Designed for both travelers and drivers to create meaningful connections.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          {/* For Tourists */}
          <Card className="bg-bg-elevated border-border-subtle hover:border-border-default transition-colors">
            <CardHeader>
              <div className="mb-3 text-4xl">✈️</div>
              <CardTitle className="text-xl sm:text-2xl">For Tourists</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base text-text-secondary leading-relaxed">
                Create your perfect itinerary and let drivers compete for your business with transparent, competitive bids.
              </p>

              <ul className="space-y-3">
                {[
                  'Plan multi-destination trips with ease',
                  'Compare competitive bids from verified drivers',
                  'Travel with rated, trusted professionals',
                ].map((benefit, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <CheckCircle className="h-5 w-5 text-status-success mt-0.5 flex-shrink-0" />
                    <span className="text-base text-text-primary">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* For Drivers */}
          <Card className="bg-bg-elevated border-border-subtle hover:border-border-default transition-colors">
            <CardHeader>
              <div className="mb-3 text-4xl">🚗</div>
              <CardTitle className="text-xl sm:text-2xl">For Drivers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base text-text-secondary leading-relaxed">
                Accept trips that match your schedule and rates. Build your reputation through verified reviews.
              </p>

              <ul className="space-y-3">
                {[
                  'Control which trips you accept',
                  'Set competitive rates with full transparency',
                  'Build reputation through verified ratings',
                ].map((benefit, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <CheckCircle className="h-5 w-5 text-status-success mt-0.5 flex-shrink-0" />
                    <span className="text-base text-text-primary">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
