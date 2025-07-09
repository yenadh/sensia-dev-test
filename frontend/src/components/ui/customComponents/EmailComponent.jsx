import { Button, Dialog, Portal } from "@chakra-ui/react";
import CustomInput from "./CustomInput";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { sendOTP } from "@/endpoints/api";

export default function EmailComponent({ isOpen, setIsOpen }) {
  const [isLoading, setIsLoading] = useState(false);

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await sendOTP(data.email);
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      setError("email", {
        type: "manual",
        message:
          error.response?.data?.detail ||
          "Failed to send OTP. Please check the email.",
      });
    } finally {
      setIsLoading(false);
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
              <Dialog.Title>Send OTP</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <CustomInput
                  label="Email"
                  placeholder="Email"
                  type="email"
                  name="email"
                  register={register}
                  error={errors.email}
                />
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button
                      variant="outline"
                      colorPalette="orange"
                      rounded="lg"
                      onClick={() => setIsOpen(false)}
                      isDisabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button
                    rounded="lg"
                    colorPalette="orange"
                    type="submit"
                    loading={isLoading}
                    loadingText="Sending..."
                  >
                    Send
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
