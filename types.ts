export interface ServiceItem {
  title: string;
  description?: string;
}

export interface ServiceCategory {
  title: string;
  items: ServiceItem[];
}

export interface NavItem {
  label: string;
  path: string;
}

export interface Review {
  author: string;
  role?: string;
  content: string;
  rating: number;
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  description: string; // Short description for cards
  longDescription: string; // Full description for details
  price: number;
  imageUrl: string;
  features: string[]; // List of bullet points (e.g., "Hardcover", "240 Pages")
  pubDate?: string;
  reviews?: Review[];
  reviews?: Review[];
}