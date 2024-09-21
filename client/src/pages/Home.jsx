import React, { useContext } from "react";
import { useQuery, useSubscription } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";
// import { useQuery, useSubscription } from '@apollo/client';

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import {
  FETCH_POSTS_QUERY,
  FETCH_TOTAL_LIKES_QUERY,
  TOTAL_LIKE_SUBSCRIPTION,
} from "../util/graphql";

function Home() {
  const { user } = useContext(AuthContext);
  const {
    loading: isLoadingGetPosts,
    // data: { getPosts: posts }
    data,
  } = useQuery(FETCH_POSTS_QUERY);

  const { data: dataTotalLikes, error: errorTotalLikes } = useSubscription(
    TOTAL_LIKE_SUBSCRIPTION
  );
  //useQuery(
  // FETCH_TOTAL_LIKES_QUERY
  // );

  console.log({ dataTotalLikes, errorTotalLikes });

  const posts = data?.getPosts || [];
  const totalLikes = dataTotalLikes?.totalLikeListener?.totalLikes || 0;
  //.getTotalLikes?.totalLikes || 0;

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
        <h1>total likes:{totalLikes}</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {isLoadingGetPosts ? (
          <h1>Loading posts..</h1>
        ) : (
          <Transition.Group>
            {posts &&
              posts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
