
import { getIn, FieldProps } from "formik";
import { TextField, TextFieldProps } from "@material-ui/core";

interface IProps extends FieldProps {
  textFieldProps: TextFieldProps;
}

const InputField: React.FC<IProps> = ({
  field,
  textFieldProps,
  form: { errors, touched },
}) => {
  const error = getIn(errors, field.name);
  const touch = getIn(touched, field.name);

  return (
    <TextField
      error={touch && Boolean(error)}
      helperText={touch && error}
      {...field}
      {...textFieldProps}
      value={field.value || ""}
      fullWidth
    />
  );
};

export default InputField;