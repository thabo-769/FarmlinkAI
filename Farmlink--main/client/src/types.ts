export type Role = 'farmer' | 'buyer' | 'supplier' | 'admin';
export type Product = { id: string; name: string; category: string; description: string; price: number; currency: string; quantity: number; unit: string; location: string; image: string; seller: string; status: 'active'|'pending'|'sold'; };
