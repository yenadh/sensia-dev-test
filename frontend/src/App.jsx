import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/useAuth";
import useAutoLogout from "./hooks/useAutoLogout";

// Pages
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";
import ListUser from "./pages/ListUser";
import Products from "./pages/Products";
import Marketing from "./pages/Marketing";
import Order from "./pages/Order";
import Media from "./pages/Media";
import OfferPricing from "./pages/OfferPricing";
import Clients from "./pages/Clients";
import Suppliers from "./pages/Suppliers";
import CustomerSupport from "./pages/CustomerSupport";
import SalesReports from "./pages/SalesReports";
import FinanceAndAccounting from "./pages/FinanceAccounting";
import NotFound from "./pages/NotFound";

// Components
import PrivateRoute from "./components/Private_route";

function App() {
  useAutoLogout();

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyEmail />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute pageId={0}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* User Management (Admin Only) */}
          <Route
            path="/user/create"
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/update/:id"
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/list"
            element={
              <PrivateRoute>
                <ListUser />
              </PrivateRoute>
            }
          />

          {/* Pages with Specific Permissions */}
          <Route
            path="/pages/products-list"
            element={
              <PrivateRoute pageId={1}>
                <Products />
              </PrivateRoute>
            }
          />
          <Route
            path="/pages/marketing-list"
            element={
              <PrivateRoute pageId={2}>
                <Marketing />
              </PrivateRoute>
            }
          />
          <Route
            path="/pages/order-list"
            element={
              <PrivateRoute pageId={3}>
                <Order />
              </PrivateRoute>
            }
          />
          <Route
            path="/pages/media-plans"
            element={
              <PrivateRoute pageId={4}>
                <Media />
              </PrivateRoute>
            }
          />
          <Route
            path="/pages/offer-pricing-skus"
            element={
              <PrivateRoute pageId={5}>
                <OfferPricing />
              </PrivateRoute>
            }
          />
          <Route
            path="/pages/clients"
            element={
              <PrivateRoute pageId={6}>
                <Clients />
              </PrivateRoute>
            }
          />
          <Route
            path="/pages/suppliers"
            element={
              <PrivateRoute pageId={7}>
                <Suppliers />
              </PrivateRoute>
            }
          />
          <Route
            path="/pages/customer-support"
            element={
              <PrivateRoute pageId={8}>
                <CustomerSupport />
              </PrivateRoute>
            }
          />
          <Route
            path="/pages/sales-reports"
            element={
              <PrivateRoute pageId={9}>
                <SalesReports />
              </PrivateRoute>
            }
          />
          <Route
            path="/pages/finance-accounting"
            element={
              <PrivateRoute pageId={10}>
                <FinanceAndAccounting />
              </PrivateRoute>
            }
          />

          {/* 404 Route (Always Last) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
