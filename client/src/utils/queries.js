import { gql } from '@apollo/client';

export const QUERY_TECH = gql`
query Me {
    me {
      _id
      username
      email
      savedBooks {
        authors
        bookId
        description
        image
        link
        title
      }
      bookCount
    }
  }
  `;