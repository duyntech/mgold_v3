import { createSlice } from '@reduxjs/toolkit'
import { IDropdownList } from '../../types'

const initialState: IDropdownList = {
  items: [],
  status: 'idle'
}

export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (_builder) => {}
})
//export const {  } = messageSlice.actions;
export default messageSlice.reducer
