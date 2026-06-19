export const colors = {
  primary: "#9e0000",
  primaryContainer: "#cc0000",
  secondary: "#3a5f94",
  background: "#fcf9f8",
  surface: "#ffffff",
  surfaceContainerLow: "#f6f3f2",
  surfaceContainer: "#f0eded",
  surfaceContainerHigh: "#eae7e7",
  surfaceContainerHighest: "#e5e2e1",
  onSurface: "#1c1b1b",
  onSurfaceVariant: "#5e3f3a",
  outline: "#926e69",
  outlineVariant: "#e8bdb6",
};

export const fonts = {
  sans: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  headline: "Chivo, 'Helvetica Neue', Helvetica, Arial, sans-serif",
};

export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  thumbnail?: string;
  price: string;
}

export interface Address {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
}
