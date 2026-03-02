import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    isAuthPopupOpen: false,
    isLoginModalOpen: false,
    isSidebarOpen: false,
    isSearchBarOpen: false,
    isCartOpen: false,
    isAIPopupOpen: false,
  },
  reducers: {
    toggleAuthPopup(state) {
      state.isAuthPopupOpen = !state.isAuthPopupOpen;
      if (!state.isAuthPopupOpen) {
        state.isLoginModalOpen = false;
      }
    },
    toggleLoginModal(state) {
      state.isLoginModalOpen = !state.isLoginModalOpen;
    },
    setAuthPopup(state, action) {
      state.isAuthPopupOpen = Boolean(action.payload);
      if (!state.isAuthPopupOpen) {
        state.isLoginModalOpen = false;
      }
    },
    setLoginModal(state, action) {
      state.isLoginModalOpen = Boolean(action.payload);
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleSearchBar(state) {
      state.isSearchBarOpen = !state.isSearchBarOpen;
    },
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },
    toggleAIModal(state) {
      state.isAIPopupOpen = !state.isAIPopupOpen;
    },

  },
});

export const {
  toggleAuthPopup,
  toggleLoginModal,
  setAuthPopup,
  setLoginModal,
  toggleSidebar,
  toggleSearchBar,
  toggleCart,
  toggleAIModal,
} = popupSlice.actions;
export default popupSlice.reducer;
