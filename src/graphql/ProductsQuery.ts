import { gql } from "graphql-tag";

export default () => gql`
  query {
    products {
      id
      name
      description
      image
      type
      additionalData
      createdAt
    }
  }
`;