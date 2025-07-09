// src/components/ui/customComponents/CustomDialog.jsx
import {
  Button,
  CloseButton,
  Dialog,
  HStack,
  Portal,
  Text,
} from "@chakra-ui/react";

export default function CustomDialog({
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isOpen = false,
  setIsOpen,
}) {
  return (
    <Dialog.Root
      placement="center"
      motionPreset="slide-in-bottom"
      open={isOpen}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>{message}</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  rounded="lg"
                  onClick={() => setIsOpen(false)}
                >
                  {cancelLabel}
                </Button>
              </Dialog.ActionTrigger>
              <Button
                rounded="lg"
                bg={confirmLabel === "Delete" ? "red" : "orange"}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
