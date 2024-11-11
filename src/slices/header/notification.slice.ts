import { createSlice } from '@reduxjs/toolkit'
import { IDropdownList } from '../../types'

const initialState: IDropdownList = {
  items: [],
  status: 'idle'
}

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (_builder) => {}
})
//export const {  } = notificationSlice.actions;
export default notificationSlice.reducer
