import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Snackbar as Sbar, SnackbarCloseReason } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { RootState } from "../store/reducers";

const Snackbar: React.FC = () => {
  const snackbar = useSelector((state: RootState) => state.snackbar);
  const dispatch = useDispatch();

  return (
    <Sbar
      key={snackbar.text}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={(
        event: React.SyntheticEvent<any, Event>,
        reason: SnackbarCloseReason
      ) => dispatch({ type: "SNACKBAR_CLOSE" })}
    >
      <Alert
        onClose={() => dispatch({ type: "SNACKBAR_CLOSE" })}
        variant="filled"
        severity={snackbar.type}
      >
        {snackbar.text}
      </Alert>
    </Sbar>
  );
}

export default Snackbar;