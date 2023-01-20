import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Event from "./pages/Event";
import { AuthUserProvider } from "./contexts/AuthContext";
import EventDashBoard from "./pages/EventDashBoard";
import PageNotFound from "./pages/PageNotFound";
import AdminUpdate from "./pages/AdminUpdate";
import AdminData from "./pages/AdminData";
import AdminSetup from "./pages/AdminSetup";
import AdminLog from "./pages/AdminLog";
import AdminHub from "./pages/AdminHub";
import AdminExtra from "./pages/AdminExtra";
import AdminClear from "./pages/AdminClear";

function App() {
  return (
    <AuthUserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/event" element={<Event />} />
          <Route path="/admin" element={<AdminHub/>}/>
          <Route path="/eventdashboard" element={<EventDashBoard />} />
          <Route path="/adminsetup" element={<AdminSetup />} />
          <Route path="/admindata" element={<AdminData />} />
          <Route path="/adminupdate" element={<AdminUpdate />} />
          <Route path="/adminlog" element={<AdminLog />} />
          <Route path="/adminextra" element={<AdminExtra/>} />
          <Route path="/adminclear" element={<AdminClear/>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthUserProvider>
  );
}

export default App;
