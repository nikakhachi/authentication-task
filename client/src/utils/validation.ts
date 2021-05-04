import * as yup from "yup";

const errors = {
  required: "Required Field",
  passNotMatch: "Passwords Do Not Match",
};

const v = {
  text: yup.string().trim().nullable().required(errors.required),
  password: yup.string().trim().nullable().required(errors.required),
  confirmPassword: yup
    .string()
    .trim()
    .nullable()
    .required(errors.required)
    .oneOf([yup.ref("password"), null], errors.passNotMatch),
};

export const loginSchema = yup.object().shape({
  username: v.text,
  password: v.password,
});

export const registerSchema = yup.object().shape({
  username: v.text,
  password: v.password,
  confirmPassword: v.confirmPassword,
});
