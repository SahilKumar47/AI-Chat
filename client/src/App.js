import React, { useEffect } from "react";
import { Container } from "react-bootstrap";

import ApolloProvider from "./ApolloProvider";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import "./App.scss";
import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home/home";
import { AuthProvider } from "./context/authContext";
import { MessageProvider } from "./context/messageContext";
import DynamicRoute from "./utils/customRoute";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <Container className="pt-5">
              <Switch>
                <DynamicRoute path="/register" component={Register} guest />
                <DynamicRoute path="/login" component={Login} guest />
                <DynamicRoute path="/" exact component={Home} authenticated />
              </Switch>
            </Container>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
