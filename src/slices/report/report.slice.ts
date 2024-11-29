import { createSlice } from "@reduxjs/toolkit";
import { commonCreateAsyncThunk } from "../thunk";
import { errorMessage } from "../../utils/util";
import { ReportService } from "../../services/Report.service";
import { RequestState } from "../../app/state";
import { ProductTypeModel, TagModel } from "../../model";

interface ReportState {
  productTypes: ProductTypeModel[];
  tags: TagModel[];
  selectedType: string;
  selectedLevel: number;
  statistics: {
    customer: number;
    product: number;
    online: number;
    retail: number;
    web: number;
  };
  revenues: any;
  rawData: { news: any[]; olds: any[]; retails: any[]; webs: any[] };
  sellGroupByGoldType: {
    type: string;
    quantity: number;
    weight: number;
    amount: number;
  }[];
  buyGroupByGoldType: {
    type: string;
    quantity: number;
    weight: number;
    amount: number;
  }[];
  buyData: any[];
  percentGoldTypes: {
    type: string;
    quantity: number;
    weight: number;
    amount: number;
    quantityVirtual: number;
    weightVirtual: number;
    amountVirtual: number;
  }[];
  percentProductTypes: {
    type: string;
    quantity: number;
    weight: number;
    amount: number;
    quantityVirtual: number;
    weightVirtual: number;
    amountVirtual: number;
  }[];
  percentTags: {
    type: string;
    quantity: number;
    weight: number;
    amount: number;
    quantityVirtual: number;
    weightVirtual: number;
    amountVirtual: number;
  }[];
  revenueByMonths: {
    month: string;
    wage: number;
    amount: number;
    gold: number;
    discount: number;
  }[];
  statisticStatus: RequestState;
  revenueStatus: RequestState;
  revenueDetailStatus: RequestState;
}

const initialState: ReportState = {
  productTypes: [],
  tags: [],
  selectedType: "GOLDTYPE",
  selectedLevel: 1,
  statistics: { customer: 0, product: 0, online: 0, retail: 0, web: 0 },
  revenues: null,
  rawData: { news: [], olds: [], retails: [], webs: [] },
  sellGroupByGoldType: [],
  buyGroupByGoldType: [],
  buyData: [],
  percentGoldTypes: [],
  percentProductTypes: [],
  percentTags: [],
  revenueByMonths: [],
  statisticStatus: { status: "idle" },
  revenueStatus: { status: "idle" },
  revenueDetailStatus: { status: "idle" },
};
export const retailStatistics: any = commonCreateAsyncThunk({
  type: "report/retailStatistics",
  action: ReportService.retailStatistic,
});
export const retailRevenues: any = commonCreateAsyncThunk({
  type: "report/retailRevenues",
  action: ReportService.retailRevenue,
});
export const retailRevenuesDetail: any = commonCreateAsyncThunk({
  type: "report/retailRevenuesDetail",
  action: ReportService.retailRevenueDetail,
});
export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setReportProductTypes(state, action) {
      state.productTypes = action.payload;
    },
    setReportTags(state, action) {
      state.tags = action.payload;
    },
    setDataChartByType(state, action) {
      state.selectedType = action.payload.type;
      state.selectedLevel = action.payload.level;
      state.sellGroupByGoldType = ReportService.sellGroupByGoldType(
        state.rawData.news,
        state.productTypes,
        state.selectedType,
        state.selectedLevel
      );
      state.percentProductTypes = ReportService.percentProductTypes(
        state.rawData.news,
        state.productTypes,
        state.selectedLevel
      );
    },
    clearStatisticStatus(state) {
      state.statisticStatus = { status: "idle" };
    },
    clearRevenueStatus(state) {
      state.revenueStatus = { status: "idle" };
    },
    clearRevenueDetailStatus(state) {
      state.revenueDetailStatus = { status: "idle" };
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(retailStatistics.fulfilled, (state, action) => {
        const statistics = action.payload.data.data;
        state.statistics = statistics;
        state.statisticStatus = { status: "completed" };
      })
      .addCase(retailStatistics.pending, (state, _action) => {
        state.statisticStatus = { status: "loading" };
      })
      .addCase(retailStatistics.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statisticStatus = {
          status: "failed",
          error: errorMessage(error, false),
        };
      })
      .addCase(retailRevenues.fulfilled, (state, action) => {
        state.revenues = ReportService.retailRevenuesFromJson(
          action.payload.data.data
        );
        //console.log(state.revenues)
        state.revenueStatus = { status: "completed" };
      })
      .addCase(retailRevenues.pending, (state, _action) => {
        state.revenueStatus = { status: "loading" };
      })
      .addCase(retailRevenues.rejected, (state, action) => {
        const error = Object(action.payload);
        state.revenueStatus = {
          status: "failed",
          error: errorMessage(error, false),
        };
      })
      .addCase(retailRevenuesDetail.fulfilled, (state, action) => {
        state.rawData = action.payload.data.data;
        state.sellGroupByGoldType = ReportService.sellGroupByGoldType(
          state.rawData.news,
          state.productTypes,
          state.selectedType,
          state.selectedLevel
        );
        state.buyGroupByGoldType = ReportService.buyGroupByGoldType(
          state.rawData.olds
        );
        state.buyData = ReportService.buyData(state.rawData);
        state.percentGoldTypes = ReportService.percentGoldTypes(
          state.rawData.news
        );
        state.percentProductTypes = ReportService.percentProductTypes(
          state.rawData.news,
          state.productTypes,
          state.selectedLevel
        );
        state.percentTags = ReportService.percentTags(state.rawData.news);
        state.revenueByMonths = ReportService.revenueByMonths(state.rawData);
        state.revenues = ReportService.retailRevenuesFromDetails(
          action.payload.data.data
        );
        state.revenueDetailStatus = { status: "completed" };
      })
      .addCase(retailRevenuesDetail.pending, (state, _action) => {
        state.revenueDetailStatus = { status: "loading" };
      })
      .addCase(retailRevenuesDetail.rejected, (state, action) => {
        const error = Object(action.payload);
        state.revenueDetailStatus = {
          status: "failed",
          error: errorMessage(error, false),
        };
      });
  },
});
export const {
  clearRevenueStatus,
  clearStatisticStatus,
  setReportProductTypes,
  setReportTags,
  setDataChartByType,
  clearRevenueDetailStatus,
} = reportSlice.actions;
export default reportSlice.reducer;
