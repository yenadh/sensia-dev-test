import { Field, Input } from "@chakra-ui/react";

export default function CustomInput({
  label,
  placeholder,
  type = "text",
  error,
  register,
  name,
  autoComplete = "off",
}) {
  return (
    <Field.Root invalid={!!error}>
      <Field.Label>{label}</Field.Label>
      <Input
        placeholder={placeholder}
        type={type}
        color="black"
        {...register(name)}
        autoComplete={autoComplete}
        focusRingColor="#d97706"
        borderRadius="lg"
      />
      <Field.ErrorText>{error?.message}</Field.ErrorText>
    </Field.Root>
  );
}
