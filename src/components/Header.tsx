import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { Button } from '#/components/ui/button'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/#contact' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg-elevated">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Branding */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">🚗</span>
            <span className="font-bold text-lg text-text-primary hidden sm:inline">
              TourMe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 bg-bg-elevated rounded-lg px-6 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side: Sign In + Theme Toggle */}
          <div className="flex items-center gap-4">
            <Link to="/auth/tourist/login" className="hidden lg:block">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t border-border-subtle bg-bg-base">
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-text-secondary hover:text-text-primary transition-colors text-sm font-medium py-2"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/auth/tourist/login"
                onClick={() => setIsMenuOpen(false)}
                className="block pt-2 border-t border-border-subtle"
              >
                <Button className="w-full" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
