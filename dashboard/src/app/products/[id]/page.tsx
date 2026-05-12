"use client";

import { use } from "react";
import ProductDetailSection from "@/components/sections/product_detail";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);

  return (
    <ProductDetailSection id={id} />
  );
}
