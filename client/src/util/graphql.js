import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      file {
        id
        filename 
        data
      }
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;


export const FETCH_TOTAL_LIKES_QUERY = gql`
  {
    getTotalLikes {
      totalLikes
    }
  }
`;