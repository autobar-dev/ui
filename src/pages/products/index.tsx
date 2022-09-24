import React from 'react'
import Shell from '../../components/organisms/Shell'
// import Card from "../../components/organisms/Card";
import { sendGraphQL } from '../../utils/helpers/sendGraphQL';
import Head from 'next/head';
import { Carousel } from "@mantine/carousel";

import ProductsQuery from "../../graphql/ProductsQuery";
import ProductCard from '../../components/organisms/ProductCard';

type ProductsPagePropsType = {
  products: any[];
  productsError: boolean;
};

export default function ProductsPage({ products, productsError }: ProductsPagePropsType) {
  return (
    <>
      <Head>
        <title>Products | Autobar</title>
      </Head>
      <Shell>
        <h1>Products list</h1>
        <div>
          {
            productsError && (
              <h1>There has been an error</h1>
            )
          }
          { !productsError &&
            <Carousel
              mx="auto"
              sx={{
                maxWidth: "700px",
              }}
              slideSize="70%"
              withIndicators
              withControls
            >
              {
                products.map((product: any) => {
                  return (
                    <Carousel.Slide key={`product-${product.id}`}>
                      <ProductCard
                        product={product}
                      />
                    </Carousel.Slide>
                  );
                })
              }
            </Carousel>
          }        
        </div>
      </Shell>
    </>
  )
}

export async function getServerSideProps(context: any): Promise<any | { props: ProductsPagePropsType }> {
  let productsError = false;
  let products = [];

  try {
    products = (await sendGraphQL(ProductsQuery())).products;
  } catch(e) {
    console.log(e);
    productsError = true;
  }

  return {
    props: {
      products,
      productsError,
    },
  };
}