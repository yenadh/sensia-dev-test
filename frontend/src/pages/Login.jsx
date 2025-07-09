import { Box, VStack, Flex, Link, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import CustomInput from "@/components/ui/customComponents/CustomInput";
import CustomButton from "@/components/ui/customComponents/CustomButton";
import { useState } from "react";
import { login } from "@/endpoints/api";
import { useNavigate } from "react-router-dom";
import EmailComponent from "@/components/ui/customComponents/EmailComponent";

const schema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailComponentOpen, setEmailComponentOpen] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await login(data.username, data.password);
      if (res.success) {
        navigate("/");
        localStorage.setItem("userID", res.user.id);
      } else {
        setError("username", {
          type: "manual",
          message: "Invalid username or password",
        });
        setError("password", {
          type: "manual",
          message: "Invalid username or password",
        });
      }
    } catch (error) {
      console.error(error);
      setError("username", {
        type: "manual",
        message: "Invalid username or password",
      });
      setError("password", {
        type: "manual",
        message: "Invalid username or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={4}>
      <EmailComponent
        isOpen={emailComponentOpen}
        setIsOpen={setEmailComponentOpen}
      />
      <Box
        background="white"
        shadow="md"
        borderRadius="lg"
        p={8}
        width={{ base: "90%", sm: "80%", md: "400px" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <VStack spacing={4}>
            <CustomInput
              label="Username"
              placeholder="Username"
              name="username"
              register={register}
              error={errors.username}
            />
            <CustomInput
              label="Password"
              placeholder="Password"
              type="password"
              name="password"
              register={register}
              error={errors.password}
              autoComplete="new-password"
            />
            <CustomButton isLoading={isLoading} type="submit">
              Login
            </CustomButton>
            <Text fontSize="sm">
              If you{" "}
              <Link
                variant="underline"
                colorPalette="orange"
                onClick={() => setEmailComponentOpen(true)}
              >
                forgot your password
              </Link>{" "}
              visit here
            </Text>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}
