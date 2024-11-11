import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"
export const CategoriesService = {
    async fetchAll(data:any){
        const response = await HttpService.doPatchRequest('v1/categories', data)
        return parseCommonHttpResult(response)
    },
    async updateCategories(data:any){
        const response = await HttpService.doPostRequest('v1/categories', data)
        return parseCommonHttpResult(response)
    },
}