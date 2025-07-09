import { useAuth } from "@/contexts/useAuth";
import { Navigate } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";

const ProtectedRoute = ({ children, pageId }) => {
  const { user, loading, permissions, isAdmin } = useAuth();

  if (loading) {
    return <Spinner color="red.500" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin || permissions.includes(pageId) || pageId === 0) {
    return children;
  } else {
    return <Navigate to="/" replace />; // or show a 403 page
  }
};

export default ProtectedRoute;
