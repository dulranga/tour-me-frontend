export type DashboardNavItem = {
  label: string
  description?: string
  to: string
}

export const touristNavItems: DashboardNavItem[] = [
  {
    label: 'Overview',
    to: '/dashboard/tourist',
    description: 'Summary and bid updates',
  },
  {
    label: 'Itineraries',
    to: '/dashboard/tourist/itineraries',
    description: 'Drafts and active plans',
  },
  {
    label: 'Bids',
    to: '/dashboard/tourist/bids',
    description: 'Compare driver offers',
  },
  {
    label: 'Trips',
    to: '/dashboard/tourist/trips',
    description: 'Upcoming and past trips',
  },
  {
    label: 'Messages',
    to: '/dashboard/tourist/messages',
    description: 'Driver conversations',
  },
  {
    label: 'Receipts',
    to: '/dashboard/tourist/receipts',
    description: 'Upload and track receipts',
  },
]

export const driverNavItems: DashboardNavItem[] = [
  {
    label: 'Overview',
    to: '/dashboard/driver',
    description: 'Availability and bid pipeline',
  },
  {
    label: 'Marketplace',
    to: '/dashboard/driver/marketplace',
    description: 'Open itineraries',
  },
  {
    label: 'Bids',
    to: '/dashboard/driver/bids',
    description: 'Submitted offers',
  },
  {
    label: 'Trips',
    to: '/dashboard/driver/trips',
    description: 'Accepted assignments',
  },
  {
    label: 'Messages',
    to: '/dashboard/driver/messages',
    description: 'Tourist conversations',
  },
  {
    label: 'Verification',
    to: '/dashboard/driver/verification',
    description: 'Document status',
  },
  {
    label: 'Vehicle',
    to: '/dashboard/driver/vehicle',
    description: 'Vehicle details',
  },
]

export const adminNavItems: DashboardNavItem[] = [
  {
    label: 'Overview',
    to: '/dashboard/admin',
    description: 'System health and queues',
  },
  {
    label: 'Drivers',
    to: '/dashboard/admin/drivers',
    description: 'Verification and status',
  },
  {
    label: 'Tourists',
    to: '/dashboard/admin/tourists',
    description: 'Accounts and reports',
  },
  {
    label: 'Trips',
    to: '/dashboard/admin/trips',
    description: 'Live trip oversight',
  },
  {
    label: 'Bids',
    to: '/dashboard/admin/bids',
    description: 'Marketplace activity',
  },
  {
    label: 'Disputes',
    to: '/dashboard/admin/disputes',
    description: 'Resolution queue',
  },
  {
    label: 'Feedback',
    to: '/dashboard/admin/feedback',
    description: 'Moderation tasks',
  },
]
