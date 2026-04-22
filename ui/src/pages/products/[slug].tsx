import React, { useEffect } from 'react'
import Layout from '../../components/organisms/Shell'
import { sendGraphQL } from '../../utils/helpers/sendGraphQL';

import ProductQuery from "../../graphql/ProductQuery";
import Head from 'next/head';
import ProductCard from '../../components/organisms/ProductCard';

type ProductPagePropsType = {
  product: any;
  productError: boolean;
};

export default function ProductPage({ product, productError }: ProductPagePropsType) {
  let additionalData: any;

  if(!productError) {
    additionalData = JSON.parse(product.additionalData);
  }

  return (
    <>
      <Head>
        <title>{ productError ? "Not Found" : product.name } | Autobar</title>
      </Head>
      <Layout>
        <h1>Product page</h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {
            productError && (
              <h1>There has been an error</h1>
            )
          }
          { !productError && (
              <>
                <img
                  src={product.image}
                  alt={`${product.name} image`}
                  style={{ height: "400px" }}
                />
                <ul>
                  <li>{product.name}</li>
                  <li>{product.description}</li>
                  <li>{product.type}</li>
                  <li>{product.style}</li>
                  <li>Additional data:
                    <ul>
                      { Object.keys(additionalData).map((key: string, index: number) => {
                        return (
                          <li key={`additionaldata-${product.id}-${key}`}>{ key }: { additionalData[key] }</li>
                        );
                      }) }
                    </ul>
                  </li>
                  <li>{product.createdAt}</li>
                </ul>
              </>
            )
          }
        </div>
      </Layout>
    </>
  )
}

export async function getServerSideProps(context: any): Promise<any | { props: ProductPagePropsType }> {
  let productError = false;
  let product = {};

  try {
    product = (await sendGraphQL(ProductQuery({
      slug: context.query.slug,
    }))).product;

    if(!product) {
      throw new Error("Product not found");
    }
  } catch(e) {
    console.log(e);
    productError = true;
  }

  return {
    props: {
      product,
      productError,
    },
  };
}