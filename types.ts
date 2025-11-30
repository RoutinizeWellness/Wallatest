import { Id } from "./convex/_generated/dataModel";

export interface User {
  _id: string;
  name: string;
  email?: string;
  avatar?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  isVerified?: boolean;
}

export interface Listing {
  _id: string; // Convex ID
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerVerified: boolean;
  title: string;
  description: string;
  price: number;
  category: string;
  neighborhood?: string; // Mapped from location.name
  images: string[];
  status: string;
  createdAt: number;
  views?: number;
  favorites?: number;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
}

export enum ListingStatus {
  ACTIVE = 'active',
  RESERVED = 'reserved',
  SOLD = 'sold',
}

export enum Category {
  HOGAR = "Hogar",
  NINOS = "Niños y Bebés",
  ELECTRONICA = "Electrónica"
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