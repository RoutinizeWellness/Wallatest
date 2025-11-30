export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  location: string; // Siempre "Terrassa"
  joinDate: number;
  verified: boolean; // MVP Feature
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  targetUserId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: number;
}

export enum ListingStatus {
  ACTIVE = 'active',
  RESERVED = 'reserved',
  SOLD = 'sold',
}

export enum Neighborhood {
  CENTRE = "Centre",
  CA_N_AURELL = "Ca n'Aurell",
  SANT_PERE = "Sant Pere",
  LA_MAURINA = "La Maurina",
  SANT_LLORENC = "Sant Llorenç",
  CAN_PARELLADA = "Can Parellada",
  CAN_JOFRESA = "Can Jofresa",
  ROC_BLANC = "Roc Blanc"
}

export enum Category {
  HOGAR = "Hogar",
  NINOS = "Niños y Bebés",
  ELECTRONICA = "Electrónica"
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerVerified: boolean;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: Category | string;
  neighborhood: Neighborhood | string;
  images: string[];
  status: ListingStatus;
  createdAt: number;
  likes: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: number;
  hasSensitiveData?: boolean; // Flag de seguridad
  isSystemWarning?: boolean;
}

export interface ChatSession {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  lastMessage: string;
  lastMessageAt: number;
  hasSafetyWarning: boolean;
}