import { Button } from "@chakra-ui/react";

export default function CustomButton({
  children,
  isLoading = false,
  loadingText = "Loading",
  bg = "#d97706",
  color = "#fff",
  width = "full",
  mt = "8px",
  variant = null,
  borderRadius = "lg",
  type = "submit",
  spinnerPlacement = "start",
  hover = "#b45309",
  onClick,
  ...rest
}) {
  return (
    <Button
      loading={isLoading}
      loadingText="Loading"
      color={color}
      bg={bg}
      width={width}
      type={type}
      mt={mt}
      borderRadius="lg"
      spinnerPlacement="start"
      variant={variant}
      colorPalette="orange"
      onClick={onClick}
      _hover={{ bg: `${hover}` }}
    >
      {children}
    </Button>
  );
}
