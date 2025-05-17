export interface Advertisement {
  id: number
  title: string
  description: string
  sponsorName: string
  ctaText: string
  ctaLink: string
  discount?: string
  discountDescription?: string
  imageUrl?: string
  startDate: string
  endDate: string
  packageDuration: "3months" | "6months" | "9months" | "12months"
  advertiserEmail: string
  reminderSent30Days: boolean
  reminderSent15Days: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAdvertisementData {
  title: string
  description: string
  sponsorName: string
  ctaText: string
  ctaLink: string
  discount?: string
  discountDescription?: string
  imageUrl?: string
  packageDuration: "3months" | "6months" | "9months" | "12months"
  advertiserEmail: string
  isActive: boolean
}
