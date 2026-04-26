import type {
  Wedding,
  WeddingEvent,
  Guest,
  GuestEventRSVP,
  Vendor,
  VendorService,
  VendorBooking,
  Budget,
  BudgetCategory,
  BudgetPayment,
  ChecklistItem,
  VendorShortlistItem,
  Review,
  BudgetTemplate,
  TimelineItem,
  RegistryLink,
  PhotoAlbum,
} from "./types";

// ── Wedding ──────────────────────────────────────────────

export const mockWedding: Wedding = {
  id: "wedding-1",
  coupleUserId: "user-1",
  partner1Name: "Priya",
  partner2Name: "Arjun",
  date: "2025-11-14",
  city: "Chicago, IL",
  tradition: "hindu",
  templateId: "mughal",
  urlSlug: "priya-arjun",
  createdAt: "2025-06-01",
};

// ── Events ───────────────────────────────────────────────

export const mockEvents: WeddingEvent[] = [
  {
    id: "evt-1",
    weddingId: "wedding-1",
    name: "Mehndi",
    date: "2025-11-12",
    time: "4:00 PM",
    venue: "Sharma Residence",
    dressCode: "Casual colorful",
    ceremonyType: "mehndi",
    displayColor: "#D4537E",
    sortOrder: 1,
    guestsInvited: 85,
    rsvpConfirmed: 61,
    createdAt: "2025-06-01",
  },
  {
    id: "evt-2",
    weddingId: "wedding-1",
    name: "Haldi",
    date: "2025-11-13",
    time: "10:00 AM",
    venue: "Sharma Residence",
    dressCode: "Yellow / white",
    ceremonyType: "haldi",
    displayColor: "#EF9F27",
    sortOrder: 2,
    guestsInvited: 60,
    rsvpConfirmed: 35,
    createdAt: "2025-06-01",
  },
  {
    id: "evt-3",
    weddingId: "wedding-1",
    name: "Sangeet",
    date: "2025-11-13",
    time: "7:00 PM",
    venue: "Grand Ballroom, Palmer House",
    dressCode: "Cocktail / Indo-western",
    ceremonyType: "sangeet",
    displayColor: "#1D9E75",
    sortOrder: 3,
    guestsInvited: 200,
    rsvpConfirmed: 142,
    createdAt: "2025-06-01",
  },
  {
    id: "evt-4",
    weddingId: "wedding-1",
    name: "Wedding Ceremony",
    date: "2025-11-14",
    time: "10:00 AM",
    venue: "BAPS Shri Swaminarayan Mandir",
    dressCode: "Traditional formal",
    ceremonyType: "wedding",
    displayColor: "#534AB7",
    sortOrder: 4,
    guestsInvited: 312,
    rsvpConfirmed: 187,
    createdAt: "2025-06-01",
  },
  {
    id: "evt-5",
    weddingId: "wedding-1",
    name: "Reception",
    date: "2025-11-14",
    time: "6:00 PM",
    venue: "Grand Ballroom, Palmer House",
    dressCode: "Black tie",
    ceremonyType: "reception",
    displayColor: "#D85A30",
    sortOrder: 5,
    guestsInvited: 312,
    rsvpConfirmed: 224,
    createdAt: "2025-06-01",
  },
];

// ── Guests (sample) ─────────────────────────────────────

export const mockGuests: Guest[] = [
  { id: "g-1", weddingId: "wedding-1", firstName: "Anita", lastName: "Patel", email: "anita@example.com", phone: "312-555-0101", familySide: "bride", relationship: "Aunt", createdAt: "2025-06-15" },
  { id: "g-2", weddingId: "wedding-1", firstName: "Raj", lastName: "Kumar", email: "raj@example.com", phone: "312-555-0102", familySide: "groom", relationship: "Cousin", createdAt: "2025-06-15" },
  { id: "g-3", weddingId: "wedding-1", firstName: "Meera", lastName: "Singh", email: "meera@example.com", phone: "312-555-0103", familySide: "bride", relationship: "Friend", createdAt: "2025-06-15" },
  { id: "g-4", weddingId: "wedding-1", firstName: "Vikram", lastName: "Desai", email: "vikram@example.com", phone: "312-555-0104", familySide: "groom", relationship: "Brother", createdAt: "2025-06-15" },
  { id: "g-5", weddingId: "wedding-1", firstName: "Sunita", lastName: "Sharma", email: "sunita@example.com", phone: "312-555-0105", familySide: "bride", relationship: "Mother", createdAt: "2025-06-15" },
];

// ── Booked Vendors ──────────────────────────────────────

export const mockBookedVendors: Vendor[] = [
  { id: "v-1", userId: "vu-1", name: "Patel & Co Photography", category: "photography", location: "Chicago, IL", travelRadiusMiles: 50, traditionSpecialisations: ["hindu", "sikh"], subscriptionTier: "premium", verified: true, bio: "Award-winning South Asian wedding photography.", rating: 4.9, reviewCount: 127, startingPrice: 6000, priceUnit: "package", avatarColor: "#534AB7", createdAt: "2025-01-01" },
  { id: "v-2", userId: "vu-2", name: "Sharma Kitchen", category: "catering", location: "Chicago, IL", travelRadiusMiles: 30, traditionSpecialisations: ["hindu", "jain"], subscriptionTier: "standard", verified: true, bio: "Authentic North Indian catering for weddings.", rating: 4.7, reviewCount: 89, startingPrice: 45, priceUnit: "per plate", avatarColor: "#1D9E75", createdAt: "2025-01-01" },
  { id: "v-3", userId: "vu-3", name: "DJ Ravi", category: "music-entertainment", location: "Chicago, IL", travelRadiusMiles: 100, traditionSpecialisations: ["hindu", "sikh", "muslim"], subscriptionTier: "standard", verified: true, bio: "Bollywood + Western DJ for Indian weddings.", rating: 4.8, reviewCount: 64, startingPrice: 2500, priceUnit: "event", avatarColor: "#D85A30", createdAt: "2025-01-01" },
  { id: "v-4", userId: "vu-4", name: "Meena's Mehndi", category: "mehndi-artist", location: "Chicago, IL", travelRadiusMiles: 40, traditionSpecialisations: ["hindu", "sikh", "muslim"], subscriptionTier: "premium", verified: true, bio: "Intricate bridal mehndi designs.", rating: 5.0, reviewCount: 42, startingPrice: 400, priceUnit: "session", avatarColor: "#D4537E", createdAt: "2025-01-01" },
];

// ── Marketplace Vendors (browse page) ───────────────────

export const mockMarketplaceVendors: Vendor[] = [
  ...mockBookedVendors,
  { id: "v-5", userId: "vu-5", name: "Rani Arts Decor", category: "decor", location: "Naperville, IL", travelRadiusMiles: 60, traditionSpecialisations: ["hindu", "sikh"], subscriptionTier: "premium", verified: true, bio: "Luxury mandap and venue decor.", rating: 4.8, reviewCount: 56, startingPrice: 5000, priceUnit: "package", avatarColor: "#EF9F27", createdAt: "2025-01-01" },
  { id: "v-6", userId: "vu-6", name: "Shreya Designs", category: "invitations", location: "Chicago, IL", travelRadiusMiles: 0, traditionSpecialisations: ["hindu", "muslim", "sikh"], subscriptionTier: "standard", verified: true, bio: "Custom wedding invitations with Indian motifs.", rating: 4.6, reviewCount: 31, startingPrice: 300, priceUnit: "set of 100", avatarColor: "#7F77DD", createdAt: "2025-01-01" },
  { id: "v-7", userId: "vu-7", name: "Kavya Beauty Studio", category: "hair-makeup", location: "Oak Brook, IL", travelRadiusMiles: 35, traditionSpecialisations: ["hindu", "south-indian"], subscriptionTier: "standard", verified: false, bio: "South Asian bridal hair and makeup.", rating: 4.5, reviewCount: 23, startingPrice: 800, priceUnit: "session", avatarColor: "#D4537E", createdAt: "2025-01-01" },
  { id: "v-8", userId: "vu-8", name: "Pandit Sharma", category: "pandit-officiant", location: "Schaumburg, IL", travelRadiusMiles: 50, traditionSpecialisations: ["hindu"], subscriptionTier: "free", verified: true, bio: "Experienced Hindu wedding officiant.", rating: 4.9, reviewCount: 78, startingPrice: 500, priceUnit: "ceremony", avatarColor: "#3C3489", createdAt: "2025-01-01" },
];

// ── Vendor Bookings ─────────────────────────────────────

export const mockVendorBookings: VendorBooking[] = [
  { id: "vb-1", weddingId: "wedding-1", vendorId: "v-1", eventId: "evt-4", vendorName: "Patel & Co Photography", vendorCategory: "photography", status: "confirmed", totalAmount: 6000, depositPaid: true, depositAmount: 3000, finalPaymentDueDate: "2025-10-14" },
  { id: "vb-2", weddingId: "wedding-1", vendorId: "v-2", eventId: "evt-5", vendorName: "Sharma Kitchen", vendorCategory: "catering", status: "confirmed", totalAmount: 12000, depositPaid: true, depositAmount: 4200, finalPaymentDueDate: "2025-10-30" },
  { id: "vb-3", weddingId: "wedding-1", vendorId: "v-3", eventId: "evt-3", vendorName: "DJ Ravi", vendorCategory: "music-entertainment", status: "pending", totalAmount: 3500, depositPaid: true, depositAmount: 1200, finalPaymentDueDate: "2025-11-01" },
  { id: "vb-4", weddingId: "wedding-1", vendorId: "v-4", eventId: "evt-1", vendorName: "Meena's Mehndi", vendorCategory: "mehndi-artist", status: "pending", totalAmount: 1200, depositPaid: false, depositAmount: 400, finalPaymentDueDate: "2025-11-05" },
];

// ── Budget ───────────────────────────────────────────────

export const mockBudget: Budget = {
  id: "budget-1",
  weddingId: "wedding-1",
  totalAmount: 38000,
};

export const mockBudgetCategories: BudgetCategory[] = [
  { id: "bc-1", budgetId: "budget-1", name: "Photography & Film", allocatedAmount: 6000, spentAmount: 6000, vendorBookingId: "vb-1", vendorName: "Patel & Co", status: "paid", color: "#534AB7" },
  { id: "bc-2", budgetId: "budget-1", name: "Catering", allocatedAmount: 12000, spentAmount: 4200, vendorBookingId: "vb-2", vendorName: "Sharma Kitchen", status: "partial", color: "#1D9E75" },
  { id: "bc-3", budgetId: "budget-1", name: "Decor & Florals", allocatedAmount: 5000, spentAmount: 2500, vendorBookingId: null, vendorName: null, status: "partial", color: "#EF9F27" },
  { id: "bc-4", budgetId: "budget-1", name: "Hair & Makeup", allocatedAmount: 3000, spentAmount: 1500, vendorBookingId: null, vendorName: null, status: "partial", color: "#D4537E" },
  { id: "bc-5", budgetId: "budget-1", name: "Mehndi Artist", allocatedAmount: 1200, spentAmount: 0, vendorBookingId: "vb-4", vendorName: "Meena's Mehndi", status: "unpaid", color: "#D85A30" },
  { id: "bc-6", budgetId: "budget-1", name: "Music & Entertainment", allocatedAmount: 3500, spentAmount: 0, vendorBookingId: "vb-3", vendorName: "DJ Ravi", status: "unpaid", color: "#7F77DD" },
];

export const mockPaymentsUpcoming: BudgetPayment[] = [
  { id: "bp-1", budgetCategoryId: "bc-2", vendorName: "Sharma Kitchen", category: "Catering", amount: 7800, paidAt: null, dueDate: "2025-10-30", status: "pending" },
  { id: "bp-2", budgetCategoryId: "bc-6", vendorName: "DJ Ravi", category: "Music", amount: 2300, paidAt: null, dueDate: "2025-11-01", status: "pending" },
  { id: "bp-3", budgetCategoryId: "bc-5", vendorName: "Meena's Mehndi", category: "Mehndi", amount: 400, paidAt: null, dueDate: "2025-11-05", status: "pending" },
];

export const mockPaymentsHistory: BudgetPayment[] = [
  { id: "bp-4", budgetCategoryId: "bc-1", vendorName: "Patel & Co", category: "Photography", amount: 6000, paidAt: "2025-07-15", dueDate: null, status: "paid" },
  { id: "bp-5", budgetCategoryId: "bc-2", vendorName: "Sharma Kitchen", category: "Catering", amount: 4200, paidAt: "2025-08-01", dueDate: null, status: "paid" },
  { id: "bp-6", budgetCategoryId: "bc-6", vendorName: "DJ Ravi", category: "Music", amount: 1200, paidAt: "2025-08-15", dueDate: null, status: "paid" },
];

// ── Checklist ────────────────────────────────────────────

export const mockChecklist: ChecklistItem[] = [
  { id: "cl-1", templateId: "t-1", title: "Finalise guest list", description: "Complete all RSVPs", phase: "now", monthsBeforeWedding: 3, ceremonyTag: "All events", completed: true, dueDate: "Aug 15" },
  { id: "cl-2", templateId: "t-1", title: "Book mehndi artist", description: "Confirm Meena's Mehndi", phase: "now", monthsBeforeWedding: 3, ceremonyTag: "Mehndi", completed: true, dueDate: "Aug 20" },
  { id: "cl-3", templateId: "t-1", title: "Sangeet playlist", description: "Share song list with DJ Ravi", phase: "now", monthsBeforeWedding: 2, ceremonyTag: "Sangeet", completed: false, dueDate: "Sep 1" },
  { id: "cl-4", templateId: "t-1", title: "Bridal outfit fitting", description: "Schedule final fitting", phase: "soon", monthsBeforeWedding: 2, ceremonyTag: "Wedding", completed: false, dueDate: "Sep 15" },
  { id: "cl-5", templateId: "t-1", title: "Confirm venue setup", description: "Walk through with decorator", phase: "soon", monthsBeforeWedding: 1, ceremonyTag: "Reception", completed: false, dueDate: "Oct 14" },
];

// ── Sikh Template Checklist ─────────────────────────────

export const mockSikhChecklist: ChecklistItem[] = [
  // Right now
  { id: "sc-1", templateId: "t-sikh", title: "Book Gurudwara for Anand Karaj", description: "Confirm availability with the Granthi. Most Gurudwaras book 12–18 months ahead.", phase: "now", monthsBeforeWedding: 12, ceremonyTag: "Anand Karaj", completed: true },
  { id: "sc-2", templateId: "t-sikh", title: "Hire a Ragi Jatha", description: "Traditional Kirtan singers for the Anand Karaj. Top Ragis book a year in advance.", phase: "now", monthsBeforeWedding: 12, ceremonyTag: "Anand Karaj", completed: true },
  { id: "sc-3", templateId: "t-sikh", title: "Choose wedding photographer", description: "Look for someone who has shot Sikh weddings and knows the flow of Anand Karaj.", phase: "now", monthsBeforeWedding: 10, ceremonyTag: "All events", completed: true },
  { id: "sc-4", templateId: "t-sikh", title: "Book caterer for Langar & Reception", description: "Gurudwara Langar is typically separate from the Reception caterer.", phase: "now", monthsBeforeWedding: 10, ceremonyTag: "Anand Karaj", completed: true },
  { id: "sc-5", templateId: "t-sikh", title: "Start guest list by ceremony", description: "Chunni, Mehndi, and Anand Karaj often have different guest lists.", phase: "now", monthsBeforeWedding: 9, ceremonyTag: "Planning", completed: false },
  { id: "sc-6", templateId: "t-sikh", title: "Select bridal lehenga / anarkali", description: "Custom pieces from India take 4–6 months. Order early.", phase: "now", monthsBeforeWedding: 8, ceremonyTag: "Planning", completed: false },
  { id: "sc-7", templateId: "t-sikh", title: "Book Dhol player for Baraat", description: "Essential for the groom's entrance. Popular players book fast.", phase: "now", monthsBeforeWedding: 8, ceremonyTag: "Wedding", completed: false },
  // Coming up
  { id: "sc-8", templateId: "t-sikh", title: "Plan Chunni / Kurmai ceremony", description: "Decide on venue, guest list, and outfit for the Sikh engagement.", phase: "soon", monthsBeforeWedding: 6, ceremonyTag: "Chunni", completed: false },
  { id: "sc-9", templateId: "t-sikh", title: "Send Save the Dates", description: "Especially for out-of-town guests who need to book flights.", phase: "soon", monthsBeforeWedding: 6, ceremonyTag: "Planning", completed: false },
  { id: "sc-10", templateId: "t-sikh", title: "Book Mehndi artist", description: "Choose between traditional Rajasthani and modern Arabic styles.", phase: "soon", monthsBeforeWedding: 5, ceremonyTag: "Mehndi", completed: false },
  { id: "sc-11", templateId: "t-sikh", title: "Plan Sangeet programme", description: "Book DJ or live band. Coordinate family dance performances.", phase: "soon", monthsBeforeWedding: 4, ceremonyTag: "Sangeet", completed: false },
  { id: "sc-12", templateId: "t-sikh", title: "Finalise Reception venue & decor", description: "Confirm layout, centerpieces, and stage setup with decorator.", phase: "soon", monthsBeforeWedding: 3, ceremonyTag: "Reception", completed: false },
  // Later
  { id: "sc-13", templateId: "t-sikh", title: "Send formal invitations", description: "Mail printed invitations with digital RSVP link.", phase: "later", monthsBeforeWedding: 2, ceremonyTag: "Planning", completed: false },
  { id: "sc-14", templateId: "t-sikh", title: "Confirm all vendor timelines", description: "Walk through day-of schedule with each vendor.", phase: "later", monthsBeforeWedding: 1, ceremonyTag: "All events", completed: false },
  { id: "sc-15", templateId: "t-sikh", title: "Final dress fittings", description: "Bride, groom, and wedding party final fittings.", phase: "later", monthsBeforeWedding: 1, ceremonyTag: "Planning", completed: false },
];

// ── Sikh Budget Templates ───────────────────────────────

export const mockBudgetTemplates: BudgetTemplate[] = [
  {
    size: "intimate",
    label: "Intimate",
    description: "Close family & friends, 50–100 guests",
    totalRange: "$22,000 – $35,000",
    breakdown: [
      { name: "Gurudwara & Langar", amount: "$3,000" },
      { name: "Photography", amount: "$4,000" },
      { name: "Catering (Reception)", amount: "$6,000" },
      { name: "Decor & florals", amount: "$3,000" },
      { name: "Attire & jewellery", amount: "$4,000" },
      { name: "Music & Dhol", amount: "$2,000" },
    ],
  },
  {
    size: "traditional",
    label: "Traditional",
    description: "Extended family, 150–250 guests",
    totalRange: "$40,000 – $75,000",
    selected: true,
    breakdown: [
      { name: "Gurudwara & Langar", amount: "$5,000" },
      { name: "Photography & film", amount: "$7,000" },
      { name: "Catering (Reception)", amount: "$15,000" },
      { name: "Decor & florals", amount: "$8,000" },
      { name: "Attire & jewellery", amount: "$8,000" },
      { name: "Music, DJ & Dhol", amount: "$5,000" },
    ],
  },
  {
    size: "grand",
    label: "Grand",
    description: "Large celebration, 300–500 guests",
    totalRange: "$80,000 – $150,000",
    breakdown: [
      { name: "Gurudwara & Langar", amount: "$8,000" },
      { name: "Photography & film", amount: "$12,000" },
      { name: "Catering (Reception)", amount: "$35,000" },
      { name: "Decor & florals", amount: "$20,000" },
      { name: "Attire & jewellery", amount: "$15,000" },
      { name: "Music, DJ & Dhol", amount: "$10,000" },
    ],
  },
  {
    size: "luxury",
    label: "Luxury",
    description: "Destination or palace-style, 500+ guests",
    totalRange: "$150,000+",
    breakdown: [
      { name: "Venue & Gurudwara", amount: "$25,000" },
      { name: "Photography & film", amount: "$20,000" },
      { name: "Catering (all events)", amount: "$60,000" },
      { name: "Decor & florals", amount: "$40,000" },
      { name: "Attire & jewellery", amount: "$30,000" },
      { name: "Entertainment", amount: "$20,000" },
    ],
  },
];

// ── Sikh Vendor Shortlist ───────────────────────────────

export const mockVendorShortlist: VendorShortlistItem[] = [
  { id: "vs-1", templateId: "t-sikh", vendorCategory: "Anand Karaj", urgency: "book-now", note: "Confirm Gurudwara 12–18 months out", ceremonyTag: "Anand Karaj", name: "Granthi & Ragi Jatha", initials: "GR", iconColor: "#534AB7" },
  { id: "vs-2", templateId: "t-sikh", vendorCategory: "Anand Karaj", urgency: "book-now", note: "Top Ragis book a year ahead", ceremonyTag: "Anand Karaj", name: "Ragi Jatha", initials: "RJ", iconColor: "#3C3489" },
  { id: "vs-3", templateId: "t-sikh", vendorCategory: "All events", urgency: "book-now", note: "South Asian wedding experience essential", ceremonyTag: "All events", name: "Photographer & Videographer", initials: "PV", iconColor: "#1D9E75" },
  { id: "vs-4", templateId: "t-sikh", vendorCategory: "Wedding", urgency: "book-soon", note: "Essential for groom's entrance", ceremonyTag: "Wedding", name: "Dhol Player", initials: "DP", iconColor: "#EF9F27" },
  { id: "vs-5", templateId: "t-sikh", vendorCategory: "Mehndi", urgency: "book-soon", note: "Choose Rajasthani or Arabic style", ceremonyTag: "Mehndi", name: "Mehndi Artist", initials: "MA", iconColor: "#D4537E" },
  { id: "vs-6", templateId: "t-sikh", vendorCategory: "Sangeet", urgency: "flexible", note: "DJ + live band combo popular", ceremonyTag: "Sangeet", name: "DJ / Live Band", initials: "DJ", iconColor: "#D85A30" },
  { id: "vs-7", templateId: "t-sikh", vendorCategory: "Reception", urgency: "book-soon", note: "Separate from Gurudwara Langar", ceremonyTag: "Reception", name: "Reception Caterer", initials: "RC", iconColor: "#1D9E75" },
  { id: "vs-8", templateId: "t-sikh", vendorCategory: "Reception", urgency: "flexible", note: "Mandap, stage, centerpieces", ceremonyTag: "Reception", name: "Decorator / Florist", initials: "DF", iconColor: "#EF9F27" },
];

// ── Vendor Services (for profile page) ──────────────────

export const mockVendorServices: Record<string, VendorService[]> = {
  "v-4": [
    { id: "vs-m1", vendorId: "v-4", name: "Bridal Mehndi", description: "Full bridal hands & feet", priceFrom: 400, priceUnit: "session" },
    { id: "vs-m2", vendorId: "v-4", name: "Guest Mehndi", description: "Simple designs for guests", priceFrom: 15, priceUnit: "per person" },
    { id: "vs-m3", vendorId: "v-4", name: "Sangeet Mehndi", description: "Matching party designs", priceFrom: 250, priceUnit: "group" },
    { id: "vs-m4", vendorId: "v-4", name: "Trial Session", description: "Pre-wedding design trial", priceFrom: 100, priceUnit: "session" },
  ],
};

// ── Reviews ─────────────────────────────────────────────

export const mockReviews: Review[] = [
  {
    id: "r-1",
    vendorId: "v-4",
    reviewerName: "Simran K.",
    reviewerInitials: "SK",
    avatarColor: "#D4537E",
    rating: 5,
    date: "Oct 2024",
    text: "Meena did the most incredible bridal mehndi for my wedding. She was patient, detailed, and the design lasted for weeks. All my guests were impressed!",
    ceremonyTag: "Mehndi",
  },
  {
    id: "r-2",
    vendorId: "v-4",
    reviewerName: "Aisha R.",
    reviewerInitials: "AR",
    avatarColor: "#534AB7",
    rating: 5,
    date: "Sep 2024",
    text: "Booked Meena for both the bridal and guest mehndi. She managed a group of 30 guests effortlessly. Beautiful modern Arabic designs.",
    ceremonyTag: "Mehndi",
  },
];

// ── Guest Event RSVPs ────────────────────────────────────

export const mockGuestRSVPs: GuestEventRSVP[] = [
  // Anita Patel (bride side, aunt) – attending most events
  { id: "rsvp-1", guestId: "g-1", eventId: "evt-1", status: "confirmed", respondedAt: "2025-08-10", dietaryNotes: "" },
  { id: "rsvp-2", guestId: "g-1", eventId: "evt-2", status: "declined", respondedAt: "2025-08-10", dietaryNotes: "" },
  { id: "rsvp-3", guestId: "g-1", eventId: "evt-3", status: "confirmed", respondedAt: "2025-08-10", dietaryNotes: "Vegetarian" },
  { id: "rsvp-4", guestId: "g-1", eventId: "evt-4", status: "confirmed", respondedAt: "2025-08-10", dietaryNotes: "Vegetarian" },
  { id: "rsvp-5", guestId: "g-1", eventId: "evt-5", status: "confirmed", respondedAt: "2025-08-10", dietaryNotes: "Vegetarian" },
  // Raj Kumar (groom side, cousin) – partial attendance
  { id: "rsvp-6", guestId: "g-2", eventId: "evt-1", status: "declined", respondedAt: "2025-08-12", dietaryNotes: "" },
  { id: "rsvp-7", guestId: "g-2", eventId: "evt-2", status: "confirmed", respondedAt: "2025-08-12", dietaryNotes: "" },
  { id: "rsvp-8", guestId: "g-2", eventId: "evt-3", status: "confirmed", respondedAt: "2025-08-12", dietaryNotes: "" },
  { id: "rsvp-9", guestId: "g-2", eventId: "evt-4", status: "confirmed", respondedAt: "2025-08-12", dietaryNotes: "" },
  { id: "rsvp-10", guestId: "g-2", eventId: "evt-5", status: "confirmed", respondedAt: "2025-08-12", dietaryNotes: "" },
  // Meera Singh (bride side, friend) – all pending
  { id: "rsvp-11", guestId: "g-3", eventId: "evt-1", status: "pending", respondedAt: null, dietaryNotes: "" },
  { id: "rsvp-12", guestId: "g-3", eventId: "evt-2", status: "pending", respondedAt: null, dietaryNotes: "" },
  { id: "rsvp-13", guestId: "g-3", eventId: "evt-3", status: "pending", respondedAt: null, dietaryNotes: "" },
  { id: "rsvp-14", guestId: "g-3", eventId: "evt-4", status: "pending", respondedAt: null, dietaryNotes: "" },
  { id: "rsvp-15", guestId: "g-3", eventId: "evt-5", status: "pending", respondedAt: null, dietaryNotes: "" },
  // Vikram Desai (groom side, brother) – attending all
  { id: "rsvp-16", guestId: "g-4", eventId: "evt-1", status: "confirmed", respondedAt: "2025-08-05", dietaryNotes: "" },
  { id: "rsvp-17", guestId: "g-4", eventId: "evt-2", status: "confirmed", respondedAt: "2025-08-05", dietaryNotes: "" },
  { id: "rsvp-18", guestId: "g-4", eventId: "evt-3", status: "confirmed", respondedAt: "2025-08-05", dietaryNotes: "" },
  { id: "rsvp-19", guestId: "g-4", eventId: "evt-4", status: "confirmed", respondedAt: "2025-08-05", dietaryNotes: "" },
  { id: "rsvp-20", guestId: "g-4", eventId: "evt-5", status: "confirmed", respondedAt: "2025-08-05", dietaryNotes: "" },
  // Sunita Sharma (bride side, mother) – attending all
  { id: "rsvp-21", guestId: "g-5", eventId: "evt-1", status: "confirmed", respondedAt: "2025-07-28", dietaryNotes: "No nuts" },
  { id: "rsvp-22", guestId: "g-5", eventId: "evt-2", status: "confirmed", respondedAt: "2025-07-28", dietaryNotes: "No nuts" },
  { id: "rsvp-23", guestId: "g-5", eventId: "evt-3", status: "confirmed", respondedAt: "2025-07-28", dietaryNotes: "No nuts" },
  { id: "rsvp-24", guestId: "g-5", eventId: "evt-4", status: "confirmed", respondedAt: "2025-07-28", dietaryNotes: "No nuts" },
  { id: "rsvp-25", guestId: "g-5", eventId: "evt-5", status: "confirmed", respondedAt: "2025-07-28", dietaryNotes: "No nuts" },
];

// ── Timeline Items (Sangeet day) ─────────────────────────

export const mockTimelineItems: TimelineItem[] = [
  { id: "tl-1", eventId: "evt-3", time: "4:00 PM", name: "Venue doors open", detail: "Decor team final setup, sound check", tags: ["Decor", "DJ Ravi"], vendorName: "DJ Ravi" },
  { id: "tl-2", eventId: "evt-3", time: "5:30 PM", name: "Photographer arrives", detail: "Getting-ready shots, detail shots", tags: ["Photography"], vendorName: "Patel & Co" },
  { id: "tl-3", eventId: "evt-3", time: "6:30 PM", name: "Guests arrive", detail: "Welcome drinks, cocktail hour begins", tags: ["Catering"] },
  { id: "tl-4", eventId: "evt-3", time: "7:00 PM", name: "Sangeet begins", detail: "Couple entrance, welcome speech by family", tags: ["DJ Ravi"], vendorName: "DJ Ravi" },
  { id: "tl-5", eventId: "evt-3", time: "7:30 PM", name: "Family performances", detail: "Bride's side medley, groom's family group", tags: ["Choreography"] },
  { id: "tl-6", eventId: "evt-3", time: "8:30 PM", name: "Dinner service", detail: "Buffet opens, DJ plays ambient music", tags: ["Catering", "DJ Ravi"], vendorName: "Sharma Kitchen" },
  { id: "tl-7", eventId: "evt-3", time: "9:15 PM", name: "Couple's first dance", detail: "Bollywood medley choreographed routine", tags: ["DJ Ravi"] },
  { id: "tl-8", eventId: "evt-3", time: "9:30 PM", name: "Open dance floor", detail: "DJ set, all guests dancing", tags: ["DJ Ravi"], vendorName: "DJ Ravi" },
  { id: "tl-9", eventId: "evt-3", time: "11:00 PM", name: "Event ends", detail: "Last song, couple exit, vendor wrap-up", tags: ["Venue"] },
];

// ── Registry Links ────────────────────────────────────────

export const mockRegistryLinks: RegistryLink[] = [
  { id: "reg-1", name: "Zola", url: "zola.com/registry/priya-arjun", logoColor: "#EEEDFE", logoInitial: "Z" },
  { id: "reg-2", name: "Amazon", url: "amazon.com/wedding/registry/3BFKJS8", logoColor: "#FAEEDA", logoInitial: "A" },
];

// ── Photo Albums ──────────────────────────────────────────

export const mockPhotoAlbums: PhotoAlbum[] = [
  { id: "alb-all", name: "All photos", photoCount: 48, coverColor: "#534AB7" },
  { id: "alb-1", name: "Mehndi", eventId: "evt-1", photoCount: 12, coverColor: "#D4537E" },
  { id: "alb-2", name: "Haldi", eventId: "evt-2", photoCount: 8, coverColor: "#EF9F27" },
  { id: "alb-3", name: "Sangeet", eventId: "evt-3", photoCount: 15, coverColor: "#1D9E75" },
  { id: "alb-4", name: "Wedding Ceremony", eventId: "evt-4", photoCount: 9, coverColor: "#534AB7" },
  { id: "alb-5", name: "Reception", eventId: "evt-5", photoCount: 4, coverColor: "#D85A30" },
];

// ── Guest Templates ─────────────────────────────────────

export const mockGuestTemplates = [
  { id: "gt-1", title: "Full Guest List", description: "Master list with all guests across every ceremony", iconColor: "#534AB7" },
  { id: "gt-2", title: "Ceremony-specific Lists", description: "Separate lists for Chunni, Mehndi, Anand Karaj, and Reception", iconColor: "#1D9E75" },
  { id: "gt-3", title: "RSVP Tracker", description: "Track responses per ceremony with automatic reminders", iconColor: "#EF9F27" },
];
