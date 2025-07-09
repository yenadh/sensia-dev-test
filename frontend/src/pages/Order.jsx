import Navbar from "@/components/ui/customComponents/Navbar";
import { Box, SimpleGrid, Text, Icon, Flex, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  deleteComment,
  getCommentByPage,
  getUserAccess,
} from "@/endpoints/api";
import { PlusCircle, Edit, Trash2, MessageCircle } from "lucide-react";
import CreateComment from "@/components/ui/customComponents/CreateComment";
import CommentList from "@/components/ui/customComponents/CommentList";
import EditComment from "@/components/ui/customComponents/EditComment";
import CustomDialog from "@/components/ui/customComponents/CustomDialog";

export default function Order() {
  const pageId = 3;
  const userId = localStorage.getItem("userID");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditIsDialogOpen] = useState(false);
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [selectedComment, setSelectedComment] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [comments, setComments] = useState([]);
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

    const fetchComments = async () => {
      if (pageId) {
        try {
          const res = await getCommentByPage(pageId);
          setComments(res);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchComments();
    fetchUserAccess();
  }, []);

  const handleEditAction = (comment) => {
    setSelectedComment(comment);
    setEditIsDialogOpen(true);
  };

  const handleDeleteAction = (id) => {
    setSelectedCommentId(id);
    setIsConfirmation(true);
  };

  const confirmDelete = async () => {
    await deleteComment(selectedCommentId);
    setSelectedCommentId(null);
    window.location.reload();
  };

  const permissionCards = [
    {
      label: "View",
      icon: MessageCircle,
      allowed: permissions.can_comment,
    },
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
  ];

  return (
    <Navbar>
      <CreateComment
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        pageId={pageId}
      />
      <EditComment
        isOpen={isEditDialogOpen}
        setIsOpen={setEditIsDialogOpen}
        pageId={pageId}
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
      />
      <CustomDialog
        isOpen={isConfirmation}
        setIsOpen={setIsConfirmation}
        onConfirm={confirmDelete}
        confirmLabel="Delete"
      />
      <Text fontSize="xl" fontWeight="bold">
        Order Page
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
      {permissions.can_create ? (
        <Button
          mt="30px"
          type="button"
          onClick={() => setIsDialogOpen(true)}
          colorPalette="orange"
        >
          Create Comment
        </Button>
      ) : (
        ""
      )}
      <CommentList
        editable={permissions.can_edit}
        deletable={permissions.can_delete}
        data={comments}
        editAction={handleEditAction}
        deleteAction={handleDeleteAction}
      />
    </Navbar>
  );
}
