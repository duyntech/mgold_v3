import { ProductModel } from "."

class InventoryModel {
    id: string
    code: string
    creator:string
    date:Date
    goldType: string
    counter: string
    productType:string
    remain:ProductModel[]
    inventoried:ProductModel[]
    active:boolean
    disabled:boolean
    constructor(
        id: string,
        code: string,
        creator:string,
        date:Date,
        goldType: string,
        counter: string,
        productType:string,
        remain:ProductModel[],
        inventoried:ProductModel[],
        active:boolean,
        disabled:boolean
    ){
        this.id=id,
        this.code=code,
        this.creator=creator,
        this.date=date,
        this.goldType=goldType,
        this.productType=productType,
        this.counter=counter,
        this.remain=remain,
        this.inventoried=inventoried,
        this.active=active,
        this.disabled=disabled
    }
    static initial(){
        return {
            id:'',
            code:'',
            creator:'',
            date:new Date(),
            goldType: '',
            counter: '',
            productType:'',
            remain:[],
            inventoried:[],
            active:false,
            disabled:false
        }
    }
}
export {InventoryModel}