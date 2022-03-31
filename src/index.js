import React from "react";
import * as ReactDOMClient from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
const container = document.getElementById("root");

const root = ReactDOMClient.createRoot(container);

root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
