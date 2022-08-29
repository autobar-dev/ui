import { gql } from "graphql-tag";

export default () => gql`
  query {
    products {
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