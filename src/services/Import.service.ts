import { t } from "i18next";
import { ImportModel, ProductModel } from "../model";
import { OptionProps } from "../types";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
import { formatDateToFormatString } from "../utils/util";
export const ImportService = {
  activeIfSelectAndDeactiveOthers(id: string, list: ImportModel[]) {
    list.forEach((item, idx) => {
      if (item._id !== id) {
        list[idx].active = false;
      } else {
        list[idx].active = true;
      }
    });
    return list;
  },
  activeProductIfSelectAndDeactiveOthers(code: string, list: ProductModel[]) {
    list.forEach((item, idx) => {
      if (item.code !== code) {
        list[idx].active = false;
      } else {
        list[idx].active = true;
      }
    });
    return list;
  },
  itemFromJson(data: any) {
    const details = data.import_details;
    let keys: OptionProps[] = [];
    let products = details.details ?? [];
    if (products.length > 0) {
      for (let index = 0; index < products.length; index++) {
        const element = products[index];
        products[index].is_online = element.online ?? false;
        products[index].is_new = element.new ?? false;
        products[index].is_hot = element.hot ?? false;
      }
    }
    if (details.keys.length > 0) {
      for (let index = 0; index < details.keys.length; index++) {
        const element = details.keys[index];
        keys.push({
          key: element,
          name: t(element),
        });
      }
    }
    const item = {
      _id: data._id,
      code: data.code,
      create_user: data.creator ?? "",
      action: data.action,
      method: data.method,
      date: formatDateToFormatString(data.createdAt, "DD/MM/YYYY HH:mm"),
      products: products,
      images: [],
      tags: [],
      updateKeys: keys,
      total: data.total ?? 0,
      active: false,
      disabled: data.status === "ACTIVE" ? false : true,
    };
    return item;
  },
  listFromJson(data: any) {
    //console.log(data)
    let list: ImportModel[] = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      list.push({
        _id: element._id,
        code: element.code,
        create_user: element.creator ?? "",
        action: element.action,
        method: element.method,
        date: formatDateToFormatString(element.createdAt, "DD/MM/YYYY HH:mm"),
        products: [],
        images: [],
        tags: [],
        updateKeys: [],
        total: element.total ?? 0,
        active: false,
        disabled: element.status === "ACTIVE" ? false : true,
      });
    }
    return list;
  },
  async fetchAll(data: any) {
    const response = await HttpService.doGetRequest("v1/import", data);
    return parseCommonHttpResult(response);
  },
  async addItem(data: any) {
    const response = await HttpService.doPostRequest("v1/import", data);
    return parseCommonHttpResult(response);
  },
  async updateItem(data: any) {
    const response = await HttpService.doPutRequest("v1/import", data);
    return parseCommonHttpResult(response);
  },
  async deleteItem(data: any) {
    const response = await HttpService.doDeleteRequest("v1/import", data);
    return parseCommonHttpResult(response);
  },
  async restoreItem(data: any) {
    const response = await HttpService.doPutRequest("v1/import/restore", data);
    return parseCommonHttpResult(response);
  },
  async patchItem(data: any) {
    const response = await HttpService.doPatchRequest("v1/import", data);
    return parseCommonHttpResult(response);
  },
  async syncImages(data: any) {
    const response = await HttpService.doPostRequest("v1/import/image", data);
    return parseCommonHttpResult(response);
  },
};
