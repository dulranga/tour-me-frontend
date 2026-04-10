import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

export function FeaturesSection() {
  const features = [
    {
      title: 'Real-time Bidding',
      description: 'Drivers submit bids instantly. Tourists see competitive offers in real-time.',
      icon: '⚡',
    },
    {
      title: 'Verified Drivers',
      description: 'Every driver is verified with documents and background checks for your safety.',
      icon: '✓',
    },
    {
      title: 'Secure Payments',
      description: 'All payments are encrypted and secured. Pay only after confirming the trip.',
      icon: '🔒',
    },
    {
      title: 'Live Tracking',
      description: 'Track your driver in real-time. Know exactly where you are and when you\'ll arrive.',
      icon: '📍',
    },
    {
      title: 'Ratings & Reviews',
      description: 'Both tourists and drivers rate each other, building a trustworthy community.',
      icon: '⭐',
    },
    {
      title: '24/7 Support',
      description: 'Our support team is always available to help resolve any issues or questions.',
      icon: '🎧',
    },
  ]

  return (
    <section className="bg-bg-base py-12 px-4 sm:py-16 sm:px-6 lg:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-3 sm:mb-4">
            Features built for trust
          </h2>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
            Everything you need for a safe, transparent, and enjoyable experience.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="bg-bg-elevated border-border-subtle hover:border-border-default hover:bg-bg-hover transition-all duration-200"
            >
              <CardHeader>
                <div className="mb-3 text-4xl">{feature.icon}</div>
                <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-text-secondary">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
