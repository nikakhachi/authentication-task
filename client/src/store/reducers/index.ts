import { combineReducers } from "redux";

import { snackbar } from "./snackbar";

export const rootReducer = combineReducers({ snackbar });

export type RootState = ReturnType<typeof rootReducer>;
