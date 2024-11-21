import { createSlice } from "@reduxjs/toolkit";
import { ActionSliceState } from "../state";
import { GoldtypeModel, HistoryModel } from "../../model";
import { GoldtypeService } from "../../services/Goldtype.service";
import { HistoryService } from "../../services/History.service";
import { commonCreateAsyncThunk } from "../thunk";
import { errorMessage } from "../../utils/util";

interface GoldtypeState extends ActionSliceState {
  list: GoldtypeModel[];
  filteredList: GoldtypeModel[];
  item: GoldtypeModel;
  histories: HistoryModel[];
}
const initialState: GoldtypeState = {
  list: [],
  filteredList: [],
  histories: [],
  item: GoldtypeModel.initial(),
  status: "idle",
  statusAction: "idle",
  action: "INS",
};
export const fetchChartItem: any = commonCreateAsyncThunk({
  type: "history/patchItem",
  action: HistoryService.patchItem,
});
export const fetchAll: any = commonCreateAsyncThunk({
  type: "goldtype/fetchAll",
  action: GoldtypeService.fetchAll,
});
export const addItem: any = commonCreateAsyncThunk({
  type: "goldtype/addItem",
  action: GoldtypeService.addItem,
});
export const editItem: any = commonCreateAsyncThunk({
  type: "goldtype/editItem",
  action: GoldtypeService.editItem,
});
export const deleteItem: any = commonCreateAsyncThunk({
  type: "goldtype/deleteItem",
  action: GoldtypeService.deleteItem,
});
export const restoreItem: any = commonCreateAsyncThunk({
  type: "goldtype/restoreItem",
  action: GoldtypeService.restoreItem,
});
export const goldtypeSlice = createSlice({
  name: "goldtype",
  initialState,
  reducers: {
    selectItem: (state, action) => {
      state.filteredList = GoldtypeService.activeIfSelectAndDeactiveOthers(
        action.payload.id,
        state.filteredList
      );
      state.item = action.payload;
      //console.log(action.payload)
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    setHistories: (state, action) => {
      state.histories = action.payload;
    },
    resetActionState: (state, _action) => {
      state.statusAction = "idle";
    },
    changeAction: (state, action) => {
      //console.log("action.payload:" + action.payload);
      state.action = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChartItem.fulfilled, (state, action) => {
        // console.log(action.payload.data);
        const list = HistoryService.historyFromJson(
          action.payload.data !== "" ? action.payload.data : []
        );
        state.histories = list;
        state.action = "VIE";
        state.statusAction = "completed";
      })
      .addCase(fetchChartItem.pending, (state, _action) => {
        state.statusAction = "loading";
      })
      .addCase(fetchChartItem.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusAction = "failed";
        state.error = errorMessage(error, false);
      })

      .addCase(restoreItem.fulfilled, (state, action) => {
        const item = GoldtypeService.itemFromJson(action.payload.data.goldType);
        state.item = item;
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
      .addCase(deleteItem.fulfilled, (state, action) => {
        const item = GoldtypeService.itemFromJson(action.payload.data.goldType);
        state.item = item;
        //state.action="VIE"
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
      .addCase(editItem.fulfilled, (state, action) => {
        const item = GoldtypeService.itemFromJson(action.payload.data.goldType);
        state.item = item;
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
      .addCase(addItem.fulfilled, (state, action) => {
        const item = GoldtypeService.itemFromJson(action.payload.data.goldType);
        state.item = item;
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
        const list = GoldtypeService.listFromJson(
          action.payload.data !== "" ? action.payload.data.goldTypes : []
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
export const { selectItem, resetActionState, changeAction, setFilteredList } =
  goldtypeSlice.actions;
export default goldtypeSlice.reducer;
