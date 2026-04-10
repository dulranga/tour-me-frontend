import { ArrowRight } from 'lucide-react'

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Create Itinerary',
      description: 'Tourist creates a multi-destination itinerary with specific dates and preferences.',
      icon: '📋',
    },
    {
      number: 2,
      title: 'Drivers Bid',
      description: 'Verified drivers review the itinerary and submit their competitive bids.',
      icon: '💰',
    },
    {
      number: 3,
      title: 'Select Driver',
      description: 'Tourist compares bids, reviews, and selects the best driver for their needs.',
      icon: '✅',
    },
    {
      number: 4,
      title: 'Complete & Rate',
      description: 'Enjoy the trip and rate your driver to build a trustworthy community.',
      icon: '⭐',
    },
  ]

  return (
    <section className="bg-bg-elevated py-12 px-4 sm:py-16 sm:px-6 lg:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-3 sm:mb-4">
            How it works
          </h2>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
            Simple, transparent, and designed to connect the right people.
          </p>
        </div>

        {/* Mobile/Tablet: Vertical timeline */}
        <div className="lg:hidden space-y-6 sm:space-y-8">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative pl-12 sm:pl-16">
              {/* Timeline line */}
              {idx !== steps.length - 1 && (
                <div className="absolute left-4 sm:left-6 top-12 sm:top-14 h-8 w-1 bg-border-subtle" />
              )}

              {/* Step circle */}
              <div className="absolute left-0 top-0 h-9 sm:h-12 w-9 sm:w-12 rounded-full bg-accent-teal flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                {step.number}
              </div>

              {/* Content */}
              <div>
                <div className="text-2xl sm:text-3xl mb-2">{step.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-text-secondary">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Horizontal grid with connectors */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative">
              {/* Connector arrow */}
              {idx !== steps.length - 1 && (
                <div className="absolute -right-3 top-12 h-1 w-6 bg-border-subtle flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-border-default absolute -right-6" />
                </div>
              )}

              {/* Step content */}
              <div className="text-center">
                {/* Step circle */}
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent-teal text-white font-bold text-xl">
                  {step.number}
                </div>

                {/* Icon and text */}
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
