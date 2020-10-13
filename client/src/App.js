import React from "react";
import { Container } from "react-bootstrap";

import ApolloProvider from "./ApolloProvider";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import "./App.scss";
import Register from "./pages/register";

function App() {
  return (
    <ApolloProvider>
      <BrowserRouter>
        <Container className="pt-5">
          <Route path="/register" component={Register} />
        </Container>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
