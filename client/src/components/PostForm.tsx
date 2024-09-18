import React from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
  const {
    values: postBody,
    onChange,
    onSubmit,
  } = useForm(createPostCallback, {
    body: "",
  });

  // const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
  //   variables: values,
  //   update(proxy, result) {
  //     const data = proxy.readQuery({
  //       query: FETCH_POSTS_QUERY,
  //     });
  //     data.getPosts = [result.data.createPost, ...data.getPosts];
  //     proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
  //     values.body = "";
  //   },
  // });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: { postBody },
    update(proxy, result) {
      console.log("post created with->", postBody);

      const oldPosts = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });

      oldPosts.getPosts = [result.data.createPost, ...oldPosts.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: oldPosts }); // update cache

      postBody.body = "";
    },
  });

  function createPostCallback() {
    console.log({ postBody });
    createPost();
  }

  const onFileChange = (event) => {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const dataURLimg = reader.result as string;
      const filename = file.name;
      const id = `${filename}-${Date.now()}`;
      console.log({ dataURLimg });
      onChange({
        target: {
          name: "file",
          value: {
            id,
            data: dataURLimg,
            filename,
          },
        },
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        {/* show image preview here */}
        preview
        <img src={postBody?.file?.data} alt="" style={{ width: 100 }} />
        <Form.Field>
          <Form.Input
            placeholder="Hi World!"
            // name="body"
            name="inputString"
            onChange={onChange}
            value={postBody.inputString}
            error={error ? true : false}
          />
          <Form.Input
            type="file"
            name="file"
            onChange={onFileChange}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

// mutation createPost($body: String!) {
//   createPost(body: $body) {
// mutation createPost($inputString: String!, $file: object!) {
const CREATE_POST_MUTATION = gql`
  mutation createPost($postBody: PostInput) {
    createPost(postBody: $postBody) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
