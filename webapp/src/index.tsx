import { ChakraProvider } from "@chakra-ui/react";
import { FeatureContext } from "lib/components/feature/FeatureContext";
import FeatureRetriever from "lib/components/feature/FeatureRetriever";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <FeatureContext.Provider
      value={{
        // featureRetrievers: {
        //   ...makeFeatureAttributeRetrievers(new FeatureRetriever()),
        // },
        featureRetriever: new FeatureRetriever(),
      }}
    >
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </FeatureContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
