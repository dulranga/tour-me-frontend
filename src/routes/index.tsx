import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '#/components/home/HeroSection'
import { ValuePropSection } from '#/components/home/ValuePropSection'
import { HowItWorksSection } from '#/components/home/HowItWorksSection'
import { FeaturesSection } from '#/components/home/FeaturesSection'
import { TrustSection } from '#/components/home/TrustSection'
import { FAQSection } from '#/components/home/FAQSection'
import { CTASection } from '#/components/home/CTASection'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <main className="bg-bg-base">
      <HeroSection />
      <ValuePropSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TrustSection />
      <FAQSection />
      <CTASection />
    </main>
  )
}
