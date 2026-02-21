export interface Product {
  id: string;
  name: string;
  defaultPriceCents: number;
}

export const products: Product[] = [
  { id: 'prod_1', name: 'Premium Subscription', defaultPriceCents: 4900 },
  { id: 'prod_2', name: 'Standard Subscription', defaultPriceCents: 1900 },
  { id: 'prod_3', name: 'One-time Consultation', defaultPriceCents: 15000 },
  { id: 'prod_4', name: 'Donation', defaultPriceCents: 500 },
];
