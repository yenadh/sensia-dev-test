import { useState, useEffect } from "react";
import { Box, Flex, AbsoluteCenter } from "@chakra-ui/react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomInput from "@/components/ui/customComponents/CustomInput";
import CustomButton from "@/components/ui/customComponents/CustomButton";
import Navbar from "@/components/ui/customComponents/Navbar";
import { createUser, getUserById, updateUser } from "@/endpoints/api";
import { useNavigate, useParams } from "react-router-dom";

export default function User() {
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [defaultValues, setDefaultValues] = useState([]);
  const nav = useNavigate();
  const params = useParams();

  const isUpdate = location.pathname.startsWith("/user/update");
  const userId = params.id;

  const schema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isUpdate && userId) {
      const fetchUser = async () => {
        try {
          const user = await getUserById(userId);
          setDefaultValues(user);
          reset(user[0]);
        } catch (err) {
          console.error(err);
        }
      };
      fetchUser();
    }
  }, [isUpdate, userId, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isUpdate) {
        await updateUser(userId, data.username, data.email);
      } else {
        await createUser(data.username, data.email);
      }
      nav("/user/list");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Navbar>
      <AbsoluteCenter>
        <Box
          background="white"
          shadow="md"
          borderRadius="lg"
          p={8}
          width={{ base: "90%", sm: "80%", md: "400px" }}
        >
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Flex flexDirection="column" gap="10px">
              <CustomInput
                label="Username"
                placeholder="Username"
                name="username"
                register={register}
                error={errors.username}
              />
              <CustomInput
                label="Email"
                placeholder="Email"
                type="email"
                name="email"
                register={register}
                error={errors.email}
              />
            </Flex>

            <Flex gap="4" justify="flex-start">
              <CustomButton isLoading={isLoading} width="100px" type="submit">
                create
              </CustomButton>
              <CustomButton
                isLoading={isLoading}
                width="100px"
                type="button"
                bg="#fff"
                color="#d97706"
                variant="outline"
                hover="#fac88e"
                onClick={() => nav("/user/list")}
              >
                cancel
              </CustomButton>
            </Flex>
          </form>
        </Box>
      </AbsoluteCenter>
    </Navbar>
  );
}
