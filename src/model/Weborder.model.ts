import { weborderStatues } from "../types"
import { ProductModel } from "./Product.model"
import { ProfileModel } from "./Profile.model"
class WeborderModel{
    id:string
    code:string
    customer:ProfileModel
    orderDate:string
    products:ProductModel[]
    receiverInfos:any
    paymentMethod:string
    voucher:string
    deliveryCode:string
    deliveryFee:number
    value:number
    discount:number
    amount:number
    paymentDetail:WeborderPaymentModel[]
    cancelReason:string
    cancelInfos:string
    status:weborderStatues
    active:boolean
    disabled:boolean
    constructor(
        id:string,
        code:string,
        customer:ProfileModel,
        orderDate:string,
        products:ProductModel[],
        receiverInfos:any,
        paymentMethod:string,
        voucher:string,
        deliveryCode:string,
        deliveryFee:number,
        value:number,
        discount:number,
        amount:number,
        paymentDetail:WeborderPaymentModel[],
        cancelReason:string,
        cancelInfos:string,
        status:weborderStatues,
        active:boolean,
        disabled:boolean
        ) {
        this.id=id
        this.code=code
        this.customer=customer
        this.orderDate=orderDate
        this.products=products
        this.receiverInfos=receiverInfos
        this.paymentMethod=paymentMethod
        this.voucher=voucher,
        this.deliveryCode=deliveryCode,
        this.deliveryFee=deliveryFee,
        this.value=value,
        this.discount=discount
        this.amount=amount
        this.paymentDetail=paymentDetail
        this.cancelReason=cancelReason,
        this.cancelInfos=cancelInfos,
        this.status=status,
        this.active=active
        this.disabled=disabled
    }
    static initial() {
        return {
            id:'',
            code:'',
            customer:ProfileModel.initial(),
            orderDate:'',
            products:[] as ProductModel[],
            receiverInfos:{},
            paymentMethod:'',
            voucher:'',
            deliveryCode:'',
            deliveryFee:0,
            value:0,
            discount:0,
            amount:0,
            paymentDetail:[] as WeborderPaymentModel[],
            cancelReason:'',
            cancelInfos:'',
            status:undefined,
            active:false,
            disabled:false
        }
    }
}
class WeborderPaymentModel{
    dateTime:string
    bankAccount:string
    type:string
    from:string
    value:number
    content:string
    active:boolean
    disabled:boolean
    constructor(dateTime:string,
        bankAccount:string,
        type:string,
        from:string,
        value:number,
        content:string,
        active:boolean,
        disabled:boolean){
            this.dateTime=dateTime,
            this.bankAccount=bankAccount,
            this.type=type,
            this.from=from,
            this.value=value,
            this.content=content,
            this.active=active,
            this.disabled=disabled
        }
    static initial(){
        return {
            dateTime:'',
            bankAccount:'115000106912',
            type:'RECEIVE',
            from:'',
            value:0,
            content:'',
            active:false,
            disabled:false
        }
    }
}
export {WeborderModel,WeborderPaymentModel}