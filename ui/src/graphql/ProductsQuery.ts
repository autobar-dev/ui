import { gql } from "graphql-tag";

export type ProductsQuerySortBy = "PURCHASES_ASCENDING" | "PURCHASES_DESCENDING";

export type ProductsQueryParams = {
  query?: string;
  sortBy?: ProductsQuerySortBy;
  take?: number;
  skip?: number;
};

export default (params: ProductsQueryParams) => gql`
  query {
    products(
      query: "${params.query ?? ""}",
      sortBy: "${params.sortBy ?? "PURCHASES_DESCENDING"}",
      take: ${params.take ?? 10},
      skip: ${params.skip ?? 0},
    ) {
      products {
        id
        name
        description
        slug
        image
        type
        style
        additionalData
        createdAt
      }
      
      total
    }
  }
`;