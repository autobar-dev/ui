import { ServiceProduct } from "@/repositories/ProductRepository";
import { Product } from "@/types/product";

export function serviceProductToProduct(serviceProduct: ServiceProduct): Product {
  return {
    id: serviceProduct.id,
    names: serviceProduct.names,
    descriptions: serviceProduct.descriptions,
    cover: serviceProduct.cover,
    enabled: serviceProduct.enabled,
    badges: serviceProduct.badges,
    createdAt: new Date(serviceProduct.created_at),
    updatedAt: new Date(serviceProduct.updated_at),
  };
}
