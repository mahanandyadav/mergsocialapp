import React from "react";
import App from "./App";
// import { WebSocketLink } from "@apollo/client/link/ws";
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
// import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";
import { HttpLink, split } from "@apollo/client/core";
import { getMainDefinition } from "@apollo/client/utilities";

// const httpLink = createHttpLink({
//   uri: "http://localhost:5000",
// });
const httpLink = new HttpLink({
  uri: 'http://localhost:5000',
});

// WebSocket link for subscriptions
// const wsLink = new WebSocketLink({
//   uri: "ws://localhost:5000/graphql",
//   options: {
//     reconnect: true,
//   },
// });
const wsLink = new GraphQLWsLink(createClient({
// const wsLink = new GraphQLWsLink(SubscriptionClient({
  url: 'ws://localhost:5000/graphql',
}));

// Split links based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
  // authLink.concat(httpLink)
);

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  // link: authLink.concat(httpLink),
  link:authLink.concat(splitLink),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
