type Product = {
  id: number;

  name: string;
  description?: string;
  slug: string;
  image?: string;
  style: string;
  type: string;
  additionalData?: string;

  createdAt: Date;
}

export default Product;