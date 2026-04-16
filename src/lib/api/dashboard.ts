export type DashboardStatusVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'warning'
  | 'destructive'

export type DashboardListItem = {
  title: string
  subtitle?: string
  meta?: string
  status?: string
  statusVariant?: DashboardStatusVariant
}

export type DashboardListData = {
  title: string
  description?: string
  items: DashboardListItem[]
  emptyState?: string
}

export type DashboardStatIcon =
  | 'map-pin'
  | 'handshake'
  | 'calendar'
  | 'receipt'
  | 'clipboard'
  | 'users'
  | 'gauge'
  | 'check-circle'
  | 'shield-check'
  | 'alert-triangle'
  | 'check-square'
  | 'flag'

export type DashboardStat = {
  title: string
  value: string
  description: string
  icon: DashboardStatIcon
  trend?: string
}

export function getTouristOverviewData(): {
  stats: DashboardStat[]
  recentItineraries: DashboardListData
  bidUpdates: DashboardListData
  upcomingTrips: DashboardListData
  messages: DashboardListData
  receipts: DashboardListData
} {
  return {
    stats: [
      {
        title: 'Active itineraries',
        value: '3',
        description: '2 awaiting new bids',
        icon: 'map-pin',
      },
      {
        title: 'Open bids',
        value: '5',
        description: 'Latest offer 4h ago',
        icon: 'handshake',
      },
      {
        title: 'Upcoming trips',
        value: '2',
        description: 'Next trip starts in 3 days',
        icon: 'calendar',
      },
      {
        title: 'Receipts pending',
        value: '1',
        description: 'Upload remaining receipt',
        icon: 'receipt',
      },
    ] satisfies DashboardStat[],
    recentItineraries: {
      title: 'Recent itineraries',
      description: 'Trips waiting on bids or confirmations.',
      items: [
        {
          title: 'Kandy to Ella weekend',
          subtitle: '3 days, 2 stops',
          meta: 'Last updated 2 days ago',
          status: 'Open for bids',
          statusVariant: 'secondary',
        },
        {
          title: 'Sigiriya sunrise tour',
          subtitle: '1 day, solo trip',
          meta: '2 bids received',
          status: 'Review bids',
          statusVariant: 'warning',
        },
        {
          title: 'Galle coastal loop',
          subtitle: '2 days, 3 travelers',
          meta: 'Driver selected',
          status: 'Confirmed',
          statusVariant: 'success',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    bidUpdates: {
      title: 'Bid updates',
      description: 'Latest activity from drivers.',
      items: [
        {
          title: 'Driver Amal sent a new bid',
          subtitle: 'LKR 42,000 for 3 days',
          meta: 'Expires in 18h',
          status: 'New',
          statusVariant: 'success',
        },
        {
          title: 'Driver Nila updated pricing',
          subtitle: 'LKR 38,500 for 2 days',
          meta: 'Seen 1h ago',
          status: 'Updated',
          statusVariant: 'secondary',
        },
        {
          title: 'Bid response needed',
          subtitle: 'Confirm driver on Galle trip',
          meta: 'Due today',
          status: 'Action',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    upcomingTrips: {
      title: 'Upcoming trips',
      description: 'Trips confirmed with drivers.',
      items: [
        {
          title: 'Galle coastal loop',
          subtitle: 'Driver selected',
          meta: 'Starts May 12',
          status: 'Confirmed',
          statusVariant: 'success',
        },
        {
          title: 'Temple circuit',
          subtitle: 'Awaiting driver confirmation',
          meta: 'Starts May 26',
          status: 'Pending',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    messages: {
      title: 'Messages',
      description: 'Recent driver conversations.',
      items: [
        {
          title: 'Amal R.',
          subtitle: 'Can adjust pickup time?',
          meta: 'Last message 3h ago',
          status: '2 unread',
          statusVariant: 'secondary',
        },
        {
          title: 'Nila P.',
          subtitle: 'Shared revised itinerary',
          meta: 'Last message 1 day ago',
          status: 'Read',
          statusVariant: 'outline',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    receipts: {
      title: 'Receipts',
      description: 'Upload receipts after each trip.',
      items: [
        {
          title: 'Kandy to Ella weekend',
          subtitle: 'Fuel receipt missing',
          meta: 'Due in 5 days',
          status: 'Action needed',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getTouristItinerariesData() {
  return {
    drafts: {
      title: 'Drafts',
      description: 'Trips that are still being planned.',
      items: [
        {
          title: 'Colombo city walk',
          subtitle: '1 day, 2 travelers',
          meta: 'Saved 2 days ago',
          status: 'Draft',
          statusVariant: 'outline',
        },
        {
          title: 'Rainforest day trip',
          subtitle: '1 day, 4 travelers',
          meta: 'Saved 6 days ago',
          status: 'Draft',
          statusVariant: 'outline',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    openForBids: {
      title: 'Open for bids',
      description: 'Itineraries waiting on driver offers.',
      items: [
        {
          title: 'Kandy to Ella weekend',
          subtitle: '3 days, 2 stops',
          meta: '2 bids received',
          status: 'Open',
          statusVariant: 'secondary',
        },
        {
          title: 'Sigiriya sunrise tour',
          subtitle: '1 day, solo trip',
          meta: 'Bid deadline 18h',
          status: 'Review bids',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    confirmed: {
      title: 'Confirmed',
      description: 'Trips matched with drivers.',
      items: [
        {
          title: 'Galle coastal loop',
          subtitle: '2 days, 3 travelers',
          meta: 'Driver confirmed',
          status: 'Confirmed',
          statusVariant: 'success',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getTouristBidsData() {
  return {
    newBids: {
      title: 'New bids',
      description: 'Latest driver offers.',
      items: [
        {
          title: 'Driver Amal',
          subtitle: 'LKR 42,000 for 3 days',
          meta: 'Kandy to Ella weekend',
          status: 'New',
          statusVariant: 'success',
        },
        {
          title: 'Driver Sura',
          subtitle: 'LKR 38,000 for 2 days',
          meta: 'Galle coastal loop',
          status: 'New',
          statusVariant: 'success',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    expiringSoon: {
      title: 'Expiring soon',
      description: 'Offers that need a response.',
      items: [
        {
          title: 'Driver Nila',
          subtitle: 'LKR 12,500 for 1 day',
          meta: 'Sigiriya sunrise tour',
          status: '12h left',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    accepted: {
      title: 'Accepted bids',
      description: 'Drivers selected for your trips.',
      items: [
        {
          title: 'Driver Ravi',
          subtitle: 'LKR 45,000 for 3 days',
          meta: 'Galle coastal loop',
          status: 'Accepted',
          statusVariant: 'success',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getTouristTripsData() {
  return {
    upcoming: {
      title: 'Upcoming trips',
      description: 'Trips that are scheduled.',
      items: [
        {
          title: 'Galle coastal loop',
          subtitle: 'Driver Ravi',
          meta: 'Starts May 12',
          status: 'Confirmed',
          statusVariant: 'success',
        },
        {
          title: 'Temple circuit',
          subtitle: 'Driver pending',
          meta: 'Starts May 26',
          status: 'Pending',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    past: {
      title: 'Past trips',
      description: 'Completed trips with feedback status.',
      items: [
        {
          title: 'Mirissa day trip',
          subtitle: 'Driver Hana',
          meta: 'Completed April 2',
          status: 'Rated',
          statusVariant: 'secondary',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getTouristMessagesData() {
  return {
    threads: {
      title: 'Recent conversations',
      description: 'Messages with drivers.',
      items: [
        {
          title: 'Amal R.',
          subtitle: 'Can adjust pickup time?',
          meta: 'Last message 3h ago',
          status: '2 unread',
          statusVariant: 'secondary',
        },
        {
          title: 'Nila P.',
          subtitle: 'Shared revised itinerary',
          meta: 'Last message 1 day ago',
          status: 'Read',
          statusVariant: 'outline',
        },
        {
          title: 'Sura K.',
          subtitle: 'Confirmed pickup address',
          meta: 'Last message 3 days ago',
          status: 'Read',
          statusVariant: 'outline',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getTouristReceiptsData() {
  return {
    pending: {
      title: 'Pending receipts',
      description: 'Receipts waiting on upload.',
      items: [
        {
          title: 'Kandy to Ella weekend',
          subtitle: 'Fuel receipt missing',
          meta: 'Due in 5 days',
          status: 'Action needed',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    submitted: {
      title: 'Submitted receipts',
      description: 'Receipts already uploaded.',
      items: [
        {
          title: 'Mirissa day trip',
          subtitle: 'Receipt approved',
          meta: 'Submitted April 3',
          status: 'Complete',
          statusVariant: 'success',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getDriverOverviewData(): {
  stats: DashboardStat[]
  bidPipeline: DashboardListData
  upcomingTrips: DashboardListData
  messages: DashboardListData
  marketplaceHighlights: DashboardListData
  verificationStatus: DashboardListData
} {
  return {
    stats: [
      {
        title: 'Open itineraries',
        value: '12',
        description: '4 match your routes',
        icon: 'clipboard',
      },
      {
        title: 'Active bids',
        value: '6',
        description: '2 pending responses',
        icon: 'users',
      },
      {
        title: 'Trips this month',
        value: '3',
        description: '1 scheduled for next week',
        icon: 'gauge',
      },
      {
        title: 'Rating',
        value: '4.8',
        description: 'Based on 22 reviews',
        icon: 'check-circle',
      },
    ] satisfies DashboardStat[],
    bidPipeline: {
      title: 'Bid pipeline',
      description: 'Offers waiting for tourist confirmation.',
      items: [
        {
          title: 'Ella highlands circuit',
          subtitle: 'Bid sent LKR 45,000',
          meta: 'Awaiting tourist response',
          status: 'Pending',
          statusVariant: 'warning',
        },
        {
          title: 'Galle coastal loop',
          subtitle: 'Bid accepted',
          meta: 'Trip starts May 12',
          status: 'Accepted',
          statusVariant: 'success',
        },
        {
          title: 'Sigiriya sunrise tour',
          subtitle: 'Bid sent LKR 12,000',
          meta: 'Expires in 6h',
          status: 'Pending',
          statusVariant: 'secondary',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    upcomingTrips: {
      title: 'Upcoming trips',
      description: 'Trips that are locked in.',
      items: [
        {
          title: 'Galle coastal loop',
          subtitle: '3 days with 3 travelers',
          meta: 'Starts May 12',
          status: 'Confirmed',
          statusVariant: 'success',
        },
        {
          title: 'Temple circuit',
          subtitle: 'Pending tourist confirmation',
          meta: 'Starts May 26',
          status: 'Awaiting',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    messages: {
      title: 'Messages',
      description: 'Recent tourist questions.',
      items: [
        {
          title: 'Nila P.',
          subtitle: 'Can we add a sunset stop?',
          meta: 'Last message 45m ago',
          status: '1 unread',
          statusVariant: 'secondary',
        },
        {
          title: 'Amal R.',
          subtitle: 'Confirmed pickup address',
          meta: 'Last message 1 day ago',
          status: 'Read',
          statusVariant: 'outline',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    marketplaceHighlights: {
      title: 'Marketplace highlights',
      description: 'Top itineraries needing bids.',
      items: [
        {
          title: 'Nuwara Eliya day trip',
          subtitle: '2 travelers, 1 day',
          meta: 'Bid deadline 12h',
          status: 'New',
          statusVariant: 'success',
        },
        {
          title: 'Trincomalee coastal tour',
          subtitle: '4 travelers, 2 days',
          meta: 'Bid deadline 2 days',
          status: 'Open',
          statusVariant: 'secondary',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    verificationStatus: {
      title: 'Verification status',
      description: 'Admin review of driver documents.',
      items: [
        {
          title: 'Driver license',
          subtitle: 'Uploaded April 10',
          meta: 'Review in progress',
          status: 'Pending',
          statusVariant: 'warning',
        },
        {
          title: 'Vehicle insurance',
          subtitle: 'Uploaded April 5',
          meta: 'Approved',
          status: 'Verified',
          statusVariant: 'success',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getDriverMarketplaceData() {
  return {
    matches: {
      title: 'Best matches',
      description: 'Itineraries that fit your routes.',
      items: [
        {
          title: 'Nuwara Eliya day trip',
          subtitle: '2 travelers, 1 day',
          meta: 'Bid deadline 12h',
          status: 'Match',
          statusVariant: 'success',
        },
        {
          title: 'Kandy cultural loop',
          subtitle: '3 travelers, 2 days',
          meta: 'Bid deadline 1 day',
          status: 'Match',
          statusVariant: 'success',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    expiringSoon: {
      title: 'Expiring soon',
      description: 'Bids that close within 24 hours.',
      items: [
        {
          title: 'Sigiriya sunrise tour',
          subtitle: '1 traveler, 1 day',
          meta: 'Deadline in 6h',
          status: 'Closing',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    newest: {
      title: 'Newest requests',
      description: 'Fresh itineraries from tourists.',
      items: [
        {
          title: 'Yala safari weekend',
          subtitle: '4 travelers, 2 days',
          meta: 'Posted 2h ago',
          status: 'New',
          statusVariant: 'secondary',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getDriverBidsData() {
  return {
    pending: {
      title: 'Pending bids',
      description: 'Waiting for tourist responses.',
      items: [
        {
          title: 'Ella highlands circuit',
          subtitle: 'Bid LKR 45,000',
          meta: 'Sent 1 day ago',
          status: 'Pending',
          statusVariant: 'warning',
        },
        {
          title: 'Sigiriya sunrise tour',
          subtitle: 'Bid LKR 12,000',
          meta: 'Expires in 6h',
          status: 'Pending',
          statusVariant: 'secondary',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    accepted: {
      title: 'Accepted bids',
      description: 'Trips that are confirmed.',
      items: [
        {
          title: 'Galle coastal loop',
          subtitle: 'Bid LKR 38,000',
          meta: 'Trip starts May 12',
          status: 'Accepted',
          statusVariant: 'success',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    declined: {
      title: 'Declined bids',
      description: 'Bids that were not accepted.',
      items: [
        {
          title: 'Colombo city walk',
          subtitle: 'Bid LKR 8,500',
          meta: 'Declined yesterday',
          status: 'Declined',
          statusVariant: 'destructive',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getDriverTripsData() {
  return {
    upcoming: {
      title: 'Upcoming trips',
      description: 'Trips you have accepted.',
      items: [
        {
          title: 'Galle coastal loop',
          subtitle: '3 travelers, 3 days',
          meta: 'Starts May 12',
          status: 'Confirmed',
          statusVariant: 'success',
        },
        {
          title: 'Temple circuit',
          subtitle: '2 travelers, 2 days',
          meta: 'Starts May 26',
          status: 'Awaiting',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    completed: {
      title: 'Completed trips',
      description: 'Trips that are finished.',
      items: [
        {
          title: 'Mirissa day trip',
          subtitle: '2 travelers, 1 day',
          meta: 'Completed April 2',
          status: 'Paid out',
          statusVariant: 'secondary',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getDriverMessagesData() {
  return {
    threads: {
      title: 'Tourist conversations',
      description: 'Latest messages from tourists.',
      items: [
        {
          title: 'Hana G.',
          subtitle: 'Pickup at 7:00 AM?',
          meta: 'Last message 20m ago',
          status: 'Unread',
          statusVariant: 'secondary',
        },
        {
          title: 'Dilan S.',
          subtitle: 'Confirmed itinerary changes',
          meta: 'Last message 1 day ago',
          status: 'Read',
          statusVariant: 'outline',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getDriverVerificationData() {
  return {
    documents: {
      title: 'Document status',
      description: 'Review progress for uploads.',
      items: [
        {
          title: 'Driver license',
          subtitle: 'Uploaded April 10',
          meta: 'Review in progress',
          status: 'Pending',
          statusVariant: 'warning',
        },
        {
          title: 'Vehicle insurance',
          subtitle: 'Uploaded April 5',
          meta: 'Approved',
          status: 'Verified',
          statusVariant: 'success',
        },
        {
          title: 'Background check',
          subtitle: 'Submitted April 8',
          meta: 'Review in progress',
          status: 'Pending',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    followUps: {
      title: 'Follow ups',
      description: 'Actions required for verification.',
      items: [
        {
          title: 'Vehicle registration',
          subtitle: 'Photo needs re-upload',
          meta: 'Requested 2 days ago',
          status: 'Action needed',
          statusVariant: 'destructive',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getDriverVehicleData() {
  return {
    vehicle: {
      name: 'Toyota Prius',
      plate: 'KX-4521',
      seats: '4 seats',
      status: 'Verified',
      insurance: 'Valid until Aug 2026',
      lastInspection: 'Completed Mar 2026',
    },
    reminders: {
      title: 'Maintenance reminders',
      description: 'Upcoming service milestones.',
      items: [
        {
          title: 'Oil change',
          subtitle: 'Due in 450 km',
          meta: 'Last service Feb 2026',
          status: 'Upcoming',
          statusVariant: 'warning',
        },
        {
          title: 'Tire rotation',
          subtitle: 'Due in 900 km',
          meta: 'Last service Jan 2026',
          status: 'Upcoming',
          statusVariant: 'secondary',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getAdminOverviewData(): {
  stats: DashboardStat[]
  verificationQueue: DashboardListData
  disputeQueue: DashboardListData
  tripMonitoring: DashboardListData
  feedbackModeration: DashboardListData
  marketplaceActivity: DashboardListData
} {
  return {
    stats: [
      {
        title: 'Drivers pending review',
        value: '7',
        description: '3 require document fixes',
        icon: 'shield-check',
      },
      {
        title: 'Open disputes',
        value: '2',
        description: 'Awaiting admin action',
        icon: 'alert-triangle',
      },
      {
        title: 'Trips in progress',
        value: '5',
        description: 'Monitor status updates',
        icon: 'check-square',
      },
      {
        title: 'Reports flagged',
        value: '4',
        description: 'Feedback requiring review',
        icon: 'flag',
      },
    ] satisfies DashboardStat[],
    verificationQueue: {
      title: 'Verification queue',
      description: 'Drivers waiting on approval.',
      items: [
        {
          title: 'Dilan S.',
          subtitle: 'License + insurance pending',
          meta: 'Submitted 3 days ago',
          status: 'Review',
          statusVariant: 'warning',
        },
        {
          title: 'Sani M.',
          subtitle: 'Vehicle documents complete',
          meta: 'Submitted 1 day ago',
          status: 'Ready',
          statusVariant: 'success',
        },
        {
          title: 'Ravi T.',
          subtitle: 'Background check pending',
          meta: 'Submitted 5 days ago',
          status: 'Hold',
          statusVariant: 'secondary',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    disputeQueue: {
      title: 'Dispute queue',
      description: 'Trips requiring admin resolution.',
      items: [
        {
          title: 'Trip #4821',
          subtitle: 'Receipt disagreement',
          meta: 'Opened 2 days ago',
          status: 'Open',
          statusVariant: 'warning',
        },
        {
          title: 'Trip #4814',
          subtitle: 'Driver no-show report',
          meta: 'Opened 6 days ago',
          status: 'Escalated',
          statusVariant: 'destructive',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    tripMonitoring: {
      title: 'Trip monitoring',
      description: 'Active trips with status updates.',
      items: [
        {
          title: 'Trip #4829',
          subtitle: 'Tourist: Amal, Driver: Nila',
          meta: 'On route to Ella',
          status: 'In progress',
          statusVariant: 'success',
        },
        {
          title: 'Trip #4826',
          subtitle: 'Tourist: Hana, Driver: Dilan',
          meta: 'Awaiting driver confirmation',
          status: 'Pending',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    feedbackModeration: {
      title: 'Feedback moderation',
      description: 'Reviews needing review.',
      items: [
        {
          title: 'Driver review flagged',
          subtitle: 'Trip #4817',
          meta: 'Flag reason: language',
          status: 'Flagged',
          statusVariant: 'destructive',
        },
        {
          title: 'Tourist review flagged',
          subtitle: 'Trip #4813',
          meta: 'Flag reason: dispute',
          status: 'Flagged',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    marketplaceActivity: {
      title: 'Marketplace activity',
      description: 'Latest bid and itinerary activity.',
      items: [
        {
          title: '14 new itineraries',
          subtitle: 'Last 24 hours',
          meta: 'Avg. 3 bids each',
          status: 'Healthy',
          statusVariant: 'success',
        },
        {
          title: '2 itineraries stalled',
          subtitle: 'No bids in 72h',
          meta: 'Recommend outreach',
          status: 'Watch',
          statusVariant: 'secondary',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getAdminDriversData() {
  return {
    verificationQueue: {
      title: 'Verification queue',
      description: 'Drivers waiting on approval.',
      items: [
        {
          title: 'Dilan S.',
          subtitle: 'License + insurance pending',
          meta: 'Submitted 3 days ago',
          status: 'Review',
          statusVariant: 'warning',
        },
        {
          title: 'Sani M.',
          subtitle: 'Vehicle documents complete',
          meta: 'Submitted 1 day ago',
          status: 'Ready',
          statusVariant: 'success',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    activeDrivers: {
      title: 'Active drivers',
      description: 'Drivers currently active on platform.',
      items: [
        {
          title: 'Hana G.',
          subtitle: 'Rating 4.9',
          meta: 'Active trips: 1',
          status: 'Active',
          statusVariant: 'success',
        },
        {
          title: 'Amal R.',
          subtitle: 'Rating 4.7',
          meta: 'Active bids: 3',
          status: 'Active',
          statusVariant: 'secondary',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getAdminTouristsData() {
  return {
    activeTourists: {
      title: 'Active tourists',
      description: 'Tourists booking trips this month.',
      items: [
        {
          title: 'Nila P.',
          subtitle: '2 itineraries active',
          meta: 'Last activity 2h ago',
          status: 'Active',
          statusVariant: 'success',
        },
        {
          title: 'Amal S.',
          subtitle: '1 itinerary active',
          meta: 'Last activity 1 day ago',
          status: 'Active',
          statusVariant: 'secondary',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    flagged: {
      title: 'Flagged accounts',
      description: 'Tourists requiring review.',
      items: [
        {
          title: 'Tourist #1284',
          subtitle: 'Dispute escalation',
          meta: 'Flagged 3 days ago',
          status: 'Review',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getAdminTripsData() {
  return {
    inProgress: {
      title: 'Trips in progress',
      description: 'Trips currently active.',
      items: [
        {
          title: 'Trip #4829',
          subtitle: 'Tourist: Amal, Driver: Nila',
          meta: 'On route to Ella',
          status: 'In progress',
          statusVariant: 'success',
        },
        {
          title: 'Trip #4826',
          subtitle: 'Tourist: Hana, Driver: Dilan',
          meta: 'Reached mid point',
          status: 'In progress',
          statusVariant: 'success',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    awaitingConfirmation: {
      title: 'Awaiting confirmation',
      description: 'Trips needing completion confirmation.',
      items: [
        {
          title: 'Trip #4818',
          subtitle: 'Driver completed, tourist pending',
          meta: 'Completed 4h ago',
          status: 'Pending',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getAdminBidsData() {
  return {
    openBids: {
      title: 'Open bids',
      description: 'Bids currently in the marketplace.',
      items: [
        {
          title: 'Kandy to Ella weekend',
          subtitle: '5 bids received',
          meta: 'Closes in 2 days',
          status: 'Active',
          statusVariant: 'success',
        },
        {
          title: 'Yala safari weekend',
          subtitle: '1 bid received',
          meta: 'Closes in 12h',
          status: 'Active',
          statusVariant: 'secondary',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    stalledItineraries: {
      title: 'Stalled itineraries',
      description: 'Itineraries without bids.',
      items: [
        {
          title: 'Trincomalee coastal tour',
          subtitle: '0 bids after 72h',
          meta: 'Tourist: Nila P.',
          status: 'Needs outreach',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getAdminDisputesData() {
  return {
    openDisputes: {
      title: 'Open disputes',
      description: 'Disputes requiring resolution.',
      items: [
        {
          title: 'Trip #4821',
          subtitle: 'Receipt disagreement',
          meta: 'Opened 2 days ago',
          status: 'Open',
          statusVariant: 'warning',
        },
        {
          title: 'Trip #4814',
          subtitle: 'Driver no-show report',
          meta: 'Opened 6 days ago',
          status: 'Escalated',
          statusVariant: 'destructive',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    resolved: {
      title: 'Recently resolved',
      description: 'Disputes closed by admin.',
      items: [
        {
          title: 'Trip #4802',
          subtitle: 'Partial refund issued',
          meta: 'Resolved April 5',
          status: 'Closed',
          statusVariant: 'success',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}

export function getAdminFeedbackData() {
  return {
    flagged: {
      title: 'Flagged feedback',
      description: 'Reviews needing moderation.',
      items: [
        {
          title: 'Driver review flagged',
          subtitle: 'Trip #4817',
          meta: 'Flag reason: language',
          status: 'Flagged',
          statusVariant: 'destructive',
        },
        {
          title: 'Tourist review flagged',
          subtitle: 'Trip #4813',
          meta: 'Flag reason: dispute',
          status: 'Flagged',
          statusVariant: 'warning',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
    recent: {
      title: 'Recent reviews',
      description: 'Latest unflagged feedback.',
      items: [
        {
          title: 'Driver Ravi - 5 stars',
          subtitle: 'Great route planning',
          meta: 'Posted 3h ago',
          status: 'Published',
          statusVariant: 'success',
        },
        {
          title: 'Tourist Hana - 4 stars',
          subtitle: 'On-time pickup',
          meta: 'Posted 1 day ago',
          status: 'Published',
          statusVariant: 'secondary',
        },
      ] satisfies DashboardListItem[],
    } satisfies DashboardListData,
  }
}
