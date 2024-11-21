import { FeatureModel } from "../model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";

export const FeatureService = {
  activeIfSelectAndDeactiveOthers(id: string, list: FeatureModel[]) {
    // list.forEach((item, idx) => {
    //   if (item.id !== id) {
    //     list[idx].active = false;
    //   } else {
    //     list[idx].active = true;
    //   }
    // });
    return list;
  },
  itemFromJson(data: any) {
    const item = {
      id: data._id,
      code: data.code,
      name: data.name,
      target: data.target,
      module: data.module ? data.model : "GENERAL",
      icon: data.icon,
    };
    return item;
  },
  listFromJson(data: any) {
    let list: FeatureModel[] = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      list.push({
        id: element._id,
        code: element.code,
        name: element.name,
        target: element.target,
        module: element.module ? element.module : "GENERAL",
        icon: element.icon,
      });
    }
    return list;
  },
  async editItem(data: any) {
    const response = await HttpService.doPutRequest("v1/feature", data);
    return parseCommonHttpResult(response);
  },
  async fetchAll(data: any) {
    const response = await HttpService.doGetRequest("v1/feature", data);
    return parseCommonHttpResult(response);
  },
};
