import {
  Flex,
  Text,
  IconButton,
  HStack,
  Popover,
  Portal,
  Link,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import CustomButton from "./CustomButton";
import { LuUser } from "react-icons/lu";
import { logout } from "@/endpoints/api";

export default function Header({ isOpen, setIsOpen }) {
  const nav = useNavigate();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      nav("/login");
    }
  };

  return (
    <Flex
      as="header"
      width="100%"
      px={6}
      py={4}
      bg="white"
      align="center"
      justify="space-between"
      shadow="md"
      position="sticky"
      top="0"
      zIndex="999"
    >
      <IconButton
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        icon={isOpen ? <X /> : <Menu />}
        size="sm"
        display={{ base: "flex", md: "none" }}
        onClick={() => setIsOpen(!isOpen)}
      />

      <Text
        fontSize="xl"
        fontWeight="bold"
        color="#d97706"
        cursor="pointer"
        onClick={() => navigate("/")}
      >
        SVG - dev
      </Text>

      <HStack gap="4">
        <IconButton aria-label="Call support" rounded="full">
          <LuUser />
        </IconButton>
        <Button colorPalette="red" onClick={handleLogout}>
          Logout
        </Button>
      </HStack>
    </Flex>
  );
}
