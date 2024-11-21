import { combineReducers } from "@reduxjs/toolkit";
import signinSlice from "../slices/signin/signin.slice";
import sidebarSlice from "../slices/sidebar/sidebar.slice";
import headerSlice from "../slices/header/header.slice";
import retailSlice from "../slices/retail/retail.slice";
import goldtypeSlice from "../slices/goldtype/goldtype.slice";
import goldgroupSlice from "../slices/goldgroup/goldgroup.slice";
import roleSlice from "../slices/role/role.slice";
import productstorageSlice from "../slices/productstorage/productstorage.slice";
import semiproductSlice from "../slices/semiproduct/semiproduct.slice";
import importSlice from "../slices/import/import.slice";
import inventorySlice from "../slices/inventory/inventory.slice";
import profileSlice from "../slices/profile/profile.slice";
import uploadSlice from "../slices/upload/upload.slice";
import warehouseSlice from "../slices/warehouse/warehouse.slice";
import tagSlice from "../slices/tag/tag.slice";
import producttypeSlice from "../slices/producttype/producttype.slice";
import categorySlice from "../slices/category/category.slice";
import historySlice from "../slices/history/history.slice";
import emailSlice from "../slices/email/email.slice";
import weborderSlice from "../slices/weborder/weborder.slice";
import installmentSlice from "../slices/installment/installment.slice";
import viewSlice from "../slices/view/view.slice";
import searchSlice from "../slices/search/search.slice";
import customerSlice from "../slices/customer/customer.slice";
import bankSlice from "../slices/bank/bank.slice";
import cashdetailSlice from "../slices/cash/cashdetail.slice";
import cashsummarySlice from "../slices/cash/cashsummary.slice";
import bankdetailSlice from "../slices/bank/bankdetail.slice";
import productexportSlice from "../slices/productstorage/productexport.slice";
import semilabelSlice from "../slices/semiproduct/semilabel.slice";
import semiexportSlice from "../slices/semiproduct/semiexport.slice";
import appSlice from "../slices/app.slice";
import supplierSlice from "../slices/supplier/supplier.slice";
import semiimportSlice from "../slices/semiproduct/semiimport.slice";
import temppawnSlice from "../slices/pawn/temppawn.slice";
import pawntagSlice from "../slices/pawn/pawntag.slice";
import pawnwarehouseSlice from "../slices/pawn/pawnwarehouse.slice";
import reportSlice from "../slices/report/report.slice";
import counterSlice from "../slices/counter/counter.slice";
import descriptionSlice from "../slices/description/description.slice";
import fingerSlice from "../slices/fingerprint/fingerprint.slice";
import accountingTransactionSlice from "../slices/accountingtransaction/AccountingTransaction.slice";
import featureSlice from "../slices/feature/feature.slice";

const rootReducer = combineReducers({
  app: appSlice,
  signin: signinSlice,
  sidebar: sidebarSlice,
  header: headerSlice,
  retail: retailSlice,
  goldtype: goldtypeSlice,
  goldgroup: goldgroupSlice,
  role: roleSlice,
  productstorage: productstorageSlice,
  semiproduct: semiproductSlice,
  import: importSlice,
  inventory: inventorySlice,
  profile: profileSlice,
  upload: uploadSlice,
  warehouse: warehouseSlice,
  tag: tagSlice,
  producttype: producttypeSlice,
  category: categorySlice,
  history: historySlice,
  email: emailSlice,
  weborder: weborderSlice,
  installment: installmentSlice,
  view: viewSlice,
  search: searchSlice,
  customer: customerSlice,
  bank: bankSlice,
  cashdetail: cashdetailSlice,
  cashsummary: cashsummarySlice,
  bankdetail: bankdetailSlice,
  productexport: productexportSlice,
  semilabel: semilabelSlice,
  semiexport: semiexportSlice,
  supplier: supplierSlice,
  semiimport: semiimportSlice,
  temppawn: temppawnSlice,
  pawntag: pawntagSlice,
  pawnwarehouse: pawnwarehouseSlice,
  report: reportSlice,
  counter: counterSlice,
  description: descriptionSlice,
  finger: fingerSlice,
  accountingTransaction: accountingTransactionSlice,
  feature: featureSlice,
});

export default rootReducer;
