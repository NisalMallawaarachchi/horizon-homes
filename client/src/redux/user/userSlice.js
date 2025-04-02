import { createSlice } from "@reduxjs/toolkit"; // Importing createSlice from Redux Toolkit

// 🟢 Initial state: Defines the starting values for user authentication
const initialState = {
  currentUser: null, // No user is logged in initially
  error: null, // No errors at the beginning
  loading: false, // Not loading by default
};

// 🔹 Creating a Redux slice for user authentication
const userSlice = createSlice({
  name: "user", // Slice name (used for debugging and state management)
  initialState, // Setting the initial state
  reducers: {
    // 🟠 Action: When user tries to log in (start login)
    signInStart: (state) => {
      state.loading = true; // Show loading while logging in
      state.error = null; // Reset any previous errors
    },

    // ✅ Action: When login is successful
    signInSuccess: (state, action) => {
      state.currentUser = action.payload; // Store the logged-in user data
      state.loading = false; // Stop loading
      state.error = null; // Clear any previous errors
    },

    // ❌ Action: When login fails
    signInFailure: (state, action) => {
      state.loading = false; // Stop loading
      state.error = action.payload; // Store error message (e.g., "Invalid password")
    },
  },
});

// 🔹 Exporting actions so we can use them in other parts of our app
export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

// 🔹 Exporting the reducer so we can add it to our Redux store
export default userSlice.reducer;
