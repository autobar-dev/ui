import React, { useEffect, useState } from 'react'
import Shell from '../../components/organisms/Shell'
import { sendGraphQL } from '../../utils/helpers/sendGraphQL';
import Head from 'next/head';
import { useStyles } from "../../pages_styles/products/productsStyles";
import { IconSearch } from "@tabler/icons";

import ProductsQuery, { ProductsQuerySortBy } from "../../graphql/ProductsQuery";
import ProductsList from '../../components/organisms/ProductsList';
import { Button, Loader, Pagination, TextInput } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Product from '../../types/Product';

const defaultSearchData = {
  query: "",
  sortBy: "PURCHASES_DESCENDING",
  take: 5,
  skip: 0,
};

type ProductsPagePropsType = {
  products: Product[],
  totalProducts: number,
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
  totalProducts: totalProductsSsr,
  productsError: productsErrorSsr,
  searchData: searchDataSsr,
}: ProductsPagePropsType) {
  const { classes, theme } = useStyles();

  const isSmallScreen = useMediaQuery(theme.fn.smallerThan("sm").split("@media ")[1]);

  const [products, setProducts] = useState(productsSsr);
  const [totalProducts, setTotalProducts] = useState(totalProductsSsr);
  const [productsError, setProductsError] = useState(productsErrorSsr);
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  const [isAfterSsr, setIsAfterSsr] = useState(false);

  const [query, setQuery] = useState(searchDataSsr.query);
  const [sortBy, setSortBy] = useState(searchDataSsr.sortBy);
  const [take, setTake] = useState(searchDataSsr.take);
  const [skip, setSkip] = useState(searchDataSsr.skip);
  const [activePage, setActivePage] = useState(1);

  const [searchInputValue, setSearchInputValue] = useState(searchDataSsr.query);

  const [totalPages, setTotalPages] = useState(totalProductsSsr / searchDataSsr.take);

  useEffect(() => {
    setTotalPages(
      Math.ceil(totalProducts / take)
    );
  }, [totalProducts, take]);

  useEffect(() => {
    setActivePage(
      Math.floor(skip / take) + 1
    );

    if(isAfterSsr) {
      triggerSearch();
    } else {
      setIsAfterSsr(true);
    }
  }, [take, skip]);

  // useEffect(() => {
  //   const url = new URL(window.location as any);

  //   if(query != defaultSearchData.query) {
  //     url.searchParams.set('query', query);
  //   } else {
  //     url.searchParams.delete('query');
  //   }

  //   if(sortBy != defaultSearchData.sortBy) {
  //     url.searchParams.set('sortBy', sortBy);
  //   } else {
  //     url.searchParams.delete('sortBy');
  //   }
    
  //   if(take != defaultSearchData.take) {
  //     url.searchParams.set('take', take.toString());
  //   } else {
  //     url.searchParams.delete('take');
  //   }
    
  //   if(skip != defaultSearchData.skip) {
  //     url.searchParams.set('skip', skip.toString());
  //   } else {
  //     url.searchParams.delete('skip');
  //   }

  //   window.history.pushState(null, '', url.toString());
  // }, [query, sortBy, take, skip]);

  async function triggerSearch() {
    setQuery(searchInputValue);
    setIsProductsLoading(true);
    setProductsError(false);

    try {
      const data = await sendGraphQL(ProductsQuery({
        query: searchInputValue,
        sortBy: sortBy as ProductsQuerySortBy,
        take,
        skip,
      }));

      const { products, total } = data.products;
        
      setProducts(products);
      setTotalProducts(total);
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
              className={classes.searchInput}
              placeholder={"What beer's on your mind?"}
              size={'lg'}
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              error={productsError}
              onKeyUp={(e) => {
                if(e.key === "Enter") {
                  triggerSearch();
                }
              }}
            />
            <Button
              className={classes.searchButton}
              size={'lg'}
              onClick={triggerSearch}
            >
              {
                isSmallScreen ? (
                  <IconSearch size={20} />
                ) : "Search"
              }
            </Button>
          </div>
          {
            (productsError || isProductsLoading) && (
              <div className={classes.stateOtherThanSuccessContainer}>
                {
                  productsError && (
                    <h1>There has been an error.</h1>
                  )
                }
                {
                  isProductsLoading && (
                    <Loader size={'lg'} />
                  )
                }
              </div>
            )
          }
          { (!productsError && !isProductsLoading) &&
            <ProductsList
              products={products}
            />
          }
          {
            !productsError && (
              <Pagination
                className={classes.pagination}
                position={"center"}
                total={totalPages}
                page={activePage}
                onChange={
                  (newPage) => {
                    setSkip((newPage - 1) * take);
                  }
                }
              />
            )
          }
        </div>
      </Shell>
    </>
  )
}

export async function getServerSideProps(context: any): Promise<any | { props: ProductsPagePropsType }> {
  let productsError = false;
  let products = [];
  let totalProducts = 0;

  const { req } = context;
  const { query: urlQuery } = req;
  const { query, sortBy, take, skip } = urlQuery;

  const searchData = {
    query: query || defaultSearchData.query,
    sortBy: sortBy || defaultSearchData.sortBy,
    take: take || defaultSearchData.take,
    skip: skip || defaultSearchData.skip,
  };

  try {
    const result = (await sendGraphQL(ProductsQuery(searchData)));

    products = result.products.products;
    totalProducts = result.products.total;
  } catch(e) {
    console.log(e);
    productsError = true;
  }

  const ssrData: ProductsPagePropsType = {
    products,
    totalProducts, 
    productsError,
    searchData,
  };

  return {
    props: ssrData,
  };
}