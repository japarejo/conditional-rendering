import React, { lazy } from "react";
import "./App.css";
import { Feature, Loading, Off, On } from "./components/Feature";
import { feature1, feature2 } from "./state";

const Feature1 = lazy(() => import("./components/feature/Feature1"));
const Feature2 = lazy(() => import("./components/feature/Feature2"));


function App() {
  document.title = "Feature tests";

  return (
    <div className="App">
      <header>
        <h1>Test App Features</h1>
      </header>
      <main>
        <Feature id={feature1}>
          <On>
            <Feature1 />
          </On>
          <Off>
            <p>You don't have permissions for Feature 1 </p>
          </Off>
          <Loading><p>Loading feature 1...</p></Loading>
        </Feature>
        <Feature id={feature2}>
          <On>
            <Feature2 />
          </On>
          <Off>
            <p>You don't have permissions for Feature 2 </p>
          </Off>
          <Loading><p>Loading feature 2...</p></Loading>
        </Feature>
      </main>
    </div>
  );
}

export default App;
