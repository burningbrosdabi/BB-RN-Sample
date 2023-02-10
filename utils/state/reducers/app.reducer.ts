import { createReducer } from '@reduxjs/toolkit';
import type { ButtonProps } from 'components/button/Button';
import { showDialog, hideDialog, showPopup, hidePopup } from '../action-creators/app.action-creators';

interface PopUp {
  children: any;
  padding?: number;
}
interface Dialog {
  title: string;
  description?: string;
  actions: ButtonProps[];
  persistOnBtnPressed?: boolean;
}

interface AppReducer {
  dialog?: Dialog;
  popUp?: PopUp
}

const initialState: AppReducer = {
  dialog: undefined,
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(showDialog, (state, action) => {
      state.dialog = action.payload;
    })
    .addCase(hideDialog, (state, _) => {
      state.dialog = undefined;
    })
    .addCase(showPopup, (state, action) => {
      state.popUp = action.payload;
    }).addCase(hidePopup, (state, _) => {
      state.popUp = undefined
    })
});

export type { Dialog, PopUp };
