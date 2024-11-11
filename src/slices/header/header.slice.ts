import { createSlice } from '@reduxjs/toolkit'
export type HeaderState = {
  showLanguageDrop: boolean
  showNotiDrop: boolean
  showMessageDrop: boolean
  showProfileDrop: boolean
  showResNav: boolean
  search: string
}

const initialState: HeaderState = {
  search: '',
  showLanguageDrop: false,
  showNotiDrop: false,
  showMessageDrop: false,
  showProfileDrop: false,
  showResNav: false
}

export const headerSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleNoti: (state) => {
      state.showNotiDrop = !state.showNotiDrop
      state.showMessageDrop = false
      state.showProfileDrop = false
      state.showLanguageDrop = false
    },
    toggleMessage: (state) => {
      state.showMessageDrop = !state.showMessageDrop
      state.showNotiDrop = false
      state.showProfileDrop = false
      state.showLanguageDrop = false
    },
    toggleProfile: (state) => {
      state.showProfileDrop = !state.showProfileDrop
      state.showMessageDrop = false
      state.showNotiDrop = false
      state.showLanguageDrop = false
    },
    toggleLanguage: (state) => {
      state.showLanguageDrop = !state.showLanguageDrop
      state.showMessageDrop = false
      state.showNotiDrop = false
      state.showProfileDrop = false
    },
    toggleHideAll: (state) => {
      state.showResNav = false
      state.showProfileDrop = false
      state.showMessageDrop = false
      state.showNotiDrop = false
      state.showLanguageDrop = false
    },
    toggleResNav: (state) => {
      state.showResNav = !state.showResNav
    },
    searchChanged: (state, action) => {
      state.search = action.payload
    }
  },
  extraReducers: (_builder) => {}
})
export const { toggleNoti, toggleMessage, toggleProfile, toggleHideAll, toggleResNav, toggleLanguage, searchChanged } =
  headerSlice.actions
export default headerSlice.reducer
