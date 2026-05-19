import { ClipboardList, Gavel, UserCheck, Star, ArrowRight } from 'lucide-react'

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Create Itinerary',
      description:
        'Create your multi-destination plan with dates and preferences in seconds.',
      icon: <ClipboardList className="h-6 w-6" />,
    },
    {
      number: 2,
      title: 'Drivers Bid',
      description:
        'Verified drivers review your plan and submit competitive price offers.',
      icon: <Gavel className="h-6 w-6" />,
    },
    {
      number: 3,
      title: 'Select Driver',
      description:
        'Compare bids, read reviews, and choose the best driver for your trip.',
      icon: <UserCheck className="h-6 w-6" />,
    },
    {
      number: 4,
      title: 'Complete & Rate',
      description:
        'Enjoy your journey and rate your experience to help the community grow.',
      icon: <Star className="h-6 w-6" />,
    },
  ]

  return (
    <section className="bg-bg-base py-16 px-4 sm:py-20 sm:px-6 lg:py-28 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 sm:mb-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mb-4">
            How it works
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            A simple four-step process to get you on the road with the best
            local drivers.
          </p>
        </div>

        <div className="relative">
          <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative group text-center">
                {/* Large Blended Connector Arrow (Desktop) */}
                {idx !== steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-8 left-1/2 w-full items-center justify-center -z-10">
                    <ArrowRight className="h-12 w-12 text-border-subtle opacity-30 stroke-[1px]" />
                  </div>
                )}

                {/* Vertical Connector Line (Mobile) */}
                {idx !== steps.length - 1 && (
                  <div className="lg:hidden absolute left-1/2 -bottom-8 w-[2px] h-8 bg-border-subtle" />
                )}

                {/* Step Indicator and Icon */}
                <div className="relative mb-6 flex justify-center">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-elevated border-2 border-border-subtle text-primary group-hover:border-primary/50 transition-all duration-300">
                    {step.icon}
                    <div className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-white ring-4 ring-bg-base">
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 px-4">
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-base text-text-secondary leading-relaxed max-w-[280px] mx-auto">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
