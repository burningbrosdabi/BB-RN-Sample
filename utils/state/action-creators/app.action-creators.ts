import { createAction } from "@reduxjs/toolkit";
import type { Dialog, PopUp } from "../reducers/app.reducer";

export const showDialog = createAction<Dialog>('app/dialog/show');
export const hideDialog = createAction('app/dialog/hide');
export const showPopup = createAction<PopUp>('app/popup/show');
export const hidePopup = createAction('app/popup/hide');
