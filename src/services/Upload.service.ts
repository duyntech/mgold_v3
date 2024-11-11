import { HttpService } from './http/HttpService'
import { parseCommonHttpResult } from './http/parseCommonResult'
export const UploadService = {
    async uploadImage(data: any) {
        const response = await HttpService.doPostRequest('v1/upload', data)
        return parseCommonHttpResult(response)
    },
    async deleteImage(data: any) {
        const response = await HttpService.doDeleteRequest('v1/upload', data)
        return parseCommonHttpResult(response)
    }
}
