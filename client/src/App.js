import React from "react";
import { Container } from "react-bootstrap";

import ApolloProvider from "./ApolloProvider";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import "./App.scss";
import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <BrowserRouter>
          <Container className="pt-5">
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/" exact component={Home} />
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
