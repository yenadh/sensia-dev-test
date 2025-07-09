import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Portal,
  NativeSelect,
  Text,
  Flex,
  Alert,
  Spinner,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { getUserAccess, assignUserAccess } from "@/endpoints/api";

const schema = Yup.object().shape({
  selectedPage: Yup.string().required("Please select a page."),
});

export default function UserAccess({
  pages,
  user,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isOpen = false,
  setIsOpen,
}) {
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [permissions, setPermissions] = useState({
    can_create: false,
    can_edit: false,
    can_delete: false,
    can_comment: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      selectedPage: "",
    },
  });

  const selectedPage = watch("selectedPage");

  useEffect(() => {
    const fetchUserAccess = async () => {
      if (selectedPage) {
        try {
          const userAccess = await getUserAccess(user, selectedPage);
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
  }, [selectedPage, user]);

  const onSubmit = async () => {
    setLoading(true);
    try {
      const response = await assignUserAccess(user, selectedPage, permissions);
      setShowSuccessAlert(true);
      if (!showSuccessAlert) {
        setTimeout(() => setShowSuccessAlert(false), 2000);
      }
      onConfirm(permissions);
    } catch (error) {
      console.error("Error assigning permissions:", error);
      alert("Failed to assign permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root
      size="lg"
      placement="center"
      motionPreset="slide-in-bottom"
      open={isOpen}
    >
      {showSuccessAlert ? (
        <Alert.Root status="success" variant="solid">
          <Alert.Indicator />
          <Alert.Title>Access granted successfully</Alert.Title>
        </Alert.Root>
      ) : (
        ""
      )}

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Manage Access</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={handleSubmit(onSubmit)}>
                <NativeSelect.Root size="sm" width="240px">
                  <NativeSelect.Field {...register("selectedPage")}>
                    <option value="">Select option</option>
                    {pages.map((page) => (
                      <option value={page.id} key={page.id}>
                        {page.name}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
                {errors.selectedPage && (
                  <Text color="red" fontSize="sm" mt="1">
                    {errors.selectedPage.message}
                  </Text>
                )}

                {selectedPage && (
                  <Flex direction="column" mt="20px" gap="10px" pl="20px">
                    <label>
                      <input
                        type="checkbox"
                        checked={permissions.can_create}
                        onChange={(e) =>
                          setPermissions((prev) => ({
                            ...prev,
                            can_create: e.target.checked,
                          }))
                        }
                      />{" "}
                      Can Create
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={permissions.can_edit}
                        onChange={(e) =>
                          setPermissions((prev) => ({
                            ...prev,
                            can_edit: e.target.checked,
                          }))
                        }
                      />{" "}
                      Can Edit
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={permissions.can_delete}
                        onChange={(e) =>
                          setPermissions((prev) => ({
                            ...prev,
                            can_delete: e.target.checked,
                          }))
                        }
                      />{" "}
                      Can Delete
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={permissions.can_comment}
                        onChange={(e) =>
                          setPermissions((prev) => ({
                            ...prev,
                            can_comment: e.target.checked,
                          }))
                        }
                      />{" "}
                      Can Comment
                    </label>
                  </Flex>
                )}

                <Dialog.Footer mt="6">
                  <Dialog.ActionTrigger asChild>
                    <Button
                      variant="outline"
                      rounded="lg"
                      type="button"
                      onClick={() => setIsOpen(false)}
                    >
                      {cancelLabel}
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button
                    w="100px"
                    isLoading={loading}
                    loadingText="Saving..."
                    type="submit"
                    rounded="lg"
                    bg={confirmLabel === "Delete" ? "red" : "orange"}
                  >
                    {confirmLabel}
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
