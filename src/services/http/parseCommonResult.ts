import { AxiosResponse } from 'axios'

export const parseCommonHttpResult = (response: AxiosResponse<any, any>) => {
  if ([200,201,204].includes(response.status)) {
    return {
      code: response.status,
      data: response.data
    }
  } else {
    console.log("Error API call: ",response)
    return {
      code: response.status,
      message: response.statusText
    }
  }
}
