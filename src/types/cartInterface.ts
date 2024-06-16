export interface CartWithTotalPrice {
  id: number;
  userId: number;
  items: {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
    product: {
      id: number;
      title: string;
      price: number;
    };
  }[];
  totalPrice?: number;
}