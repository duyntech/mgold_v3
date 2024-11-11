import { goldtypeOperators } from "../../types"

export const goldGroups=[
    {
        id:'1',
        name:"Vàng 18K",
        goldtypes:['610','680'],
        status:'active',
        active:false,
        disabled:false,
    },
    {
        id:'2',
        name:"Vàng Tây",
        goldtypes:['750'],
        status:'active',
        active:false,
        disabled:false,

    },
    {
        id:'3',
        name:"Vàng 24K",
        goldtypes:['9999'],
        status:'active',
        active:false,
        disabled:true,
    }
]
export const goldTypes=[
    {
        id:'1',
        code:"610",
        name:"610",
        unit:'CHI',
        age:61,
        sellPrice:3500000,
        buyRate:100,
        changeRate:100,
        buyPriceRecipe:'9999',
        buyPriceOperator:'MULTIPLY' as goldtypeOperators,
        buyPriceRate:0,
        buyPrice:3200000,
        sellPriceRecipe:'9999',
        sellPriceOperator:'MULTIPLY' as goldtypeOperators,
        sellPriceRate:0,
        compensation: 100000,
        invoice:false,
        online:true,
        active:false,
        disabled:false
    },
    {
        id:'2',
        code:"680",
        name:"680",
        unit:'CHI',
        age:68,
        buyPrice:3980000,
        sellPrice:4080000,
        buyRate:100,
        changeRate:100,
        buyPriceRecipe:'9999',
        buyPriceOperator:'MULTIPLY' as goldtypeOperators,
        buyPriceRate:0,
        sellPriceRecipe:'9999',
        sellPriceOperator:'MULTIPLY' as goldtypeOperators,
        sellPriceRate:0,
        compensation: 100000,
        invoice:false,
        online:false,
        active:false,
        disabled:false
    },
    {
        id:'3',
        code:"750",
        name:"750",
        unit:'GRAM',
        age:75,
        buyPrice:1140000,
        sellPrice:1500000,
        buyRate:70,
        changeRate:80,
        buyPriceRecipe:'9999',
        buyPriceOperator:'MULTIPLY' as goldtypeOperators,
        buyPriceRate:0,
        sellPriceRecipe:'9999',
        sellPriceOperator:'MULTIPLY' as goldtypeOperators,
        sellPriceRate:0,
        compensation: 0,
        invoice:true,
        online:true,
        active:false,
        disabled:false
    },
    {
        id:'4',
        code:"9999",
        name:"9999",
        unit:'CHI',
        age:99.99,
        buyPrice:5400000,
        sellPrice:5500000,
        buyRate:100,
        changeRate:100,
        buyPriceRecipe:'FIXED',
        buyPriceOperator:'' as goldtypeOperators,
        buyPriceRate:0,
        sellPriceRecipe:'FIXED',
        sellPriceOperator:'' as goldtypeOperators,
        sellPriceRate:0,
        compensation: 0,
        invoice:false,
        online:false,
        active:false,
        disabled:false
    }
]
export const units=[
    {
        code:"LY",
        name:"Li"
    },
    {
        code:"GRAM",
        name:"Gram"
    }
]