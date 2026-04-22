import { gql } from "graphql-tag";

type ProductQueryParams = {
  id?: number;
  slug?: string;
};

export default (params: ProductQueryParams) => gql`
  query {
    product(${params.id ? `id: ${params.id}` : `slug: "${params.slug}"`}) {
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
  }
`;