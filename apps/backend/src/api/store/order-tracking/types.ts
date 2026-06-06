export type InternalOrderStatus =
  | "Placed"
  | "Processing"
  | "Shipped"
  | "Delivered";

export type VeeqoTrackingEvent = {
  timestamp: string;
  description: string;
  detail: string | null;
  location: string | null;
  status: string;
};

export type PublicTrackingItem = {
  id: string;
  title: string;
  quantity: number;
  product_id: string | null;
  product_handle: string | null;
  category_ids: string[];
};

export type PublicOrderTracking = {
  id: string;
  order_number: string;
  status: InternalOrderStatus;
  placed_at: string | null;
  delivered_at: string | null;
  items: PublicTrackingItem[];
  recommended_category_ids: string[];
  shipment_id: string | null;
  latest_tracking_event: VeeqoTrackingEvent | null;
};
