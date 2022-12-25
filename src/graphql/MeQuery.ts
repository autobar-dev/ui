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
        amount
        currency
        paymentId
        status
        createdAt
        updatedAt
      }

      purchases {
        id
        amount
        paid
        currency
        active
        startedAt
        finishedAt
        
        product {
          id
          name
          description
          image
          type
          style
          additionalData
          createdAt
        }
      }
    }
  }
`;