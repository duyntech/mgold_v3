class SupplierModel {
    id: string
    code: string
    name: string
    standard: string
    address: string
    tax_code:string
    phone:string
    active: boolean
    disabled:boolean
    constructor(
        id: string, 
        code: string, 
        name: string, 
        standard: string,
        address: string,
        tax:string,
        phone:string,
        active: boolean,
        disabled:boolean
    ) {
      this.id = id
      this.code = code
      this.name = name
      this.standard = standard
      this.address=address
      this.tax_code=tax
      this.phone=phone
      this.active = active  
      this.disabled = disabled
    }
    static initial(){
        return {
            id:'',
            code:'',
            name:'',
            standard: '',
            address: '',
            tax_code:'',
            phone:'',
            active:false,
            disabled:false
        }
    }
  }
  export {SupplierModel}
  