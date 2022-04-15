import useGenericFeature from "lib/components/feature/useGenericFeature";
import { feature } from "lib/logic/model/Feature";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "routes/main";
import PetEdit from "routes/pet/pet-edit";
import Welcome from "routes/welcome";
import "./App.css";


function App() {
  document.title = "Featurized Pet Shop";

  const readRoute = useGenericFeature({
    on: [
      {
        expression: feature("pet-read"),
        on: <Route path="pet/:petId" element={<PetEdit />} />,
      },
    ]
  });

  const addRoute = useGenericFeature({
    on: [
      {
        expression: feature("pet-add"),
        on: <Route path="pet" element={<PetEdit />} />,
      },
    ]
  });
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route path="/" element={<Welcome />} />
            {addRoute}
            {readRoute}
            <Route path="*" element={<p>There's nothing here!</p>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
