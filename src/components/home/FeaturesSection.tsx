import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Zap,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Star,
  Headphones,
} from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      title: 'Real-time Bidding',
      description:
        'Drivers submit bids instantly. Tourists see competitive offers in real-time.',
      icon: <Zap className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Verified Drivers',
      description:
        'Every driver is verified with documents and background checks for your safety.',
      icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Secure Payments',
      description:
        'All payments are encrypted and secured. Pay only after confirming the trip.',
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Live Tracking',
      description:
        "Track your driver in real-time. Know exactly where you are and when you'll arrive.",
      icon: <MapPin className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Ratings & Reviews',
      description:
        'Both tourists and drivers rate each other, building a trustworthy community.',
      icon: <Star className="h-6 w-6 text-primary" />,
    },
    {
      title: '24/7 Support',
      description:
        'Our support team is always available to help resolve any issues or questions.',
      icon: <Headphones className="h-6 w-6 text-primary" />,
    },
  ]

  return (
    <section className="bg-bg-base py-12 px-4 sm:py-16 sm:px-6 lg:py-24 lg:px-8" id="features">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mb-4">
            Features built for trust
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Everything you need for a safe, transparent, and enjoyable
            experience.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="bg-bg-elevated border-border-subtle shadow-none group hover:border-primary/30 hover:bg-bg-hover transition-all duration-200"
            >
              <CardHeader className="pb-3">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-bg-elevated text-primary ring-1 ring-border-subtle group-hover:ring-primary/20 transition-all duration-200">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-text-secondary leading-relaxed">
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
