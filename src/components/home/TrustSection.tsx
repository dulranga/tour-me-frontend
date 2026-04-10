import { Card, CardContent } from '#/components/ui/card'

export function TrustSection() {
  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '2.5K+', label: 'Successful Trips' },
    { number: '4.8★', label: 'Average Rating' },
  ]

  const testimonials = [
    {
      quote:
        'TourMe made planning my trip so easy. I got 5 bids within hours and found an amazing driver!',
      author: 'Sarah Johnson',
      role: 'Tourist',
      avatar: '👩',
    },
    {
      quote:
        'Great platform to earn extra income. I love the flexibility of choosing which trips to accept.',
      author: 'Michael Chen',
      role: 'Driver',
      avatar: '👨',
    },
    {
      quote:
        'The verification process gave me peace of mind. I felt safe throughout my entire trip.',
      author: 'Emma Wilson',
      role: 'Tourist',
      avatar: '👩‍🦰',
    },
  ]

  return (
    <section className="bg-bg-elevated py-12 px-4 sm:py-16 sm:px-6 lg:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Stats */}
        <div className="mb-12 sm:mb-16">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-accent-teal mb-2">
                  {stat.number}
                </div>
                <p className="text-base text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section divider */}
        <div className="my-12 sm:my-16 border-t border-border-subtle" />

        {/* Testimonials */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8 sm:mb-12 text-center">
            What users say
          </h3>

          {/* Mobile: Single testimonial */}
          <div className="lg:hidden">
            <Card className="bg-bg-base border-border-subtle">
              <CardContent className="pt-6">
                <p className="text-base text-text-secondary mb-6 italic">
                  "{testimonials[0].quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{testimonials[0].avatar}</div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">
                      {testimonials[0].author}
                    </p>
                    <p className="text-xs text-text-muted">{testimonials[0].role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop: Three testimonials */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.author}
                className="bg-bg-base border-border-subtle hover:border-border-default transition-colors"
              >
                <CardContent className="pt-6">
                  <p className="text-sm text-text-secondary mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">
                        {testimonial.author}
                      </p>
                      <p className="text-xs text-text-muted">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
