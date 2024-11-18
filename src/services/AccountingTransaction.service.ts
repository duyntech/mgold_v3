import { AccountingTransactionModel } from "../model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";

export const AccountingTransactionService = {
  activeIfSelectAndDeactiveOthers(
    id: string,
    list: AccountingTransactionModel[]
  ) {
    list.forEach((item, idx) => {
      if (item.id !== id) {
        list[idx].active = false;
      } else {
        list[idx].active = true;
      }
    });
    return list;
  },
  itemFromJson(data: any) {
    const item = {
      id: data._id,
      code: data.code,
      type: data.type,
      name: data.name,
      note: data.note,
      status: data.note,
      for_module: data.for_module,
      approve_enable: data.approve_enable,
      active: false,
      disabled: data.status === "ACTIVE" ? false : true,
    };
    return item;
  },
  listFromJson(data: any) {
    let list: AccountingTransactionModel[] = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      list.push({
        id: element._id,
        code: element.code,
        type: element.type,
        name: element.name,
        note: element.note,
        status: element.status,
        for_module: element.for_module,
        approve_enable: element.approve_enable,
        active: false,
        disabled: element.status === "ACTIVE" ? false : true,
      });
    }
    return list;
  },
  async restoreItem(data: any) {
    const response = await HttpService.doPutRequest(
      "v1/transaction/restore",
      data
    );
    return parseCommonHttpResult(response);
  },
  async deleteItem(data: any) {
    const response = await HttpService.doDeleteRequest("v1/transaction", data);
    return parseCommonHttpResult(response);
  },
  async editItem(data: any) {
    const response = await HttpService.doPutRequest("v1/transaction", data);
    return parseCommonHttpResult(response);
  },
  async addItem(data: any) {
    const response = await HttpService.doPostRequest("v1/transaction", data);
    return parseCommonHttpResult(response);
  },
  async fetchAll(data: any) {
    const response = await HttpService.doGetRequest("v1/transaction", data);
    return parseCommonHttpResult(response);
  },
};
