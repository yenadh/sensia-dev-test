import { useState, useEffect } from "react";
import { Text, Button } from "@chakra-ui/react";
import Navbar from "@/components/ui/customComponents/Navbar";
import CreateComment from "@/components/ui/customComponents/CreateComment";
import EditComment from "@/components/ui/customComponents/EditComment";
import CommentList from "@/components/ui/customComponents/CommentList";
import CustomDialog from "@/components/ui/customComponents/CustomDialog";
import {
  getUserAccessByPage,
  getCommentByPage,
  deleteComment,
} from "@/endpoints/api";
import PermissionCards from "@/components/ui/customComponents/PermissionCards";

export default function Products({ pageId, pageName }) {
  const [permissions, setPermissions] = useState({
    can_create: false,
    can_edit: false,
    can_delete: false,
    can_comment: false,
  });
  const [comments, setComments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accessRes, commentsRes] = await Promise.all([
          getUserAccessByPage(pageId),
          getCommentByPage(pageId),
        ]);

        const userPermissions = accessRes.is_staff
          ? {
              can_create: true,
              can_edit: true,
              can_delete: true,
              can_comment: true,
            }
          : accessRes?.data || {
              can_create: false,
              can_edit: false,
              can_delete: false,
              can_comment: false,
            };

        setPermissions(userPermissions);
        setComments(commentsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (comment) => {
    setSelectedComment(comment);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id) => {
    setSelectedCommentId(id);
    setIsConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteComment(selectedCommentId);
      setSelectedCommentId(null);
      // Re-fetch comments after deletion
      const updatedComments = await getCommentByPage(pageId);
      setComments(updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsConfirmationOpen(false);
    }
  };

  return (
    <Navbar>
      <Text fontSize="xl" fontWeight="bold">
        {pageName}
      </Text>

      <PermissionCards permissions={permissions} />

      {permissions.can_create && (
        <Button
          mt={6}
          onClick={() => setIsDialogOpen(true)}
          colorPalette="orange"
        >
          Create Comment
        </Button>
      )}

      <CommentList
        editable={permissions.can_edit}
        deletable={permissions.can_delete}
        data={comments}
        editAction={handleEdit}
        deleteAction={handleDelete}
      />

      {/* Dialog Components */}
      <CreateComment
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        pageId={pageId}
      />
      <EditComment
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        pageId={pageId}
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
      />
      <CustomDialog
        isOpen={isConfirmationOpen}
        setIsOpen={setIsConfirmationOpen}
        onConfirm={confirmDelete}
        confirmLabel="Delete"
      />
    </Navbar>
  );
}
