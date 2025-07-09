import { Button, Dialog, Portal, Textarea, Field } from "@chakra-ui/react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createComment } from "@/endpoints/api";

const schema = yup.object().shape({
  comment: yup.string().required("Comment is required"),
});

export default function CreateComment({
  title = "Create Comment",
  isOpen = false,
  setIsOpen,
  pageId,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitHandler = async (data) => {
    try {
      const res = await createComment(pageId, data.comment);
      console.log(res);
      reset();
      setIsOpen(false);
      location.reload();
    } catch (err) {
      console.error(err);
    }
  };

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
              <form onSubmit={handleSubmit(submitHandler)}>
                <Field.Root invalid={!!errors.comment}>
                  <Field.Label>Comment</Field.Label>
                  <Textarea
                    placeholder="Add comment here"
                    {...register("comment")}
                    autoComplete="off"
                    colorPalette="orange"
                  />
                  <Field.ErrorText>{errors.comment?.message}</Field.ErrorText>
                </Field.Root>
                <Dialog.Footer mt={4}>
                  <Dialog.ActionTrigger asChild>
                    <Button
                      variant="outline"
                      rounded="lg"
                      onClick={() => {
                        reset();
                        setIsOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button type="submit" colorPalette="orange" rounded="lg">
                    Create
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
