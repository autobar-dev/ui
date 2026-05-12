import { ServiceProduct } from "@/repositories/ProductRepository";
import { Product } from "@/types/product";

export function serviceProductToProduct(serviceProduct: ServiceProduct): Product {
  const toMap = (obj: Record<string, string>) => {
    const map = new Map<string, string>();
    if (obj) {
      Object.entries(obj).forEach(([key, value]) => map.set(key, value));
    }
    return map;
  };

  return {
    id: serviceProduct.id,
    slug: serviceProduct.slug,
    names: toMap(serviceProduct.names),
    descriptions: toMap(serviceProduct.descriptions),
    cover: serviceProduct.cover,
    enabled: serviceProduct.enabled,
    badges: serviceProduct.badges,
    createdAt: new Date(serviceProduct.created_at),
    updatedAt: new Date(serviceProduct.updated_at),
  };
}
