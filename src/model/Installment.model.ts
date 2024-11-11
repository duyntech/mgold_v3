import { installmentPeriod } from "../types"

class InstallmentModel {
    id: string
    bank: string
    bank_name: string
    limited_value: number
    other_value: number
    periods:installmentPeriod[]
    is_default:boolean
    active: boolean
    disabled:boolean
    constructor(
        id: string, 
        bank: string,
        bank_name: string,
        limited_value: number,
        other_value: number,
        periods:installmentPeriod[],
        is_default:boolean,
        active: boolean,
        disabled:boolean
    ) {
      this.id = id
      this.bank = bank
      this.bank_name = bank_name
      this.limited_value=limited_value
      this.other_value=other_value
      this.periods = periods
      this.is_default=is_default
      this.active = active  
      this.disabled = disabled
    }
    static initial(){
        return {
            id:'',
            bank:'',
            bank_name:'',
            limited_value:0,
            other_value: 0,
            periods:[],
            is_default:false,
            active:false,
            disabled:false
        }
    }
  }
  export {InstallmentModel}
  