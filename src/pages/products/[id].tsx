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
  let prices: any;

  if(!productError) {
    additionalData = JSON.parse(product.additionalData);
    prices = JSON.parse(product.prices);
  }

  return (
    <>
      <Head>
        <title>{ productError ? "Not Found" : product.name } | autobar</title>
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
                  <li>Prices:
                    <ul>
                      { Object.keys(prices).map((currency: string, index: number) => {
                        return (
                          <li key={`price-${product.id}-${currency}`}>{ currency }: { prices[currency] }</li>
                        );
                      }) }
                    </ul>
                  </li>
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
      id: context.query.id,
    }))).product;
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