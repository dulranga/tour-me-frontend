import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Menu, X, LogOut } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { Button } from '#/components/ui/button'
import { useAuth } from '#/lib/AuthContext'
import { logout } from '#/lib/auth'
import { toast } from 'sonner'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  const handleLogout = async () => {
    try {
      await logout()
      await queryClient.invalidateQueries()
      closeMenu()
      toast.success('Logged out successfully')
      await navigate({ to: '/' })
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

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
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🚗</span>
            <span className="font-bold text-lg text-text-primary hidden sm:inline">
              TourMe
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!user && (
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
          )}

          {/* Right Side: Sign In / User Menu + Theme Toggle */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="hidden lg:block h-9 w-20 bg-bg-hover rounded animate-pulse" />
            ) : user ? (
              <>
                <div className="hidden lg:flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-text-primary">
                      {user.name}
                    </div>
                    <div className="text-xs text-text-muted capitalize">
                      {user.role.toLowerCase()}
                    </div>
                  </div>
                  <Link
                    to={`/dashboard/${user.role.toLowerCase()}`}
                    className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-text-secondary hover:text-text-primary transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <Link to="/auth/login" className="hidden lg:block">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}

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

        {/* Mobile Navigation Drawer */}
        {isMenuOpen ? (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
              <div
                className="absolute inset-0 bg-bg-overlay"
                onClick={closeMenu}
              />
              <div className="absolute right-0 top-0 flex h-full w-72 flex-col border-l border-border-subtle bg-bg-elevated shadow-lg">
                <div className="flex items-center justify-between border-b border-border-subtle px-4 py-4">
                  <span className="text-sm font-semibold text-text-primary">
                    Menu
                  </span>
                  <button
                    onClick={closeMenu}
                    className="rounded-md p-2 text-text-secondary transition-colors hover:text-text-primary"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>
                <nav className="flex-1 space-y-1 px-4 py-4">
                  {!user &&
                    navItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={closeMenu}
                        className="block rounded-md border border-transparent px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-subtle hover:bg-bg-hover hover:text-text-primary"
                      >
                        {item.label}
                      </Link>
                    ))}
                  {user ? (
                    <>
                      <div className="border-b border-border-subtle px-3 py-3">
                        <div className="text-sm font-medium text-text-primary">
                          {user.name}
                        </div>
                        <div className="text-xs text-text-muted capitalize">
                          {user.role.toLowerCase()}
                        </div>
                      </div>
                      <Link
                        to={`/dashboard/${user.role.toLowerCase()}`}
                        onClick={closeMenu}
                        className="block rounded-md border border-transparent px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-subtle hover:bg-bg-hover hover:text-text-primary"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full rounded-md border border-transparent px-3 py-2 text-left text-sm font-medium text-text-secondary transition-colors hover:border-border-subtle hover:bg-bg-hover hover:text-text-primary"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth/login"
                      onClick={closeMenu}
                      className="block pt-4"
                    >
                      <Button className="w-full" size="sm">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </nav>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
