import React from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Flex,
  VStack,
  useBreakpointValue,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Header from "./Header";
import {
  Users,
  MenuIcon,
  Boxes,
  Presentation,
  ListOrderedIcon,
  MessageCircleIcon,
  Coins,
  UserCog2,
  Container,
  UserMinus2,
  MonitorCog,
  Calculator,
} from "lucide-react";
import { useAuth } from "@/contexts/useAuth.jsx"; // ✅ Use context instead of API

const Links = [
  { id: 0, name: "Dashboard", icon: MenuIcon, link: "/" },
  { id: 11, name: "User", icon: Users, link: "/user/list" },
  { id: 1, name: "Products List", icon: Boxes, link: "/pages/products-list" },
  {
    id: 2,
    name: "Marketing List",
    icon: Presentation,
    link: "/pages/marketing-list",
  },
  {
    id: 3,
    name: "Order List",
    icon: ListOrderedIcon,
    link: "/pages/order-list",
  },
  {
    id: 4,
    name: "Media Plans",
    icon: MessageCircleIcon,
    link: "/pages/media-plans",
  },
  {
    id: 5,
    name: "Offer Pricing SKUs",
    icon: Coins,
    link: "/pages/offer-pricing-skus",
  },
  { id: 6, name: "Clients", icon: UserCog2, link: "/pages/clients" },
  { id: 7, name: "Suppliers", icon: Container, link: "/pages/suppliers" },
  {
    id: 8,
    name: "Customer Support",
    icon: UserMinus2,
    link: "/pages/customer-support",
  },
  {
    id: 9,
    name: "Sales Reports",
    icon: MonitorCog,
    link: "/pages/sales-reports",
  },
  {
    id: 10,
    name: "Finance & Accounting",
    icon: Calculator,
    link: "/pages/finance-accounting",
  },
];

const NavLink = ({ icon: Icon, children, to, isActive }) => (
  <Box
    as={RouterLink}
    to={to}
    py={2}
    px={4}
    borderRadius="md"
    bg={isActive ? "orange.400" : "transparent"}
    _hover={{ bg: "orange.300" }}
    w="full"
    textAlign="left"
  >
    <HStack spacing={3}>
      <Icon size={18} />
      <Text>{children}</Text>
    </HStack>
  </Box>
);

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const location = useLocation();

  const { isAdmin, permissions } = useAuth(); // ✅ Now we use context

  useEffect(() => {
    if (isDesktop) {
      setIsOpen(true);
    }
  }, [isDesktop]);

  const linksToShow =
    isAdmin === true
      ? Links
      : Links.filter((link) => permissions.includes(link.id) || link.id === 0);

  return (
    <Flex direction="column" height="100vh">
      <Header setIsOpen={setIsOpen} isOpen={isOpen} />

      <Flex flex="1" overflow="hidden">
        {/* Sidebar */}
        <Box
          as="nav"
          bg="#d97706"
          color="white"
          w={{
            base: isOpen ? "200px" : "0",
            md: "250px",
          }}
          transition="width 0.3s ease"
          overflow="hidden"
        >
          <VStack
            spacing={2}
            align="stretch"
            mt={4}
            px={2}
            overflowY="auto"
            height="full"
          >
            {linksToShow.map((link) => (
              <NavLink
                key={link.id}
                icon={link.icon}
                to={link.link}
                isActive={location.pathname === link.link}
              >
                {link.name}
              </NavLink>
            ))}
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex="1" p={4} bg="gray.100" overflowY="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
