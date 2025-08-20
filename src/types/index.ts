export interface Entrepreneur {
  id: string;
  businessName: string;
  category: string;
  description: string;
  priceRange?: string;
  phone: string;
  whatsapp: string;
  location: {
    state: string;
    district: string;
    googleMapsLink: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  youtubeVideo?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface State {
  id: string;
  name: string;
  nameEn: string;
  districts: string[];
  stateAdminId?: string;
}

export interface District {
  id: string;
  name: string;
  nameEn: string;
  stateId: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'state_admin' | 'hq_admin';
  stateId?: string;
  permissions: {
    canApprove: boolean;
    canReject: boolean;
    canDelete: boolean;
    canExport: boolean;
  };
  createdAt: Date;
  lastLogin: Date;
}

export interface Language {
  code: 'ms' | 'en';
  name: string;
  nativeName: string;
}
