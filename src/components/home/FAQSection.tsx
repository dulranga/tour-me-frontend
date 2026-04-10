'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function FAQSection() {
  const [openItem, setOpenItem] = useState(0)
  const [activeTab, setActiveTab] = useState<'tourist' | 'driver'>('tourist')

  const faqs = {
    tourist: [
      {
        question: 'How do I create an itinerary?',
        answer:
          'Simply sign up, navigate to "Create Itinerary", add your destinations, dates, and preferences. Once submitted, drivers will start bidding on your trip.',
      },
      {
        question: 'How are drivers verified?',
        answer:
          'All drivers undergo a thorough verification process including document checks, background screening, and ratings from previous tourists.',
      },
      {
        question: 'Is my payment secure?',
        answer:
          'Yes, all payments are processed through secure payment gateways with encryption. You only pay the driver once the trip is complete.',
      },
      {
        question: 'Can I cancel my trip?',
        answer:
          'You can cancel before a driver is selected. Once a driver accepts your trip, cancellation policies apply based on the time of cancellation.',
      },
      {
        question: 'What if there\'s an issue during the trip?',
        answer:
          'Our 24/7 support team is available via chat, phone, or email. We resolve disputes fairly and have a resolution process in place.',
      },
    ],
    driver: [
      {
        question: 'How do I become a verified driver?',
        answer:
          'Sign up, submit your documents (license, vehicle registration, insurance), and pass our background check. Verification typically takes 2-3 business days.',
      },
      {
        question: 'How do I set my rates?',
        answer:
          'You have full control over your rates. Set your prices based on distance, time, and your vehicle type. You can adjust rates anytime.',
      },
      {
        question: 'Do I have to accept every trip?',
        answer:
          'No, you\'re in full control. You can view all available trips and choose which ones match your schedule and preferences.',
      },
      {
        question: 'How are payments made to me?',
        answer:
          'Payments are deposited directly to your bank account within 24-48 hours after trip completion. You can track all payments in your dashboard.',
      },
      {
        question: 'What if a tourist gives me a bad rating?',
        answer:
          'Ratings are important for your profile. If you believe a rating is unfair, you can dispute it. We review all disputes and take appropriate action.',
      },
    ],
  }

  const tabContent = activeTab === 'tourist' ? faqs.tourist : faqs.driver
  const displayedFaq = tabContent[openItem]

  return (
    <section className="bg-bg-base py-12 px-4 sm:py-16 sm:px-6 lg:py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-3 sm:mb-4">
            Frequently asked questions
          </h2>
          <p className="text-base sm:text-lg text-text-secondary">
            Find answers to common questions about TourMe.
          </p>
        </div>

        {/* Tab switcher - Desktop only */}
        <div className="hidden sm:flex gap-4 mb-8 border-b border-border-subtle">
          <button
            onClick={() => {
              setActiveTab('tourist')
              setOpenItem(0)
            }}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'tourist'
                ? 'border-accent-teal text-accent-teal'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            For Tourists
          </button>
          <button
            onClick={() => {
              setActiveTab('driver')
              setOpenItem(0)
            }}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'driver'
                ? 'border-accent-teal text-accent-teal'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            For Drivers
          </button>
        </div>

        {/* Mobile: Tab selector dropdown */}
        <div className="sm:hidden mb-6">
          <select
            value={activeTab}
            onChange={(e) => {
              setActiveTab(e.target.value as 'tourist' | 'driver')
              setOpenItem(0)
            }}
            className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border-default text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal"
          >
            <option value="tourist">Questions for Tourists</option>
            <option value="driver">Questions for Drivers</option>
          </select>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {tabContent.map((faq, index) => (
            <div
              key={index}
              className="border border-border-subtle rounded-lg overflow-hidden hover:border-border-default transition-colors"
            >
              <button
                onClick={() => setOpenItem(openItem === index ? -1 : index)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 bg-bg-elevated hover:bg-bg-hover transition-colors"
              >
                <h3 className="font-semibold text-text-primary text-left text-sm sm:text-base">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`h-5 w-5 text-text-secondary flex-shrink-0 ml-4 transition-transform ${
                    openItem === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openItem === index && (
                <div className="px-4 sm:px-6 py-4 border-t border-border-subtle bg-bg-base text-sm sm:text-base text-text-secondary">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-lg bg-bg-elevated border border-border-subtle text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">
            Still have questions?
          </h3>
          <p className="text-sm sm:text-base text-text-secondary mb-4">
            Our support team is available 24/7 to help.
          </p>
          <a
            href="mailto:support@tourme.com"
            className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-accent-teal hover:bg-accent-blue text-white font-semibold text-sm transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  )
}
