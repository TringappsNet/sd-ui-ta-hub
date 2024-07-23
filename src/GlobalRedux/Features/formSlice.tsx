import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    submitForm: (state, action) => {
      state.formData = action.payload;
    },
  },
});

export const { submitForm } = formSlice.actions;

export default formSlice.reducer;