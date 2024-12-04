import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import AllFormsPage from "./pages/all_forms_page/AllFormsPage";
import CreateFormPage from "./pages/CreateFormPage";
import ViewFormPage from "./pages/ViewFormPage";
import EditFormPage from "./pages/edit_form_page/EditFormPage";
import LandingPage from "./pages/landing_page/LandingPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<Layout />}>
          <Route path="/forms" element={<AllFormsPage />} />
          <Route path="/forms/:id" element={<ViewFormPage />} />
          <Route path="/forms/create" element={<CreateFormPage />} />
          <Route path="/forms/:id/edit" element={<EditFormPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
