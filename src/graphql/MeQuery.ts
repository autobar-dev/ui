import { gql } from "graphql-tag";

export default () => gql`
  query {
    me {
      id
      email
      name
      surname
      birthdate
      phoneNumber
      profilePicture
      balance
      balanceCurrency
      verifiedAt
      createdAt
      transactions {
        id
        value
        currency
        createdAt
      }
      purchases {
        id
        amount
        price
        currency
        createdAt
        product {
          id
          name
          description
          image
          type
          additionalData
          createdAt
        }
      }
    }
  }
`;