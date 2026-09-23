import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CataloguePage from "./pages/CataloguePage";
import NotFoundPage from "./templates/template-1/pages/NotFoundPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEdit from "./pages/admin/AdminEdit";
import LiveInvitationPage from "./pages/LiveInvitationPage";
import DemoInvitationPage from "./pages/DemoInvitationPage";
import { getAdminPassword } from "./lib/adminApi";

function RequireAdmin({ children }) {
  if (!getAdminPassword()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CataloguePage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
        {/* Developer — pantau & bantu edit */}
        <Route
          path="/admin/:slug"
          element={
            <RequireAdmin>
              <AdminEdit />
            </RequireAdmin>
          }
        />

        {/* Customer — kode manage (WA) — UI sama AdminEdit */}
        <Route path="/kelola/:customerSlug" element={<AdminEdit />} />

        <Route
          path="/live/:customerSlug/:guestToken"
          element={<LiveInvitationPage />}
        />
        <Route path="/live/:customerSlug" element={<LiveInvitationPage />} />

        <Route
          path="/demo/template-1/:coupleSlug/:guestSlug"
          element={<DemoInvitationPage />}
        />
        <Route
          path="/demo/template-1/:coupleSlug"
          element={<DemoInvitationPage />}
        />
        <Route
          path="/:coupleSlug/:guestSlug"
          element={<DemoInvitationPage />}
        />
        <Route path="/:coupleSlug" element={<DemoInvitationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
