import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  email: "",
  password: "",
};

// Create a slice for login state
export const counterSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
  },
});

// Export actions
export const { setEmail, setPassword } = counterSlice.actions;

// Export reducer
export default counterSlice.reducer;
