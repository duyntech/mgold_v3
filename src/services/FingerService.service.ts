import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"

export const FingerService = {

    async register(data: any) {
        const response = await HttpService.doPutRequest('v1/finger', data)
        return parseCommonHttpResult(response)
    },
    async fetchFingers(data: any) {
        const response = await HttpService.doPatchRequest('v1/finger', data)
        return parseCommonHttpResult(response)
    },
}