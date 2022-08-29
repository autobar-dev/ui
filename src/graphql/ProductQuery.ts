import { gql } from "graphql-tag";

type ProductQueryParams = {
  id: number;
};

export default (params: ProductQueryParams) => gql`
  query {
    product(id: ${params.id}) {
      id
      name
      description
      type
      image
      prices
      additionalData
      createdAt
    }
  }
`;