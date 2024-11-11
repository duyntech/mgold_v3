import { NewTradingDetail } from "../types"
import { OldProductModel, ProductModel } from "./Product.model"
import { ProfileModel } from "./Profile.model"

class RetailModel{
    id:string
    code:string
    customer:ProfileModel
    orderDatetime:string
    newProduct:number
    exchangeProduct:number
    oldProduct:number
    discount:number
    amount:number
    active:boolean
    newList:ProductModel[]
    newTradingDetails:NewTradingDetail[]
    oldList:OldProductModel[]
    exchangeNewList:ProductModel[]
    exchangeOldList:OldProductModel[]
    exchangeResList:OldProductModel[]
    paymentType:string
    hasInvoice:boolean
    createUser:string
    disabled:boolean
    constructor(
        id:string,
        code:string,
        customer:ProfileModel,
        orderDatetime:string,
        newProduct:number,
        exchangeProduct:number,
        oldProduct:number,
        discount:number,
        amount:number,
        active:boolean,
        newList:ProductModel[],
        newTradingDetails:NewTradingDetail[],
        oldList:OldProductModel[],
        exchangeNewList:ProductModel[],
        exchangeOldList:OldProductModel[],
        exchangeResList:OldProductModel[],
        paymentType:string,
        hasInvoice:boolean,
        createUser:string,
        disabled:boolean
        ) {
        this.id=id
        this.code=code
        this.customer=customer
        this.orderDatetime=orderDatetime
        this.newProduct=newProduct
        this.exchangeProduct=exchangeProduct
        this.oldProduct=oldProduct
        this.discount=discount
        this.amount=amount
        this.active=active
        this.newList=newList
        this.newTradingDetails=newTradingDetails
        this.oldList=oldList
        this.exchangeNewList=exchangeNewList
        this.exchangeOldList=exchangeOldList
        this.exchangeResList=exchangeResList
        this.paymentType=paymentType
        this.hasInvoice=hasInvoice
        this.createUser=createUser
        this.disabled=disabled
    }
    static initial() {
        return {
            id:"",
            code:'',
            customer:ProfileModel.initial(),
            orderDatetime:'',
            newProduct:0,
            exchangeProduct:0,
            oldProduct:0,
            discount:0,
            amount:0,
            active:false,
            newList:[],
            newTradingDetails:[],
            oldList:[],
            exchangeNewList:[],
            exchangeOldList:[],
            exchangeResList:[],
            paymentType:'CASH',
            hasInvoice:false,
            createUser:"",
            disabled:false
        }
    }
}

export {RetailModel}