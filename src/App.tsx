import { Feature, On } from "lib/components/feature/Feature";
import useFeature from "lib/components/feature/useFeature";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "routes/main";
import PetEdit from "routes/pet/pet-edit";
import Welcome from "routes/welcome";
import "./App.css";

function App() {
  document.title = "Feature tests";
  const canRead = useFeature("pet-read");
  const canAdd = useFeature("pet-add");

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route path="/" element={<Welcome />} />
            {canAdd && <Route path="pet" element={<PetEdit />} />}
            {canRead && <Route path="pet/:petId" element={<PetEdit />} />}
            <Route path="*" element={<p>There's nothing here!</p>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
