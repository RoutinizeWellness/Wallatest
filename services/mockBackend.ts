import { Listing, ListingStatus, User, ChatSession, Review, Neighborhood, Category } from "../types";

// Datos iniciales de Terrassa
const INITIAL_USERS: User[] = [
  {
    id: "u1",
    name: "Marc T.",
    email: "marc@terrassa.cat",
    avatar: "https://ui-avatars.com/api/?name=Marc+T&background=0D9488&color=fff",
    rating: 4.8,
    reviewCount: 5,
    location: "Terrassa, Centre",
    joinDate: Date.now() - 100000000,
    verified: true
  },
  {
    id: "u2",
    name: "Laura G.",
    email: "laura@gmail.com",
    avatar: "https://ui-avatars.com/api/?name=Laura+G&background=random",
    rating: 5.0,
    reviewCount: 12,
    location: "Terrassa, Ca n'Aurell",
    joinDate: Date.now() - 200000000,
    verified: true
  }
];

let users = [...INITIAL_USERS];
let currentUserId = "u1"; // Default session for dev, overwritten by auth

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    reviewerId: "u2",
    reviewerName: "Laura G.",
    reviewerAvatar: "https://ui-avatars.com/api/?name=Laura+G&background=random",
    targetUserId: "u1",
    rating: 5,
    comment: "Quedamos en la Rambla y todo perfecto. Muy puntual.",
    createdAt: Date.now() - 5000000,
  }
];

let reviews = [...MOCK_REVIEWS];

const MOCK_LISTINGS: Listing[] = [
  {
    id: "l1",
    sellerId: "u2",
    sellerName: "Laura G.",
    sellerAvatar: "https://ui-avatars.com/api/?name=Laura+G&background=random",
    sellerVerified: true,
    title: "Trona IKEA Antilop",
    description: "Trona usada pero en buen estado. Incluye la bandeja. Ideal para segunda residencia.",
    price: 10,
    currency: "EUR",
    category: Category.NINOS,
    neighborhood: Neighborhood.CA_N_AURELL,
    images: ["https://picsum.photos/seed/trona/400/300"],
    status: ListingStatus.ACTIVE,
    createdAt: Date.now() - 100000,
    likes: 4,
  },
  {
    id: "l2",
    sellerId: "u3",
    sellerName: "Jordi R.",
    sellerAvatar: "https://ui-avatars.com/api/?name=Jordi+R&background=random",
    sellerVerified: false,
    title: "Nintendo Switch Lite Turquesa",
    description: "Funciona perfectamente. Tiene un pequeño rasguño en la parte trasera que no afecta. Entrego en mano.",
    price: 120,
    currency: "EUR",
    category: Category.ELECTRONICA,
    neighborhood: Neighborhood.SANT_PERE,
    images: ["https://picsum.photos/seed/switch/400/300"],
    status: ListingStatus.ACTIVE,
    createdAt: Date.now() - 500000,
    likes: 12,
  },
  {
    id: "l3",
    sellerId: "u4",
    sellerName: "Marta V.",
    sellerAvatar: "https://ui-avatars.com/api/?name=Marta+V&background=random",
    sellerVerified: true,
    title: "Mesita de noche madera",
    description: "Mesita vintage restaurada. Queda muy bien en habitación pequeña.",
    price: 35,
    currency: "EUR",
    category: Category.HOGAR,
    neighborhood: Neighborhood.CENTRE,
    images: ["https://picsum.photos/seed/mesa/400/300"],
    status: ListingStatus.ACTIVE,
    createdAt: Date.now() - 800000,
    likes: 8,
  }
];

const MOCK_CHATS: ChatSession[] = [
  {
    id: "c1",
    listingId: "l1",
    listingTitle: "Trona IKEA Antilop",
    listingImage: "https://picsum.photos/seed/trona/100",
    otherUserId: "u2",
    otherUserName: "Laura G.",
    otherUserAvatar: "https://ui-avatars.com/api/?name=Laura+G&background=random",
    lastMessage: "¿Te va bien quedar mañana en Parc Vallparadís?",
    lastMessageAt: Date.now() - 3600000,
    hasSafetyWarning: false
  }
];

// Simple Event Emitter
type Listener = () => void;
const listeners: Set<Listener> = new Set();
const notify = () => listeners.forEach(l => l());

export const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

let listings = [...MOCK_LISTINGS];
const chats = [...MOCK_CHATS];

// Middleware de Seguridad (Simulado)
const checkSafety = (content: string): boolean => {
  const phoneRegex = /(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}/;
  const emailRegex = /[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/;
  return phoneRegex.test(content) || emailRegex.test(content);
};

export const api = {
  // --- AUTH METHODS ---
  login: async (email: string): Promise<User | null> => {
    await new Promise(r => setTimeout(r, 800));
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      currentUserId = user.id;
      return user;
    }
    return null;
  },

  register: async (name: string, email: string, neighborhood: Neighborhood): Promise<User> => {
    await new Promise(r => setTimeout(r, 1000));
    const newUser: User = {
      id: "u" + Date.now(),
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff`,
      rating: 0,
      reviewCount: 0,
      location: `Terrassa, ${neighborhood}`,
      joinDate: Date.now(),
      verified: false
    };
    users.push(newUser);
    currentUserId = newUser.id;
    return newUser;
  },

  getCurrentUser: () => {
    return users.find(u => u.id === currentUserId) || users[0];
  },
  
  logout: () => {
    currentUserId = "";
  },

  // --- DATA METHODS ---

  getUser: async (userId?: string): Promise<User> => {
    // Si no se pasa ID, devolvemos el usuario logueado actualmente
    const targetId = userId || currentUserId;
    const user = users.find(u => u.id === targetId);
    
    // Fallback safe
    const safeUser = user || users[0];

    // Calculamos rating real
    const userReviews = reviews.filter(r => r.targetUserId === safeUser.id);
    const avgRating = userReviews.length > 0 
      ? userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length
      : safeUser.rating;

    return {
      ...safeUser,
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: userReviews.length,
    };
  },

  getReviews: async (userId: string): Promise<Review[]> => {
    return reviews.filter(r => r.targetUserId === userId).sort((a, b) => b.createdAt - a.createdAt);
  },

  addReview: async (review: any) => {
    await new Promise(r => setTimeout(r, 600));
    const currentUser = users.find(u => u.id === currentUserId) || users[0];
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerAvatar: currentUser.avatar,
    };
    reviews = [newReview, ...reviews];
    notify();
  },

  getListings: async (search?: string, category?: string, neighborhood?: string): Promise<Listing[]> => {
    await new Promise(r => setTimeout(r, 300));
    let result = listings.filter(l => l.status !== ListingStatus.SOLD);
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
    }
    if (category && category !== "Todos") {
      result = result.filter(l => l.category === category);
    }
    if (neighborhood && neighborhood !== "Todos") {
      result = result.filter(l => l.neighborhood === neighborhood);
    }
    return result.sort((a, b) => b.createdAt - a.createdAt);
  },

  createListing: async (data: Omit<Listing, "id" | "sellerId" | "sellerName" | "sellerAvatar" | "sellerVerified" | "createdAt" | "likes">): Promise<Listing> => {
    await new Promise(r => setTimeout(r, 800));
    const currentUser = users.find(u => u.id === currentUserId) || users[0];
    
    const newListing: Listing = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      sellerVerified: currentUser.verified,
      createdAt: Date.now(),
      likes: 0,
    };
    listings = [newListing, ...listings];
    notify();
    return newListing;
  },

  getChats: async (): Promise<ChatSession[]> => {
    return chats;
  },

  sendMessage: async (chatId: string, content: string): Promise<boolean> => {
    const isRisky = checkSafety(content);
    return isRisky;
  },

  buyItem: async (listingId: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1500));
    const idx = listings.findIndex(l => l.id === listingId);
    if (idx !== -1) {
      listings[idx] = { ...listings[idx], status: ListingStatus.SOLD };
      notify();
      return true;
    }
    return false;
  }
};