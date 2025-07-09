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

  // Protected pages with pageId mapping
  const protectedPages = [
    {
      path: "/pages/products-list",
      component: Products,
      pageId: 1,
      name: "Products",
    },
    {
      path: "/pages/marketing-list",
      component: Marketing,
      pageId: 2,
      name: "Marketing",
    },
    { path: "/pages/order-list", component: Order, pageId: 3, name: "Order" },
    {
      path: "/pages/media-plans",
      component: Media,
      pageId: 4,
      name: "Media Plans",
    },
    {
      path: "/pages/offer-pricing-skus",
      component: OfferPricing,
      pageId: 5,
      name: "Offer Pricing SKUs",
    },
    { path: "/pages/clients", component: Clients, pageId: 6, name: "Clients" },
    {
      path: "/pages/suppliers",
      component: Suppliers,
      pageId: 7,
      name: "Suppliers",
    },
    {
      path: "/pages/customer-support",
      component: CustomerSupport,
      pageId: 8,
      name: "Customer Support",
    },
    {
      path: "/pages/sales-reports",
      component: SalesReports,
      pageId: 9,
      name: "Sales Reports",
    },
    {
      path: "/pages/finance-accounting",
      component: FinanceAndAccounting,
      pageId: 10,
      name: "Finance & Accounting",
    },
  ];

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyEmail />} />

          {/* Protected Dashboard Route */}
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

          {/* Protected Pages (Mapped) */}
          {protectedPages.map(
            ({ path, component: Component, pageId, name }) => (
              <Route
                key={path}
                path={path}
                element={
                  <PrivateRoute pageId={pageId} pageName={name}>
                    <Component pageId={pageId} pageName={name} />
                  </PrivateRoute>
                }
              />
            )
          )}

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
