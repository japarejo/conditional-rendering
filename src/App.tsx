import useFeature from "lib/components/feature/useFeature";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "routes/main";
import PetEdit from "routes/pet/pet-edit";
import Welcome from "routes/welcome";
import "./App.css";


function App() {
  document.title = "Featurized Pet Shop";
  const readRoute = useFeature({
    id: "pet-read",
    on: <Route path="pet/:petId" element={<PetEdit />} />
  });
  const addRoute = useFeature({
    id: "pet-add",
    on: <Route path="pet" element={<PetEdit />} />
  });
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route path="/" element={<Welcome />} />
            {addRoute.feature}
            {readRoute.feature}
            <Route path="*" element={<p>There's nothing here!</p>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
