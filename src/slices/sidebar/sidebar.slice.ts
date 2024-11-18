import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { SidebarItemModel } from "../../model";
import { SidbarService } from "../../services/Sidebar.service";
import { isMobile } from "../../utils/util";
type SidebarState = {
  items: SidebarItemModel[];
  menues: SidebarItemModel[];
  minimum: boolean;
  status: "idle" | "loading" | "failed";
  langCode: string;
  actions: string[];
  activedTarget: string;
};
const initialState: SidebarState = {
  items: [],
  menues: [],
  minimum: true,
  status: "idle",
  langCode: localStorage.getItem("language") ?? "VN",
  actions: [],
  activedTarget: "",
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setActions: (state, action) => {
      state.actions = action.payload;
    },
    setActivedTarget: (state, action) => {
      state.activedTarget = action.payload;
    },
    setSidebar: (state, action) => {
      state.items = action.payload;
    },
    setMenues: (state, action) => {
      state.menues = action.payload;
    },
    minimumSidebar: (state) => {
      state.minimum = !state.minimum;
    },
    mobileMenu: (state) => {
      const mobile = isMobile();
      if (mobile && !state.minimum) {
        state.minimum = true;
      }
    },
    sidebarChangeLocale: (state, action) => {
      state.langCode = action.payload;
    },
    unActiveMenues: (state) => {
      state.items = SidbarService.clearActivedMenues(state.items);
    },
  },
});
export const {
  setActions,
  setSidebar,
  mobileMenu,
  minimumSidebar,
  sidebarChangeLocale,
  unActiveMenues,
  setActivedTarget,
  setMenues,
} = sidebarSlice.actions;
export const selectAllMenues = (state: RootState) => state.sidebar.items;
export default sidebarSlice.reducer;
