import Navbar from "@/components/ui/customComponents/Navbar";
import { Box, SimpleGrid, Text, Icon } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getUserAccess } from "@/endpoints/api";
import { PlusCircle, Edit, Trash2, MessageCircle } from "lucide-react";

export default function CustomerSupport() {
  const pageId = 8;
  const userId = localStorage.getItem("userID");
  const [permissions, setPermissions] = useState({
    can_create: false,
    can_edit: false,
    can_delete: false,
    can_comment: false,
  });

  useEffect(() => {
    const fetchUserAccess = async () => {
      if (pageId) {
        try {
          const userAccess = await getUserAccess(userId, pageId);
          if (userAccess?.data) {
            setPermissions({
              can_create: userAccess.data.can_create,
              can_edit: userAccess.data.can_edit,
              can_delete: userAccess.data.can_delete,
              can_comment: userAccess.data.can_comment,
            });
          } else {
            setPermissions({
              can_create: false,
              can_edit: false,
              can_delete: false,
              can_comment: false,
            });
          }
        } catch (error) {
          console.log("Error fetching user access:", error);
        }
      } else {
        setPermissions({
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_comment: false,
        });
      }
    };

    fetchUserAccess();
  }, []);

  const permissionCards = [
    {
      label: "Create",
      icon: PlusCircle,
      allowed: permissions.can_create,
    },
    {
      label: "Edit",
      icon: Edit,
      allowed: permissions.can_edit,
    },
    {
      label: "Delete",
      icon: Trash2,
      allowed: permissions.can_delete,
    },
    {
      label: "Comment",
      icon: MessageCircle,
      allowed: permissions.can_comment,
    },
  ];

  return (
    <Navbar>
      <Text fontSize="xl" fontWeight="bold">
        Customer Support Page
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mt={8}>
        {permissionCards.map((perm) => (
          <Box
            key={perm.label}
            p={4}
            borderRadius="md"
            boxShadow="md"
            bg={perm.allowed ? "green.100" : "red.100"}
            textAlign="center"
          >
            <Icon
              as={perm.icon}
              boxSize={8}
              color={perm.allowed ? "green.500" : "red.500"}
            />
            <Text mt={2} fontWeight="bold">
              {perm.label}
            </Text>
            <Text fontSize="sm">
              {perm.allowed ? "Allowed" : "Not Allowed"}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Navbar>
  );
}
