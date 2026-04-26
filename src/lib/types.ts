export type Tradition = "hindu" | "muslim" | "sikh" | "christian" | "jain" | "south-indian";

export type CeremonyType =
  | "mehndi"
  | "haldi"
  | "sangeet"
  | "baraat"
  | "wedding"
  | "reception"
  | "chunni"
  | "vatna"
  | "anand-karaj"
  | "nikah"
  | "custom";

export type RSVPStatus = "confirmed" | "declined" | "pending";

export type VendorCategory =
  | "photography"
  | "catering"
  | "decor"
  | "hair-makeup"
  | "mehndi-artist"
  | "pandit-officiant"
  | "music-entertainment"
  | "invitations"
  | "attire-jewellery"
  | "transportation";

export type BookingStatus = "confirmed" | "pending" | "cancelled";
export type PaymentStatus = "paid" | "partial" | "unpaid" | "pending";
export type ChecklistPhase = "now" | "soon" | "later";
export type VendorUrgency = "book-now" | "book-soon" | "flexible";
export type WeddingSize = "intimate" | "traditional" | "grand" | "luxury";
export type SubscriptionTier = "free" | "standard" | "premium";
export type UserType = "couple" | "vendor";
export type FamilySide = "bride" | "groom";

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  createdAt: string;
}

export interface Wedding {
  id: string;
  coupleUserId: string;
  partner1Name: string;
  partner2Name: string;
  date: string;
  city: string;
  tradition: Tradition;
  templateId: string;
  urlSlug: string;
  createdAt: string;
}

export interface WeddingEvent {
  id: string;
  weddingId: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  dressCode: string;
  ceremonyType: CeremonyType;
  displayColor: string;
  sortOrder: number;
  guestsInvited: number;
  rsvpConfirmed: number;
  createdAt: string;
}

export interface Guest {
  id: string;
  weddingId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  familySide: FamilySide;
  relationship: string;
  createdAt: string;
}

export interface GuestEventRSVP {
  id: string;
  guestId: string;
  eventId: string;
  status: RSVPStatus;
  respondedAt: string | null;
  dietaryNotes: string;
}

export interface Vendor {
  id: string;
  userId: string;
  name: string;
  category: VendorCategory;
  location: string;
  travelRadiusMiles: number;
  traditionSpecialisations: Tradition[];
  subscriptionTier: SubscriptionTier;
  verified: boolean;
  bio: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  priceUnit: string;
  avatarColor: string;
  createdAt: string;
}

export interface VendorService {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  priceFrom: number;
  priceUnit: string;
}

export interface VendorBooking {
  id: string;
  weddingId: string;
  vendorId: string;
  eventId: string;
  vendorName: string;
  vendorCategory: VendorCategory;
  status: BookingStatus;
  totalAmount: number;
  depositPaid: boolean;
  depositAmount: number;
  finalPaymentDueDate: string;
}

export interface Budget {
  id: string;
  weddingId: string;
  totalAmount: number;
}

export interface BudgetCategory {
  id: string;
  budgetId: string;
  name: string;
  allocatedAmount: number;
  spentAmount: number;
  vendorBookingId: string | null;
  vendorName: string | null;
  status: PaymentStatus;
  color: string;
}

export interface BudgetPayment {
  id: string;
  budgetCategoryId: string;
  vendorName: string;
  category: string;
  amount: number;
  paidAt: string | null;
  dueDate: string | null;
  status: PaymentStatus;
}

export interface Template {
  id: string;
  tradition: Tradition;
  weddingSize: WeddingSize;
  name: string;
}

export interface ChecklistItem {
  id: string;
  templateId: string;
  title: string;
  description: string;
  phase: ChecklistPhase;
  monthsBeforeWedding: number;
  ceremonyTag: string;
  completed: boolean;
  dueDate?: string;
}

export interface VendorShortlistItem {
  id: string;
  templateId: string;
  vendorCategory: string;
  urgency: VendorUrgency;
  note: string;
  ceremonyTag: string;
  name: string;
  initials: string;
  iconColor: string;
}

export interface Review {
  id: string;
  vendorId: string;
  reviewerName: string;
  reviewerInitials: string;
  avatarColor: string;
  rating: number;
  date: string;
  text: string;
  ceremonyTag: string;
}

export interface TemplateTheme {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
}

export interface BudgetTemplate {
  size: WeddingSize;
  label: string;
  description: string;
  totalRange: string;
  breakdown: { name: string; amount: string }[];
  selected?: boolean;
}

export interface TimelineItem {
  id: string;
  eventId: string;
  time: string;
  name: string;
  detail: string;
  tags: string[];
  vendorName?: string;
}

export interface RegistryLink {
  id: string;
  name: string;
  url: string;
  logoColor: string;
  logoInitial: string;
}

export interface PhotoAlbum {
  id: string;
  name: string;
  eventId?: string;
  photoCount: number;
  coverColor: string;
}
