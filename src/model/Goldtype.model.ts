import { goldtypeOperators } from "../types"

class GoldtypeModel {
    id: string
    code: string
    name: string
    unit:string
    age:number
    buyRate:number
    changeRate:number
    buyPriceRecipe:string
    buyPriceFromType:string
    buyPriceOperator:goldtypeOperators
    buyPriceRate:number
    buyPrice:number
    sellPriceRecipe:string
    sellPriceFromType:string
    sellPriceOperator:goldtypeOperators
    sellPriceRate:number
    sellPrice:number
    compensation:number
    invoice:boolean
    online:boolean
    screen:boolean
    tags:string[]
    weightCustomName?:string
    active:boolean
    disabled:boolean
    constructor(
        id: string,
        code: string,
        name: string,
        unit:string,
        age:number,
        buyRate:number,
        changeRate:number,
        buyPriceRecipe:string,
        buyPriceFromType:string,
        buyPriceOperator:goldtypeOperators,
        buyPriceRate:number,
        buyPrice:number,
        sellPriceRecipe:string,
        sellPriceFromType:string,
        sellPriceOperator:goldtypeOperators,
        sellPriceRate:number,
        sellPrice:number,
        compensation:number,
        invoice:boolean,
        online:boolean,
        screen:boolean,
        tags:string[],
        weightCustomName:string,
        active:boolean,
        disabled:boolean,
    ){
        this.id=id,
        this.code=code,
        this.name=name,
        this.unit=unit,
        this.age=age,
        this.buyRate=buyRate,
        this.changeRate=changeRate,
        this.buyPriceRecipe = buyPriceRecipe,
        this.buyPriceFromType=buyPriceFromType,
        this.buyPriceOperator=buyPriceOperator,
        this.buyPriceRate=buyPriceRate,
        this.buyPrice=buyPrice,
        this.sellPriceRecipe= sellPriceRecipe,
        this.sellPriceFromType=sellPriceFromType,
        this.sellPriceOperator=sellPriceOperator,
        this.sellPriceRate=sellPriceRate,
        this.sellPrice=sellPrice,
        this.compensation=compensation,
        this.invoice=invoice,
        this.online=online,
        this.screen=screen,
        this.tags=tags,
        this.weightCustomName=weightCustomName,
        this.active=active,
        this.disabled=disabled
    }
    static initial(){
        return {
            id:'',
            code:'',
            name:'',
            unit:'CHI',
            age:0,
            buyRate:100,
            changeRate:100,
            buyPriceRecipe:'FIXED',
            buyPriceFromType:'',
            buyPriceOperator:'' as goldtypeOperators,
            buyPriceRate:0,
            buyPrice:0,
            sellPriceRecipe:'FIXED',
            sellPriceFromType:'',
            sellPriceOperator:'' as goldtypeOperators,
            sellPriceRate:0,
            sellPrice:0,
            compensation: 0,
            invoice:true,
            online:false,
            screen:false,
            tags:[],
            weightCustomName:undefined,
            active:false,
            disabled:false
        }
    }
}
export {GoldtypeModel}