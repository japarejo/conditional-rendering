import React, { lazy } from "react";
import "./App.css";
import { Feature, Loading, Off, On } from "./components/Feature";
import LazyComponent from "./components/LazyComponent";
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
            <LazyComponent
              Component={Feature1}
              loading={<Loading>Loading Feature 1...</Loading>}
            />
          </On>
          <Off>
            <p>You don't have permissions for Feature 1 </p>
          </Off>
          {/* <Loading><p>LOADING</p></Loading> */}
        </Feature>
        <Feature id={feature2}>
          <On>
            {/* We need to specify the path RELATIVE to where LazyComponent is declared */}
            <LazyComponent
              Component={Feature2}
              loading={<Loading>Loading Feature 2...</Loading>}
            />
          </On>
          <Off>
            <p>You don't have permissions for Feature 2 </p>
          </Off>
          {/* <Loading><p>LOADING</p></Loading> */}
        </Feature>
      </main>
    </div>
  );
}

export default App;
