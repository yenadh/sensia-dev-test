import { Box, SimpleGrid, Text, Icon } from "@chakra-ui/react";
import { PlusCircle, Edit, Trash2, MessageCircle } from "lucide-react";

export default function PermissionCards({ permissions }) {
  const cards = [
    { label: "View", icon: "MessageCircle", allowed: permissions.can_comment },
    { label: "Create", icon: "PlusCircle", allowed: permissions.can_create },
    { label: "Edit", icon: "Edit", allowed: permissions.can_edit },
    { label: "Delete", icon: "Trash2", allowed: permissions.can_delete },
  ];

  const icons = {
    MessageCircle: MessageCircle,
    PlusCircle: PlusCircle,
    Edit: Edit,
    Trash2: Trash2,
  };

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mt={8}>
      {cards.map(({ label, icon, allowed }) => (
        <Box
          key={label}
          p={4}
          borderRadius="md"
          boxShadow="md"
          bg={allowed ? "green.100" : "red.100"}
          textAlign="center"
        >
          <Icon
            as={icons[icon]}
            boxSize={8}
            color={allowed ? "green.500" : "red.500"}
          />
          <Text mt={2} fontWeight="bold">
            {label}
          </Text>
          <Text fontSize="sm">{allowed ? "Allowed" : "Not Allowed"}</Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}
