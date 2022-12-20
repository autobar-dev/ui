import React, { useEffect, useState } from 'react'
import Shell from '../../components/organisms/Shell'
import { sendGraphQL } from '../../utils/helpers/sendGraphQL';
import Head from 'next/head';
import { useStyles } from "../../pages_styles/products/productsStyles";
import { IconSearch } from "@tabler/icons";

import ProductsQuery, { ProductsQuerySortBy } from "../../graphql/ProductsQuery";
import ProductsList from '../../components/organisms/ProductsList';
import { Button, Loader, TextInput } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const defaultSearchData = {
  query: "",
  sortBy: "PURCHASES_DESCENDING",
  take: 10,
  skip: 0,
};

type ProductsPagePropsType = {
  products: any[],
  productsError: boolean,
  searchData: {
    query: string,
    sortBy: string,
    take: number,
    skip: number,
  },
};

export default function ProductsPage({
  products: productsSsr,
  productsError: productsErrorSsr,
  searchData: searchDataSsr,
}: ProductsPagePropsType) {
  const { classes, theme } = useStyles();

  const isSmallScreen = useMediaQuery(theme.fn.smallerThan("sm").split("@media ")[1]);

  const [products, setProducts] = useState(productsSsr);
  const [productsError, setProductsError] = useState(productsErrorSsr);
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  const [query, setQuery] = useState(searchDataSsr.query);
  const [sortBy, setSortBy] = useState(searchDataSsr.sortBy);
  const [take, setTake] = useState(searchDataSsr.take);
  const [skip, setSkip] = useState(searchDataSsr.skip);

  const [searchInputValue, setSearchInputValue] = useState(searchDataSsr.query);

  useEffect(() => {
    const url = new URL(window.location as any);

    if(query != defaultSearchData.query) {
      url.searchParams.set('query', query);
    } else {
      url.searchParams.delete('query');
    }

    if(sortBy != defaultSearchData.sortBy) {
      url.searchParams.set('sortBy', sortBy);
    } else {
      url.searchParams.delete('sortBy');
    }
    
    if(take != defaultSearchData.take) {
      url.searchParams.set('take', take.toString());
    } else {
      url.searchParams.delete('take');
    }
    
    if(skip != defaultSearchData.skip) {
      url.searchParams.set('skip', skip.toString());
    } else {
      url.searchParams.delete('skip');
    }

    window.history.pushState(null, '', url.toString());
  }, [query, sortBy, take, skip]);

  async function handleSearchButtonClick() {
    console.log("searchInputValue", searchInputValue);

    setQuery(searchInputValue);
    setIsProductsLoading(true);

    try {
      const data = await sendGraphQL(ProductsQuery({
        query: searchInputValue,
        sortBy: sortBy as ProductsQuerySortBy,
        take,
        skip,
      }));

      setProducts(data.products);
    } catch(e) {
      console.log(e);
      setProductsError(true);
    }

    setIsProductsLoading(false);
  }

  return (
    <>
      <Head>
        <title>Products | Autobar</title>
      </Head>
      <Shell>
        <div className={classes.root}>
          <div className={classes.searchWrapper}>
            <TextInput
              // label="Search"
              className={classes.searchInput}
              placeholder={"What beer's on your mind?"}
              size={'lg'}
              // disabled={loading}
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              error={productsError}
              onKeyUp={(e) => {
                if(e.key === "Enter") {
                  handleSearchButtonClick();
                }
              }}
              // icon={
              //   <MessageIcon
              //     className={classes.inputIcon}
              //     color="#f8f8f8"
              //   />
              // }
            />
            <Button
              className={classes.searchButton}
              size={'lg'}
              disabled={isProductsLoading}
              onClick={handleSearchButtonClick}
            >
              {
                isProductsLoading ? (
                  <Loader size={'sm'} />
                ) : (
                  isSmallScreen ? (
                    <IconSearch size={20} />
                  ) :
                    "Search"
                )
              }
            </Button>
          </div>
          {
            productsError && (
              <h1>There has been an error.</h1>
            )
          }
          { !productsError &&
            <ProductsList
              products={products}
            />
          }
        </div>
      </Shell>
    </>
  )
}

export async function getServerSideProps(context: any): Promise<any | { props: ProductsPagePropsType }> {
  let productsError = false;
  let products = [];

  const { req } = context;
  const { query: urlQuery } = req;
  const { query, sortBy, take, skip } = urlQuery;

  const searchData = {
    query: query || "",
    sortBy: sortBy || "PURCHASES_DESCENDING",
    take: take || 10,
    skip: skip || 0,
  };

  try {
    products = (await sendGraphQL(ProductsQuery(searchData))).products;
  } catch(e) {
    console.log(e);
    productsError = true;
  }

  return {
    props: {
      products,
      productsError,
      searchData,
    },
  };
}