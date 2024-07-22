export interface Product {
    _id: string;
    name: string;
    price: number;
    image: { asset: { _ref: string } }[];
    quantity: number;
  }
  
  // types.ts
export interface CartItem {
  product_id: string;
  quantity: number;
}


