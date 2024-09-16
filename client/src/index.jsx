import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import ApolloProvider from "./ApolloProvider";
import React from "react";

ReactDOM.render(ApolloProvider, document.getElementById('root'));
// const domNode = document.getElementById("root");
// if (domNode) {
//   const root = React.createRoot(domNode);
//   root.render(
//     <ApolloProvider client={client}>
//       <App />
//     </ApolloProvider>
//   );
// }
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
