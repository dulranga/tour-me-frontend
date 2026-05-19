import { Link } from '@tanstack/react-router'
import { Car, Github, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  const footerLinks = {
    resources: [
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'Features', href: '/#features' },
      { label: 'FAQ', href: '/#faq' },
    ],
    legal: [
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookies', href: '/cookies' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Community', href: '/community' },
    ],
  }

  const socialLinks = [
    {
      label: 'X',
      href: 'https://x.com/tourme',
      icon: <Twitter className="h-5 w-5" />,
    },
    {
      label: 'GitHub',
      href: 'https://github.com/tourme',
      icon: <Github className="h-5 w-5" />,
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/company/tourme',
      icon: <Linkedin className="h-5 w-5" />,
    },
  ]

  return (
    <footer className="border-t border-border-subtle bg-bg-base">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              TourMe
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Connect travelers with verified drivers for unforgettable
              experiences. Safe, flexible, and community-driven.
            </p>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border-subtle pt-8 mb-8" />

        {/* Bottom Row: Copyright + Social */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <p className="text-xs text-text-muted">
            &copy; {year} TourMe. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-text-secondary hover:text-accent-teal transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
