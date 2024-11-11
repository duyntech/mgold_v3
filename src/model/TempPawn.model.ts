class TempPawnModel {
    id: string
    date: Date
    liquidDate:Date|null
    redeemDate:Date|null
    code: string
    customer:string
    personalId:string
    phone:string
    province:string
    ward:string
    district:string
    address:string
    product:string
    value:number
    productType:string
    note: string
    extend_records:any[]
    status:string
    numbericalOrder:string
    customerId:string
    tags:string[]
    warehouse:string
    createUser:string
    active: boolean
    disabled:boolean
    constructor(
        id: string,
        date: Date,
        liquidDate:Date|null,
        redeemDate:Date|null,
        code: string,
        customer:string,
        phone:string,
        personalId:string,
        province:string,
        ward:string,
        district:string,
        address:string,
        product:string,
        value:number,
        productType:string,
        note: string,
        extend_records:any[],
        status:string,
        createUser:string,
        active: boolean,
        numbericalOrder:string,
        customerId:string,
        tags:string[],
        warehouse:string,
        disabled:boolean,
    ) {
      this.id = id
      this.date = date
      this.liquidDate=liquidDate
      this.redeemDate=redeemDate
      this.code = code
      this.customer = customer
      this.personalId=personalId
      this.phone=phone
      this.province=province
      this.ward=ward
      this.district=district
      this.address=address
      this.product=product
      this.value=value
      this. productType=productType
      this.note=note
      this.extend_records=extend_records
      this.status=status
      this.createUser=createUser
      this.active = active  
      this.numbericalOrder=numbericalOrder
      this.customerId=customerId,
      this.tags=tags,
      this.warehouse=warehouse,
      this.disabled = disabled
    }
    static initial(){
        return {
            id:'',
            date: new Date(),
            liquidDate:null,
            redeemDate:null,
            code: '',
            customer:'',
            personalId:'',
            phone:'',
            province:'',
            ward:'',
            district:'',
            address:'',
            product:'',
            value:0,
            productType:'',
            note: '',
            extend_records:[],
            createUser:'',
            status:'ACTIVE',
            active: false,
            numbericalOrder:'',
            customerId:'',
            tags:[],
            warehouse:'',
            disabled:false
        }
    }
  }
  export {TempPawnModel}
  