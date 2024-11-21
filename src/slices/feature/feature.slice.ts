import { createSlice } from "@reduxjs/toolkit";
import { ActionSliceState } from "../state";
import { commonCreateAsyncThunk } from "../thunk";
import { errorMessage } from "../../utils/util";
import { FeatureService } from "../../services/Feature.service";
import { FeatureModel } from "../../model";

interface FeatureState extends ActionSliceState {
  list: FeatureModel[];
  item: FeatureModel;
}

const initialState: FeatureState = {
  list: [],
  item: FeatureModel.initial(),
  status: "idle",
  statusAction: "idle",
  action: "INS",
};
export const fetchAll: any = commonCreateAsyncThunk({
  type: "feature/fetchAll",
  action: FeatureService.fetchAll,
});
export const editItem: any = commonCreateAsyncThunk({
  type: "feature/editItem",
  action: FeatureService.editItem,
});

export const featureSlice = createSlice({
  name: "feature",
  initialState,
  reducers: {
    selectItem: (state, action) => {
      state.item = action.payload;
    },
    setFilteredList: (state, action) => {
      state.list = action.payload;
    },
    resetActionState: (state, _action) => {
      state.statusAction = "idle";
    },
    changeAction: (state, action) => {
      state.action = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchAll.fulfilled, (state, action) => {
        const list = FeatureService.listFromJson(
          action.payload.data !== "" ? action.payload.data.data : []
        );
        state.list = list;
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

export const { resetActionState, selectItem, changeAction, setFilteredList } =
  featureSlice.actions;
export default featureSlice.reducer;
