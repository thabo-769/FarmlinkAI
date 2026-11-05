export interface ProductItem {
  id: string;
  seller_id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  unit: string;
  location: string;
  status: 'active' | 'pending' | 'sold';
  image?: string;
  created_at: string;
  profiles?: { full_name: string; location: string };
}

export interface FarmingTaskItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: 'low' | 'normal' | 'high';
  due_at?: string;
  completed_at?: string | null;
  duration_minutes?: number;
  time_spent_seconds?: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  role: 'farmer' | 'buyer' | 'supplier' | 'admin';
  location?: string;
  phone?: string;
  farm_name?: string;
  farm_size?: string;
  farming_type?: string;
  bio?: string;
  avatar_path?: string;
  created_at: string;
}

// In-memory data store with live syncing
export const db = {
  profiles: new Map<string, UserProfile>(),
  products: [
    {
      id: 'tomatoes-1',
      seller_id: 'seller-1',
      name: 'Vine-Ripe Roma Tomatoes',
      category: 'Vegetables',
      description: 'Freshly harvested, firm Roma tomatoes packed in standard 20kg wooden crates. Ideal for wholesale, groceries, and catering.',
      price: 12.0,
      currency: 'USD',
      quantity: 120,
      unit: 'crate',
      location: 'Mutoko, Mashonaland East',
      image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85',
      status: 'active' as const,
      created_at: new Date().toISOString(),
      profiles: { full_name: 'Blessing Moyo', location: 'Mutoko' },
    },
    {
      id: 'butternut-1',
      seller_id: 'seller-2',
      name: 'Waltham Butternut Squash',
      category: 'Vegetables',
      description: 'Sweet, mature orange-flesh Waltham butternut squash. Cured and graded, excellent shelf life of up to 4 months.',
      price: 0.65,
      currency: 'USD',
      quantity: 3500,
      unit: 'kg',
      location: 'Mazowe, Mashonaland Central',
      image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=900&q=85',
      status: 'active' as const,
      created_at: new Date().toISOString(),
      profiles: { full_name: 'Farai Dube', location: 'Mazowe' },
    },
    {
      id: 'avocado-1',
      seller_id: 'seller-3',
      name: 'Export-Grade Hass Avocados',
      category: 'Fruits',
      description: 'High-oil content creamy Hass avocados from Chipinge highlands. Available in 4kg cartons or bulk crates.',
      price: 1.4,
      currency: 'USD',
      quantity: 1800,
      unit: 'kg',
      location: 'Chipinge, Manicaland',
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=85',
      status: 'active' as const,
      created_at: new Date().toISOString(),
      profiles: { full_name: 'Eastern Valley Orchards', location: 'Chipinge' },
    },
    {
      id: 'bananas-1',
      seller_id: 'seller-4',
      name: 'Sweet Cavendish Bananas',
      category: 'Fruits',
      description: 'Green mature Cavendish banana bunches straight from irrigated Honde Valley plantations. Ready for ripening chambers or direct market.',
      price: 0.35,
      currency: 'USD',
      quantity: 5000,
      unit: 'kg',
      location: 'Honde Valley, Manicaland',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=85',
      status: 'active' as const,
      created_at: new Date().toISOString(),
      profiles: { full_name: 'Tariro Chikowe', location: 'Honde Valley' },
    },
    {
      id: 'maize-1',
      seller_id: 'seller-5',
      name: 'Grade A White Maize Grain',
      category: 'Grains & Cereals',
      description: 'Dry, moisture-tested (12.5%) white grain maize. Cleaned, pest-free, bagged in standard 50kg polypropylene grain sacks.',
      price: 0.38,
      currency: 'USD',
      quantity: 15000,
      unit: 'kg',
      location: 'Bindura, Mashonaland Central',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=900&q=85',
      status: 'active' as const,
      created_at: new Date().toISOString(),
      profiles: { full_name: 'Bindura Farmers Union', location: 'Bindura' },
    },
    {
      id: 'cattle-1',
      seller_id: 'seller-6',
      name: 'Holstein-Friesian Dairy Heifers',
      category: 'Livestock & Poultry',
      description: 'In-calf dairy heifers (6 months pregnant) from pedigree stock. Fully vaccinated with complete veterinary records available.',
      price: 850.0,
      currency: 'USD',
      quantity: 8,
      unit: 'head',
      location: 'Norton, Mashonaland West',
      image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=900&q=85',
      status: 'active' as const,
      created_at: new Date().toISOString(),
      profiles: { full_name: 'Serui River Dairy Farm', location: 'Norton' },
    },
    {
      id: 'chickens-1',
      seller_id: 'seller-7',
      name: 'Indigenous Free-Range Roadrunners',
      category: 'Livestock & Poultry',
      description: 'Healthy free-range roadrunner chickens (Boschveld & Sasso crosses). Naturally raised on grain and forage, average weight 1.8kg – 2.2kg.',
      price: 6.5,
      currency: 'USD',
      quantity: 180,
      unit: 'bird',
      location: 'Goromonzi, Mashonaland East',
      image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85',
      status: 'active' as const,
      created_at: new Date().toISOString(),
      profiles: { full_name: 'Chiedza Poultry', location: 'Goromonzi' },
    },
    {
      id: 'solar-pump-1',
      seller_id: 'seller-8',
      name: 'Solar DC Submersible Borehole Pump Kit',
      category: 'Equipment & Tools',
      description: 'Complete 3-inch brushless solar submersible pump with 2 x 330W tier-1 mono panels, MPPT controller, and 50m cable. Pumps up to 2,500 L/hour at 70m head.',
      price: 420.0,
      currency: 'USD',
      quantity: 14,
      unit: 'complete kit',
      location: 'Harare CBD, Harare',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=900&q=85',
      status: 'active' as const,
      created_at: new Date().toISOString(),
      profiles: { full_name: 'ZimSolar Agri Supplies', location: 'Harare' },
    },
    {
      id: 'fertiliser-1',
      seller_id: 'seller-9',
      name: 'Compound D Basal Fertiliser (7-14-7)',
      category: 'Inputs & Seeds',
      description: 'Essential basal fertiliser with nitrogen, phosphorus, and potassium plus sulphur. Formulated for cereal and legume establishment across Zimbabwe soils.',
      price: 36.0,
      currency: 'USD',
      quantity: 150,
      unit: 'bag (50kg)',
      location: 'Norton Industrial, Mashonaland West',
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=900&q=85',
      status: 'active' as const,
      created_at: new Date().toISOString(),
      profiles: { full_name: 'Agri Supply Zimbabwe', location: 'Norton' },
    },
    {
      id: 'honey-1',
      seller_id: 'seller-10',
      name: '100% Pure Raw Mountain Forest Honey',
      category: 'Agro-Processed',
      description: 'Unfiltered, raw organic multifloral honey from the indigenous miombo woodlands of Nyanga. Rich in pollen, enzymes, and antioxidants.',
      price: 8.5,
      currency: 'USD',
      quantity: 320,
      unit: 'jar (1kg)',
      location: 'Nyanga, Manicaland',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=85',
      status: 'active' as const,
      created_at: new Date().toISOString(),
      profiles: { full_name: 'Nyanga Mountain Apiaries', location: 'Nyanga' },
    },
    {
      id: 'sunflower-oil-1',
      seller_id: 'seller-11',
      name: 'Cold-Pressed Sunflower Cooking Oil',
      category: 'Agro-Processed',
      description: 'Unrefined, pure virgin sunflower cooking oil pressed from non-GMO seeds. Natural golden clarity, zero cholesterol.',
      price: 32.0,
      currency: 'USD',
      quantity: 85,
      unit: 'container (20L)',
      location: 'Gweru, Midlands',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=85',
      status: 'active' as const,
      created_at: new Date().toISOString(),
      profiles: { full_name: 'Midlands Press & Oil Co', location: 'Gweru' },
    },
  ] as ProductItem[],
  tasks: new Map<string, FarmingTaskItem[]>(),
};
