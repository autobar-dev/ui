type Product = {
  id: number;

  name: string;
  description?: string;
  image?: string;
  type: string;
  additionalData?: string;

  createdAt: Date;
}

export default Product;