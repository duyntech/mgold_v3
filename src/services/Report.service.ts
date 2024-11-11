import { ProductTypeModel } from "../model";
import { dateDetail, dateStringToDate, deepCloneObject, uniqueArray } from "../utils/util";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";

export const ReportService = {
    revenueByMonths(data:any){
        const {news,retails}=data
        let list:{month:string,wage:number,amount:number,gold:number,discount:number}[]=[]
        if(news.length>0){
            let months=news.map((e: { month: number; year: number; })=>e.month+'-'+e.year)
            months=months.filter(uniqueArray)
            for (let index = 0; index < months.length; index++) {
                const element = months[index];
                const month=element.split("-")
                const records=news.filter((e: { month: number; year: number; })=>e.month===Number(month[0])&&e.year===Number(month[1]))
                const retailRecords=retails.filter((e: { month: number; year: number; })=>e.month===Number(month[0])&&e.year===Number(month[1]))
                const wageTotal=records.reduce((sum: number,el: { wage: number; stone_value: number; })=>sum+=el.wage+el.stone_value,0)
                const amountTotal=records.reduce((sum: number,el: { amount: number; })=>sum+=el.amount,0)
                const discountTotal=records.reduce((sum: number,el: { discount: number; })=>sum+=el.discount,0)+retailRecords.reduce((sum: number,el: { discount_value: number; })=>sum+=el.discount_value,0)
                list.push({
                    month:element,
                    wage:wageTotal,
                    amount:amountTotal,
                    gold:amountTotal-wageTotal+discountTotal,
                    discount:discountTotal
                })
            }
        }
        return list
    },
    percentTags(data:any[]){
        let list:{type:string,quantity:number,weight:number,amount:number}[]=[]
        if(data.length>0){
            let tags:string[]=[]
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if(element.tags&&element.tags.length>0){
                    const t=element.tags.filter((e: string)=>e!=="")
                    tags=[...tags,...t]
                }
            }
            tags=tags.filter(uniqueArray)
            
            const quantityNoTags=data.filter(e=>e.tags&&(e.tags.length===0||(e.tags.length===1&&e.tags[0]===""))).length
            const weightNoTags=quantityNoTags>0?data.filter(e=>e.tags&&(e.tags.length===0||(e.tags.length===1&&e.tags[0]===""))).reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0):0
            const amountNoTags=quantityNoTags>0?data.filter(e=>e.tags&&(e.tags.length===0||(e.tags.length===1&&e.tags[0]===""))).reduce((sum,el)=>sum+=el.amount,0):0
            for (let index = 0; index < tags.length; index++) {
                const element = tags[index];
                const records=data.filter(e=>e.tags&&e.tags.includes(element))
                list.push({
                    type:element,
                    quantity:records.length,
                    weight:records.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0),
                    amount:records.reduce((sum,el)=>sum+=el.amount,0)
                })
            }
            const quantityTags=list.reduce((sum,el)=>sum+=el.quantity,0)
            const weightTags=list.reduce((sum,el)=>sum+=el.weight,0)
            const amountTags=list.reduce((sum,el)=>sum+=el.amount,0)
            const quantityTotal=quantityNoTags+quantityTags
            const weightTotal=weightNoTags+weightTags
            const amountTotal=amountNoTags+amountTags
            let update=deepCloneObject(list)
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                update[index].quantity=Number(((element.quantity/quantityTotal)*100).toFixed(2))
                update[index].weight=Number(((element.weight/weightTotal)*100).toFixed(2))
                update[index].amount=Number(((element.amount/amountTotal)*100).toFixed(2))
                
            }
            if(quantityNoTags>0){
                update.push({
                    type:"No tag",
                    quantity:Number(((quantityNoTags/quantityTotal)*100).toFixed(2)),
                    weight:Number(((weightNoTags/weightTotal)*100).toFixed(2)),
                    amount:Number(((amountNoTags/amountTotal)*100).toFixed(2))
                })
            }
            list=update
        }
        return list
    },
    percentProductTypes(data:any[],types:ProductTypeModel[],level:number){
        let list:{type:string,quantity:number,weight:number,amount:number}[]=[]
        if(data.length>0){
            const quantityTotal=data.length
            const amountTotal=data.reduce((sum,el)=>sum+=el.amount,0)
            const weightTotal=data.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0)
            const levelOneTypes=types.filter(e=>!e.id_parent)
            const levelTwoTypes=types.filter(e=>e.id_parent&&levelOneTypes.find(i=>i._id===e.id_parent))
            const levelThreeTypes=types.filter(e=>e.id_parent&&levelTwoTypes.find(i=>i._id===e.id_parent))
            let sumQty=0
            let sumAmt=0
            let sumWet=0
            switch (level) {
                case 0:
                    let productTypes=data.map((e)=>e.product.product_type)
                    productTypes=productTypes.filter(uniqueArray)
                    for (let index = 0; index < productTypes.length; index++) {
                        const element = productTypes[index];
                        const records=data.filter(e=>e.product.product_type===element)
                        list.push({
                            type:element,
                            quantity:records.length,
                            weight:records.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75: el.final_weight),0),
                            amount:records.reduce((sum,el)=>sum+=el.amount,0)
                        })
                    }
                    break
                case 1:
                    for (let index = 0; index < levelOneTypes.length; index++) {
                        const levelOne = levelOneTypes[index];
                        const recordsByOne=data.filter(e=>e.product&&e.product.product_type===levelOne.code)
                        const levelTwoIds=levelTwoTypes.filter(e=>e.id_parent===levelOne._id).map((e)=>e._id)
                        const levelTwoCodes=levelTwoTypes.filter(e=>e.id_parent===levelOne._id).map((e)=>e.code)
                        const recordsByTwo=data.filter(e=>e.product&&levelTwoCodes.includes(e.product.product_type))
                        const levelThreeCodes=levelThreeTypes.filter(e=>levelTwoIds.includes(e.id_parent)).map((e)=>e.code)
                        const recordsByThree=data.filter(e=>e.product&&levelThreeCodes.includes(e.product.product_type))
                        const quantity=recordsByOne.length+recordsByTwo.length+recordsByThree.length
                        const weight=recordsByOne.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0)+recordsByTwo.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0)+recordsByThree.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0)
                        const amount=recordsByOne.reduce((sum,el)=>sum+=el.amount,0)+recordsByTwo.reduce((sum,el)=>sum+=el.amount,0)+recordsByThree.reduce((sum,el)=>sum+=el.amount,0)
                        sumQty+=quantity
                        sumAmt+=amount
                        sumWet+=weight
                        if(quantity>0||weight>0||amount>0){
                            list.push({
                                type:levelOne.code,
                                quantity:Number(((quantity/quantityTotal)*100).toFixed(2)),
                                weight:Number(((weight/weightTotal)*100).toFixed(2)),
                                amount:Number(((amount/amountTotal)*100).toFixed(2))
                            })
                        }
                    }
                    if(quantityTotal>sumQty){
                        list.push({
                            type:"Khác",
                            quantity:Number((((quantityTotal-sumQty)/quantityTotal)*100).toFixed(2)),
                            weight:Number((((weightTotal-sumWet)/weightTotal)*100).toFixed(2)),
                            amount:Number((((amountTotal-sumAmt)/amountTotal)*100).toFixed(2))
                        })
                    }
                    break;
                case 2:
                    for (let index = 0; index < levelTwoTypes.length; index++) {
                        const levelTwo = levelTwoTypes[index];
                        const recordsByTwo=data.filter(e=>e.product&&e.product.product_type===levelTwo.code)
                        const levelThreeCodes=levelTwoTypes.filter(e=>e.id_parent===levelTwo._id).map((e)=>e.code)
                        const recordsByThree=data.filter(e=>e.product&&levelThreeCodes.includes(e.product.product_type))
                        const quantity=recordsByTwo.length+recordsByThree.length
                        const weight=recordsByTwo.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0)+recordsByThree.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0)
                        const amount=recordsByTwo.reduce((sum,el)=>sum+=el.amount,0)+recordsByThree.reduce((sum,el)=>sum+=el.amount,0)
                        sumQty+=quantity
                        sumAmt+=amount
                        sumWet+=weight
                        if(quantity>0||weight>0||amount>0){
                            list.push({
                                type:levelTwo.code,
                                quantity:Number(((quantity/quantityTotal)*100).toFixed(2)),
                                weight:Number(((weight/weightTotal)*100).toFixed(2)),
                                amount:Number(((amount/amountTotal)*100).toFixed(2))
                            })
                        }
                    }
                    if(quantityTotal>sumQty){
                        list.push({
                            type:"Khác",
                            quantity:Number((((quantityTotal-sumQty)/quantityTotal)*100).toFixed(2)),
                            weight:Number((((weightTotal-sumWet)/weightTotal)*100).toFixed(2)),
                            amount:Number((((amountTotal-sumAmt)/amountTotal)*100).toFixed(2))
                        })
                    }
                    break;
                case 3:
                    for (let index = 0; index < levelThreeTypes.length; index++) {
                        const levelThree = levelThreeTypes[index];
                        const recordsByThree=data.filter(e=>e.product&&e.product.product_type===levelThree.code)
                        
                        const quantity=recordsByThree.length
                        const weight=recordsByThree.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0)
                        const amount=recordsByThree.reduce((sum,el)=>sum+=el.amount,0)
                        sumQty+=quantity
                        sumAmt+=amount
                        sumWet+=weight
                        if(quantity>0||weight>0||amount>0){
                            list.push({
                                type:levelThree.code,
                                quantity:Number(((quantity/quantityTotal)*100).toFixed(2)),
                                weight:Number(((weight/weightTotal)*100).toFixed(2)),
                                amount:Number(((amount/amountTotal)*100).toFixed(2))
                            })
                        }
                    }
                    if(quantityTotal>sumQty){
                        list.push({
                            type:"Khác",
                            quantity:Number((((quantityTotal-sumQty)/quantityTotal)*100).toFixed(2)),
                            weight:Number((((weightTotal-sumWet)/weightTotal)*100).toFixed(2)),
                            amount:Number((((amountTotal-sumAmt)/amountTotal)*100).toFixed(2))
                        })
                    }
                    break;
            }
        }
        return list
    },
    percentGoldTypes(data:any[]){
        let list:{type:string,quantity:number,weight:number,amount:number}[]=[]
        if(data.length>0){
            let goldTypes=data.map((e)=>e.gold_type)
            goldTypes=goldTypes.filter(uniqueArray)
            const quantityTotal=data.length
            const amountTotal=data.reduce((sum,el)=>sum+=el.amount,0)
            for (let index = 0; index < goldTypes.length; index++) {
                const element = goldTypes[index];
                const records=data.filter(e=>e.gold_type===element)
                list.push({
                    type:element,
                    quantity:Number(((records.length/quantityTotal)*100).toFixed(2)),
                    weight:0,
                    amount:Number(((records.reduce((sum,el)=>sum+=el.amount,0)/amountTotal)*100).toFixed(2))
                })
            }
        }
        return list
    },
    sellGroupByGoldType(data:any[],types:ProductTypeModel[],type:string,level:number){
        let list:{type:string,quantity:number,weight:number,amount:number}[]=[]
        if(data.length>0){
            if(type==="GOLDTYPE"){
                let goldTypes=data.map((e)=>e.gold_type)
                goldTypes=goldTypes.filter(uniqueArray)
                for (let index = 0; index < goldTypes.length; index++) {
                    const element = goldTypes[index];
                    const records=data.filter(e=>e.gold_type===element)
                    list.push({
                        type:element,
                        quantity:records.length,
                        weight:records.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75: el.final_weight),0),
                        amount:records.reduce((sum,el)=>sum+=el.amount,0)
                    })
                }
            }
            else{
                const quantityTotal=data.length
                const amountTotal=data.reduce((sum,el)=>sum+=el.amount,0)
                const weightTotal=data.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0)
                const levelOneTypes=types.filter(e=>!e.id_parent)
                const levelTwoTypes=types.filter(e=>e.id_parent&&levelOneTypes.find(i=>i._id===e.id_parent))
                const levelThreeTypes=types.filter(e=>e.id_parent&&levelTwoTypes.find(i=>i._id===e.id_parent))
                let sumQty=0
                let sumAmt=0
                let sumWet=0
                switch (level) {
                    case 0:
                        let productTypes=data.map((e)=>e.product.product_type)
                        productTypes=productTypes.filter(uniqueArray)
                        for (let index = 0; index < productTypes.length; index++) {
                            const element = productTypes[index];
                            const records=data.filter(e=>e.product.product_type===element)
                            list.push({
                                type:element,
                                quantity:records.length,
                                weight:records.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75: el.final_weight),0),
                                amount:records.reduce((sum,el)=>sum+=el.amount,0)
                            })
                        }
                        break
                    case 1:
                        for (let index = 0; index < levelOneTypes.length; index++) {
                            const levelOne = levelOneTypes[index];
                            const recordsByOne=data.filter(e=>e.product&&e.product.product_type===levelOne.code)
                            const levelTwoIds=levelTwoTypes.filter(e=>e.id_parent===levelOne._id).map((e)=>e._id)
                            const levelTwoCodes=levelTwoTypes.filter(e=>e.id_parent===levelOne._id).map((e)=>e.code)
                            const recordsByTwo=data.filter(e=>e.product&&levelTwoCodes.includes(e.product.product_type))
                            const levelThreeCodes=levelThreeTypes.filter(e=>levelTwoIds.includes(e.id_parent)).map((e)=>e.code)
                            const recordsByThree=data.filter(e=>e.product&&levelThreeCodes.includes(e.product.product_type))
                            const quantity=recordsByOne.length+recordsByTwo.length+recordsByThree.length
                            const weight=recordsByOne.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0)+recordsByTwo.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0)+recordsByThree.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0)
                            const amount=recordsByOne.reduce((sum,el)=>sum+=el.amount,0)+recordsByTwo.reduce((sum,el)=>sum+=el.amount,0)+recordsByThree.reduce((sum,el)=>sum+=el.amount,0)
                            sumQty+=quantity
                            sumAmt+=amount
                            sumWet+=weight
                            if(quantity>0||weight>0||amount>0){
                                list.push({
                                    type:levelOne.code,
                                    quantity:quantity,
                                    weight:weight,
                                    amount:amount
                                })
                            }
                        }
                        if(quantityTotal>sumQty){
                            list.push({
                                type:"Khác",
                                quantity:quantityTotal-sumQty,
                                weight:weightTotal-sumWet,
                                amount:amountTotal-sumAmt
                            })
                        }
                        break;
                    case 2:
                        for (let index = 0; index < levelTwoTypes.length; index++) {
                            const levelTwo = levelTwoTypes[index];
                            const recordsByTwo=data.filter(e=>e.product&&e.product.product_type===levelTwo.code)
                            const levelThreeCodes=levelTwoTypes.filter(e=>e.id_parent===levelTwo._id).map((e)=>e.code)
                            const recordsByThree=data.filter(e=>e.product&&levelThreeCodes.includes(e.product.product_type))
                            const quantity=recordsByTwo.length+recordsByThree.length
                            const weight=recordsByTwo.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0)+recordsByThree.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0)
                            const amount=recordsByTwo.reduce((sum,el)=>sum+=el.amount,0)+recordsByThree.reduce((sum,el)=>sum+=el.amount,0)
                            sumQty+=quantity
                            sumAmt+=amount
                            sumWet+=weight
                            if(quantity>0||weight>0||amount>0){
                                list.push({
                                    type:levelTwo.code,
                                    quantity:quantity,
                                    weight:weight,
                                    amount:amount
                                })
                            }
                        }
                        if(quantityTotal>sumQty){
                            list.push({
                                type:"Khác",
                                quantity:quantityTotal-sumQty,
                                weight:weightTotal-sumWet,
                                amount:amountTotal-sumAmt
                            })
                        }
                        break;
                    case 3:
                        for (let index = 0; index < levelThreeTypes.length; index++) {
                            const levelThree = levelThreeTypes[index];
                            const recordsByThree=data.filter(e=>e.product&&e.product.product_type===levelThree.code)
                            
                            const quantity=recordsByThree.length
                            const weight=recordsByThree.reduce((sum,el)=>sum+=(el.unit==="GRAM"?el.final_weight/3.75:el.final_weight),0)
                            const amount=recordsByThree.reduce((sum,el)=>sum+=el.amount,0)
                            sumQty+=quantity
                            sumAmt+=amount
                            sumWet+=weight
                            if(quantity>0||weight>0||amount>0){
                                list.push({
                                    type:levelThree.code,
                                    quantity:quantity,
                                    weight:weight,
                                    amount:amount
                                })
                            }
                            
                        }
                        if(quantityTotal>sumQty){
                            list.push({
                                type:"Khác",
                                quantity:quantityTotal-sumQty,
                                weight:weightTotal-sumWet,
                                amount:amountTotal-sumAmt
                            })
                        }
                        break;
                }
            }
        }
        return list
    },
    buyData(data:any){
        const {olds,retails}=data
        let list:any[]=[]
        for (let index = 0; index < olds.length; index++) {
            const elm = olds[index];
            const retail=retails.find((e: { _id: any; })=>e._id===elm.id_sell)
            if(elm.trading_type==="TRADE"&&elm.sell_type==="EXCHANGE"){
                if(elm.trading_weight===0){
                    const value=(elm.unit==="GRAM"?elm.final_weight*elm.makeup:elm.final_weight*elm.makeup/100)
                    const weight=(elm.unit==="GRAM"?elm.final_weight/3.75:elm.final_weight)
                    list.push({
                        _id:elm._id,
                        date:dateStringToDate(elm.date),
                        invoice:retail&&retail.code,
                        from:'Đổi ngang',
                        gold_type:elm.gold_type,
                        product:elm.name,
                        gold_weight:weight,
                        exchange:elm.makeup,
                        value:value,
                        quantity:0
                    })
                }
                else{
                    const value=(elm.unit==="GRAM"?elm.trading_weight*elm.exchange_rate:elm.trading_weight*(elm.exchange_rate-elm.makeup)/100)

                    const weight=(elm.unit==="GRAM"?elm.trading_weight/3.75:elm.trading_weight)
                    list.push({
                        _id:elm._id,
                        date:dateStringToDate(elm.date),
                        invoice:retail&&retail.code,
                        from:'Đổi ngang',
                        gold_type:elm.gold_type,
                        product:elm.name,
                        gold_weight:weight,
                        exchange:elm.exchange_rate-elm.makeup,
                        value:value,
                        quantity:1
                    })
                }
                
            }
            if(elm.trading_type==="BUY"&&elm.sell_type==="EXCHANGE"||elm.trading_type==="TRADE"&&elm.sell_type==="OLD"){
                const weight=(elm.unit==="GRAM"?elm.final_weight/3.75:elm.final_weight)
                list.push({
                    _id:elm._id,
                    date:dateStringToDate(elm.date),
                    invoice:retail&&retail.code,
                    from:elm.sell_type==="OLD"?"Mua cũ":'Đổi dư',
                    gold_type:elm.gold_type,
                    product:elm.name,
                    gold_weight:weight,
                    exchange:elm.buyin_price,
                    value:elm.amount,
                    quantity:elm.sell_type==="OLD"?1:0
                })
            }
        }
        return list
    },
    buyGroupByGoldType(data:any[]){
        let list:{type:string,quantity:number,weight:number,amount:number}[]=[]
        if(data.length>0){
            let goldTypes=data.map((e)=>e.gold_type)
            goldTypes=goldTypes.filter(uniqueArray)
            for (let index = 0; index < goldTypes.length; index++) {
                const element = goldTypes[index];
                const records=data.filter(e=>e.gold_type===element)
                //console.log(element,records)
                let quantity=0
                let weight=0
                let amount=0
                for (let idx = 0; idx < records.length; idx++) {
                    const elm = records[idx];
                    if(elm.trading_type==="TRADE"){quantity++}
                    if(elm.trading_type==="TRADE"&&elm.sell_type==="EXCHANGE"){
                        const value=(elm.unit==="GRAM"?elm.trading_weight*elm.exchange_rate:elm.trading_weight*(elm.exchange_rate-elm.makeup)/100)
                        //console.log("TRADE-EXCHANGE",elm,value)
                        weight+=(elm.unit==="GRAM"?elm.trading_weight/3.75:elm.trading_weight)
                        amount+=value
                    }
                    if(elm.trading_type==="BUY"&&elm.sell_type==="EXCHANGE"||elm.trading_type==="TRADE"&&elm.sell_type==="OLD"){
                        //console.log("BUY-EXCHANGE",elm,elm.amount)
                        weight+=(elm.unit==="GRAM"?elm.final_weight/3.75:elm.final_weight)
                        amount+=elm.amount
                    }
                }
                list.push({
                    type:element,
                    quantity:quantity,
                    weight:weight,
                    amount:amount
                })
            }
        }
        return list
    },
    retailRevenuesFromDetails(data:any){
        const {news,olds,retails}=data
        const monthFromNews=news.map((e: { month: number; year: number; })=>e.month+'-'+e.year)
        const monthFromOlds=olds.map((e: { month: number; year: number; })=>e.month+'-'+e.year)
        let months=[...monthFromNews,...monthFromOlds]
        months=months.filter(uniqueArray)
        let list:{month:string,website:number,sell:number,buy:number,exchange:number}[]=[]
        for (let index = 0; index < months.length; index++) {
            const element = months[index];
            const month=element.split("-")
            const newRecords=news.filter((e: { month: number; year: number; })=>e.month===Number(month[0])&&e.year===Number(month[1]))
            const retailRecords=retails.filter((e: { month: number; year: number; })=>e.month===Number(month[0])&&e.year===Number(month[1]))
            let buyValue=0
            let exchangeValue=0
            let newValue=0
            for (let idx = 0; idx < retailRecords.length; idx++) {
                const elm = retailRecords[idx];
                newValue+=elm.new_value
                buyValue+=elm.old_value
                exchangeValue+=elm.exchange_value
            }
            list.push(
                {
                    month:element,
                    website:newRecords.filter((e: { from: string; })=>e.from==="ONLINE").reduce((sum: number,el: { amount: number; })=>sum+=el.amount,0),
                    sell:newValue,
                    buy:buyValue,
                    exchange:exchangeValue
                }
            )
        }
        return list
    },
    retailRevenuesFromJson(data:any){
        const {retails,webs,year}=data
        const retailsOfYear:{_id:string,final_value:number,day:number,week:number,month:number,year:number}[]=year.retails??[]
        const websOfYear:{_id:string,final_value:number,day:number,week:number,month:number,year:number}[]=year.webs??[]
        const curr=new Date()
        const dateInfos=dateDetail(curr)
        let websites:number[]=[]
        let sells:number[]=[]
        let buys:number[]=[]
        let exchanges:number[]=[]
        for (let index = 1; index <= 12; index++) {
            const retail=retails.find((e: { _id: number; })=>e._id===index)
            const web=webs.find((e: { _id: number; })=>e._id===index)
            sells.push(retail?retail.new_value/1000000:0)
            buys.push(retail?retail.old_value/1000000:0)
            exchanges.push(retail?retail.exchange_value/1000000:0)
            websites.push(web?web.amount/1000000:0)
        }
        const recordRetailsByDate=retailsOfYear.filter(e=>e.day===curr.getDate()&&e.month===curr.getMonth()+1&&e.year===curr.getFullYear())
        const recordWebsByDate=websOfYear.filter(e=>e.day===curr.getDate()&&e.month===curr.getMonth()+1&&e.year===curr.getFullYear())

        const recordRetailsByWeek=retailsOfYear.filter(e=>e.week===dateInfos.week)
        const recordWebsByWeek=websOfYear.filter(e=>e.week===dateInfos.week)

        const recordRetailsByMonth=retailsOfYear.filter(e=>e.month===curr.getMonth()+1)
        const recordWebsByMonth=websOfYear.filter(e=>e.month===curr.getMonth()+1)

        const revenueByDate=(recordRetailsByDate.length>0?recordRetailsByDate.reduce((sum,el)=>sum+=el.final_value,0):0)+(recordWebsByDate.length>0?recordWebsByDate.reduce((sum,el)=>sum+=el.final_value,0):0)
        const revenueByWeek=(recordRetailsByWeek.length>0?recordRetailsByWeek.reduce((sum,el)=>sum+=el.final_value,0):0)+(recordWebsByWeek.length>0?recordWebsByWeek.reduce((sum,el)=>sum+=el.final_value,0):0)
        const revenueByMonth=(recordRetailsByMonth.length>0?recordRetailsByMonth.reduce((sum,el)=>sum+=el.final_value,0):0)+(recordWebsByMonth.length>0?recordWebsByMonth.reduce((sum,el)=>sum+=el.final_value,0):0)
        const revenueByYear=(retailsOfYear.length>0?retailsOfYear.reduce((sum,el)=>sum+=el.final_value,0):0)+(websOfYear.length>0?websOfYear.reduce((sum,el)=>sum+=el.final_value,0):0)
        return {
            year:{date:revenueByDate,week:revenueByWeek,month:revenueByMonth,year:revenueByYear},
            websites,
            sells,
            buys,
            exchanges
        }
    },
    async retailStatistic(data: any) {
        const response = await HttpService.doGetRequest("v1/report/retail/statistic", data);
        return parseCommonHttpResult(response);
    },
    async retailRevenue(data: any) {
        const response = await HttpService.doGetRequest("v1/report/retail/revenue", data);
        return parseCommonHttpResult(response);
    },
    async retailRevenueDetail(data: any) {
        const response = await HttpService.doPostRequest("v1/report/retail/revenue", data);
        return parseCommonHttpResult(response);
    },
};
