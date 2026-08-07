export interface DesignOption {
  id: string;
  name: string;
  description: string;
  price: number;
  included?: boolean;
  effects?: string[];
}

export interface DesignSelections {
  layoutId: string;
  navigationIds: string[];
  animationTierId: string;
  heroTypeId: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  style: string[];
  colors: string[];
  thumbnail: string;
  previews: {
    desktop: string[];
    mobile: string[];
  };
  includedPages: string[];
  suitableFor: string;
  basePrice: number;
  compatibleFeatures: string[];
  featured?: boolean;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  included?: boolean;
}

export interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  templateId: string;
  templateName: string;
  selectedFeatures: string[];
  designSelections?: DesignSelections;
  designSelectionLabels?: {
    layout: string;
    navigation: string[];
    animationTier: string;
    heroType: string;
  };
  totalPrice: number;
  currency?: string;
}

export interface InquiryRecord extends InquiryPayload {
  id: string;
  created_at: string;
  user_id?: string | null;
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  phone: string | null;
  company: string | null;
  is_admin?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavedConfig {
  id: string;
  user_id: string;
  name: string;
  template_id: string | null;
  selected_features: string[];
  design_selections: DesignSelections;
  sketch_snapshot: import("@/types/sketch").SketchState | null;
  total_price: number;
  created_at: string;
  updated_at: string;
}
