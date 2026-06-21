export interface OrderItem {
  id: string
  productId: string
  variantId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  userId: string | null
  email: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  stripePaymentIntentId: string | null
  shippingAddress: ShippingAddress
  trackingNumber: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ShippingAddress {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}
