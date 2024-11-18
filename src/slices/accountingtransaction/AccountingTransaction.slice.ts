import { createSlice } from "@reduxjs/toolkit";
import { AccountingTransactionModel } from "../../model";
import { ActionSliceState } from "../state";
import { AccountingTransactionService } from "../../services/AccountingTransaction.service";
import { commonCreateAsyncThunk } from "../thunk";
import { errorMessage } from "../../utils/util";

interface AccountingTransactionState extends ActionSliceState {
  list: AccountingTransactionModel[];
  filteredList: AccountingTransactionModel[];
  item: AccountingTransactionModel;
}

const initialState: AccountingTransactionState = {
  list: [],
  filteredList: [],
  item: AccountingTransactionModel.initial(),
  status: "idle",
  statusAction: "idle",
  action: "INS",
};
export const fetchAll: any = commonCreateAsyncThunk({
  type: "transaction/fetchAll",
  action: AccountingTransactionService.fetchAll,
});
export const addItem: any = commonCreateAsyncThunk({
  type: "transaction/addItem",
  action: AccountingTransactionService.addItem,
});
export const editItem: any = commonCreateAsyncThunk({
  type: "transaction/editItem",
  action: AccountingTransactionService.editItem,
});
export const deleteItem: any = commonCreateAsyncThunk({
  type: "transaction/deleteItem",
  action: AccountingTransactionService.deleteItem,
});
export const restoreItem: any = commonCreateAsyncThunk({
  type: "transaction/restoreItem",
  action: AccountingTransactionService.restoreItem,
});
export const accountingTransactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    selectItem: (state, action) => {
      state.filteredList =
        AccountingTransactionService.activeIfSelectAndDeactiveOthers(
          action.payload.id,
          state.filteredList
        );
      state.item = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    resetActionState: (state, _action) => {
      state.statusAction = "idle";
    },
    changeAction: (state, action) => {
      console.log("action.payload:" + action.payload);
      state.action = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreItem.fulfilled, (state, _action) => {
        state.action = "VIE";
        state.statusAction = "completed";
      })
      .addCase(restoreItem.pending, (state, _action) => {
        state.statusAction = "loading";
      })
      .addCase(restoreItem.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusAction = "failed";
        state.error = errorMessage(error, false);
      })
      .addCase(deleteItem.fulfilled, (state, _action) => {
        state.action = "VIE";
        state.statusAction = "completed";
      })
      .addCase(deleteItem.pending, (state, _action) => {
        state.statusAction = "loading";
      })
      .addCase(deleteItem.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusAction = "failed";
        state.error = errorMessage(error, false);
      })
      .addCase(editItem.fulfilled, (state, _action) => {
        state.action = "VIE";
        state.statusAction = "completed";
      })
      .addCase(editItem.pending, (state, _action) => {
        state.statusAction = "loading";
      })
      .addCase(editItem.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusAction = "failed";
        state.error = errorMessage(error, false);
      })
      .addCase(addItem.fulfilled, (state, _action) => {
        state.action = "VIE";
        state.statusAction = "completed";
      })
      .addCase(addItem.pending, (state, _action) => {
        state.statusAction = "loading";
      })
      .addCase(addItem.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusAction = "failed";
        state.error = errorMessage(error, false);
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        const list = AccountingTransactionService.listFromJson(
          action.payload.data !== "" ? action.payload.data.data : []
        );
        state.list = list;
        state.filteredList = list;
        state.status = "completed";
      })
      .addCase(fetchAll.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchAll.rejected, (state, action) => {
        const error = Object(action.payload);
        state.status = "failed";
        state.error = errorMessage(error, false);
      });
  },
});

// eslint-disable-next-line no-empty-pattern
export const { resetActionState, changeAction, setFilteredList, selectItem } =
  accountingTransactionSlice.actions;
export default accountingTransactionSlice.reducer;
