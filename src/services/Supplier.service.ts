import { SupplierModel } from "../model/Supplier.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";

export const SupplierService = {
  activeIfSelectAndDeactiveOthers(id: string, list: SupplierModel[]) {
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
      name: data.name,
      standard: data.standard,
      address: data.address,
      tax_code: data.tax,
      phone: data.phone,
      active: false,
      disabled: data.status === "ACTIVE" ? false : true,
    };
    return item;
  },
  listFromJson(data: any) {
    //console.log(data)
    let list: SupplierModel[] = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element.supplier) {
        const supplier = element.supplier._id
          ? element.supplier
          : element.supplier[0];
        list.push({
          id: supplier._id,
          code: element.code,
          name: supplier.name,
          standard: supplier.standard,
          address: supplier.address,
          tax_code: supplier.tax_code,
          phone: supplier.phone,
          active: false,
          disabled: element.is_active ? !element.is_active : false,
        });
      }
    }
    return list;
  },
  async restoreItem(data: any) {
    const response = await HttpService.doPutRequest(
      "v1/supplier/restore",
      data
    );
    return parseCommonHttpResult(response);
  },
  async deleteItem(data: any) {
    const response = await HttpService.doDeleteRequest("v1/supplier", data);
    return parseCommonHttpResult(response);
  },
  async editItem(data: any) {
    const response = await HttpService.doPutRequest("v1/supplier", data);
    return parseCommonHttpResult(response);
  },
  async addItem(data: any) {
    const response = await HttpService.doPostRequest("v1/supplier", data);
    return parseCommonHttpResult(response);
  },
  async fetchAll(data: any) {
    const response = await HttpService.doGetRequest("v1/supplier", data);
    return parseCommonHttpResult(response);
  },
};
