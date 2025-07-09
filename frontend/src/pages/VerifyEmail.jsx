import {
  Button,
  Steps,
  PinInput,
  Box,
  Flex,
  Text,
  Link,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import CustomInput from "@/components/ui/customComponents/CustomInput";
import { useEffect, useState } from "react";
import { verifyOTP, resetPassword, sendOTP } from "@/endpoints/api";
import { useNavigate, useSearchParams } from "react-router-dom";

const schema = Yup.object().shape({
  password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [step, setStep] = useState(0);
  const [otpValue, setOtpValue] = useState([]);
  const [isValidPIN, setIsValidPIN] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setStep(1);
    }
  }, []);

  const handleVerify = async () => {
    const input_otp = otpValue.join("");
    if (input_otp.length !== 6) {
      setIsValidPIN(true);
      setErrorMessage("Please enter the full OTP.");
      return;
    }
    console.log(email, input_otp);
    try {
      const res = await verifyOTP(email, input_otp);
      if (res.verified) {
        setIsValidPIN(false);
        setErrorMessage("");
        localStorage.setItem("verified", true);
        localStorage.setItem("token", res.token);
        setStep(1);
        console.log("OTP Verified. Token:", res.token);
      } else {
        setIsValidPIN(true);
        setErrorMessage("Invalid OTP.");
      }
    } catch (err) {
      setIsValidPIN(true);
      setErrorMessage(
        err.response?.data?.detail || "Something went wrong. Try again."
      );
    }
  };

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Missing reset token. Please verify OTP again.");
      return;
    }

    try {
      const res = await resetPassword(token, data.password);
      console.log("Password Reset Response:", res);
      localStorage.removeItem("token");
      localStorage.removeItem("verified");
      setStep(2);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail || "Failed to reset password. Try again."
      );
    }
  };

  const resendOTP = async () => {
    try {
      const response = await sendOTP(email);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={4}>
        <Box
          background="white"
          shadow="md"
          borderRadius="lg"
          p={8}
          width={{ base: "90%", sm: "80%", md: "600px" }}
        >
          <Steps.Root step={step} count={2} colorPalette="orange">
            <Steps.List>
              <Steps.Item index={0} title="Verify OTP">
                <Steps.Indicator />
                <Steps.Title>Verify OTP</Steps.Title>
                <Steps.Separator />
              </Steps.Item>
              <Steps.Item index={1} title="Set Password">
                <Steps.Indicator />
                <Steps.Title>Set Password</Steps.Title>
                <Steps.Separator />
              </Steps.Item>
            </Steps.List>

            <Steps.Content index={0}>
              <Flex
                w="full"
                direction="column"
                gap="4"
                justify="center"
                align="center"
              >
                {errorMessage && (
                  <Text color="red.500" fontSize="sm">
                    {errorMessage}
                  </Text>
                )}

                <PinInput.Root
                  colorPalette="orange"
                  value={otpValue}
                  onValueChange={(e) => setOtpValue(e.value)}
                  required={true}
                  invalid={isValidPIN}
                  placeholder="x"
                >
                  <PinInput.HiddenInput />
                  <PinInput.Control>
                    <PinInput.Input index={0} />
                    <PinInput.Input index={1} />
                    <PinInput.Input index={2} />
                    <PinInput.Input index={3} />
                    <PinInput.Input index={4} />
                    <PinInput.Input index={5} />
                  </PinInput.Control>
                </PinInput.Root>

                <Button w="280px" type="button" onClick={handleVerify}>
                  Verify OTP
                </Button>
                <Link variant="underline" onClick={resendOTP}>
                  Resend OTP
                </Link>
              </Flex>
            </Steps.Content>

            <Steps.Content index={1}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Flex
                  w="full"
                  direction="column"
                  gap="4"
                  justify="center"
                  align="center"
                >
                  {errorMessage && (
                    <Text color="red.500" fontSize="sm">
                      {errorMessage}
                    </Text>
                  )}

                  <CustomInput
                    label="Password"
                    placeholder="Password"
                    type="password"
                    name="password"
                    register={register}
                    error={errors.password}
                    autoComplete="new-password"
                  />

                  <CustomInput
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    type="password"
                    name="confirmpassword"
                    register={register}
                    error={errors.confirmpassword}
                    autoComplete="new-password"
                  />

                  <Button w="full" type="submit">
                    Set Password
                  </Button>
                </Flex>
              </form>
            </Steps.Content>

            <Steps.CompletedContent>
              <Flex
                w="full"
                direction="column"
                gap="4"
                justify="center"
                align="center"
              >
                <Text>Password created successfully</Text>
                <Button type="button" onClick={() => nav("/login")}>
                  Go to Login
                </Button>
              </Flex>
            </Steps.CompletedContent>
          </Steps.Root>
        </Box>
      </Flex>
    </div>
  );
}
