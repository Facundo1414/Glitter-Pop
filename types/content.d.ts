declare module "@/data/content.json" {
  export interface Business {
    name: string;
    tagline: string;
    description: string;
    email: string;
    phone: string;
    whatsapp?: string;
    instagram: string;
    facebook: string;
    location: string;
    about?: string;
    team?: Array<{
      name: string;
      role: string;
      description: string;
    }>;
    workingHours?: string;
    advanceBooking?: string;
    delivery?: string;
  }

  export interface Service {
    id: string;
    title: string;
    description: string;
    image: string;
    duration: string;
    icon: string;
  }

  export interface PortfolioItem {
    id: string;
    title: string;
    image: string;
    category: string;
  }

  export interface Testimonial {
    id: string;
    name: string;
    text: string;
    rating: number;
    event: string;
  }

  export interface FAQ {
    id: string;
    question: string;
    answer: string;
  }

  export interface Package {
    id: string;
    name: string;
    price: string;
    duration: string;
    features: string[];
    ideal: string;
    popular?: boolean;
  }

  export interface ContentData {
    business: Business;
    services: Service[];
    portfolio: PortfolioItem[];
    testimonials: Testimonial[];
    faqs: FAQ[];
    packages: Package[];
  }

  const content: ContentData;
  export default content;
}
