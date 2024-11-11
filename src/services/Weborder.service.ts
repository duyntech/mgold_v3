import { ProductModel, WeborderModel } from "../model"
import { formatDateToFormatString } from "../utils/util"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"

export const WeborderService = {
    activeIfSelectAndDeactiveOthers(id: string, list: WeborderModel[]){
        list.forEach((item, idx) => {
            if (item.id !==id ) {
            list[idx].active = false
            }
            else{
                list[idx].active = true
                }
            })
        return list
    },
    itemFromJson(data:any){
        const fullName=data.customer!==undefined?(data.customer["full_name"]!==null&&data.customer["full_name"]!==undefined?data.customer["full_name"]: data.customer["last_name"]+' '+data.customer["first_name"]):''
        const item={
            id:data._id,
            code:data.code,
            customer:{
                id:data.customer["_id"],
                username:"",
                firstName:data.customer["first_name"],
                lastName:data.customer["last_name"],
                fullName:fullName,
                filterName:data.customer["phone"]!==undefined&&data.customer["phone"]!==null?data.customer["phone"] + ' - '+fullName :fullName,
                role:{_id:'',code:'',name:''},
                birthDate:"",
                phone:data.customer["phone"],
                email:data.customer["email"],
                address:data.customer["address"],
                isAdmin:false,
                active:false,
                disabled:false,
                isOnline:false,
                personalCard:data.customer["personal_card"],
                personalCardImage:data.customer["personal_card_image"],
                ipAddress:'',
                province: data.customer["province"],
                district: data.customer["district"],
                ward: data.customer["ward"],
                expireTime: 0,
                accessTime: 0,
                status:"VERIRY"
            },
            orderDate:formatDateToFormatString(data.createdAt,"DD-MM-YYYY HH:mm"),
            products:data.products,
            receiverInfos:data.receiver_infos,
            paymentMethod:data.payment_method,
            voucher:data.voucher,
            deliveryCode:data.delivery_code,
            deliveryFee:data.delivery_fee??0,
            value:data.value??0,
            discount:data.discount??0,
            amount:(data.value??0)+(data.delivery_fee??0)-(data.discount??0),
            paymentDetail:data.payment_info??[],
            cancelReason:data.cancel_reson,
            cancelInfos:data.cancel_infos??'',
            status:data.order_status,
            active:false,
            disabled:data.status==="ACTIVE"?false:true
        }
        return item
    },
    listFromJson(data:any){
        //console.log(data)
        let list:WeborderModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            let products:ProductModel[]=[]
            for (let index = 0; index < element.products.length; index++) {
                const e = element.products[index];
                products.push({
                    _id:e._id,
                    code:e.code,
                    name:e.name,
                    counter:e.counter,
                    product_type:e.product_type,
                    supplier:e.supplier,
                    gold_type:e.gold_type,
                    images:e.images,
                    tags:e.tags,
                    unit:e.unit,
                    weight:e.weight,
                    stone:e.stone,
                    gold_weight:e.gold_weight,
                    ni_weight:0,
                    final_weight:0,
                    age:e.age,
                    exchange_rate:e.exchange_rate,
                    wage:e.wage,
                    root_wage:e.root_wage,
                    stone_value:e.stone_value,
                    discount:e.discount,
                    amount:e.amount,
                    active:false,
                    is_online:false,
                    is_new:false,
                    is_hot:false,
                    fixed_price:e.fixed_price,
                    date:'',
                    status:e.status,
                    buyin_rate:e.current_goldtype!==undefined&&e.current_goldtype!==null?e.current_goldtype["buy_rate"]:100,
                    trading_rate:e.current_goldtype!==undefined&&e.current_goldtype!==null?e.current_goldtype["change_rate"]:100
                })
            }
            const fullName=element.customer!==undefined?(element.customer["full_name"]!==null&&element.customer["full_name"]!==undefined?element.customer["full_name"]: element.customer["last_name"]+' '+element.customer["first_name"]):''
            list.push(
                {
                    id:element._id,
                    code:element.code,
                    customer:{
                        id: element.customer !== undefined ? element.customer["_id"] : '',
                        username: "",
                        firstName: element.customer !== undefined ? element.customer["first_name"] : '',
                        lastName: element.customer !== undefined ? element.customer["last_name"] : '',
                        fullName: fullName,
                        filterName: element.customer !== undefined ? element.customer["phone"] !== undefined && element.customer["phone"] !== null ? element.customer["phone"] + ' - ' + fullName : fullName : '',
                        role: { _id: '', code: '', name: '' },
                        birthDate: "",
                        phone: element.customer !== undefined ? element.customer["phone"] : '',
                        email: element.customer !== undefined ? element.customer["email"] : '',
                        address: element.customer !== undefined ? element.customer["address"] : '',
                        isAdmin: false,
                        active: false,
                        disabled: false,
                        isOnline: false,
                        ipAddress: '',
                        personalCard: "",
                        personalCardImage: "",
                        province: element.customer["province"],
                        district: element.customer["district"],
                        ward: element.customer["ward"],
                        expireTime: 0,
                        accessTime: 0,
                        status:"VERIRY"
                    },
                    orderDate:formatDateToFormatString(element.createdAt,"DD-MM-YYYY HH:mm"),
                    products:products,
                    receiverInfos:element.receiver_infos,
                    paymentMethod:element.payment_method,
                    voucher:element.voucher,
                    deliveryCode:element.delivery_code,
                    deliveryFee:element.delivery_fee??0,
                    value:element.value??0,
                    discount:element.discount??0,
                    amount:(element.value??0)+(element.delivery_fee??0)-(element.discount??0),
                    paymentDetail:element.payment_info??[],
                    cancelReason:element.cancel_reson,
                    cancelInfos:element.cancel_infos??'',
                    status:element.order_status,
                    active:false,
                    disabled:element.status==="ACTIVE"?false:true
                }
            )
        }
        return list
    },
    async deliveringItem(data:any){
        const response = await HttpService.doPostRequest('v1/weborder/delivery', data)
        return parseCommonHttpResult(response)
    },
    async completeItem(data:any){
        const response = await HttpService.doPutRequest('v1/weborder/delivery', data)
        return parseCommonHttpResult(response)
    },
    async cancelItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/weborder', data)
        return parseCommonHttpResult(response)
    },
    async confirmItem(data:any){
        const response = await HttpService.doPostRequest('v1/weborder/confirm', data)
        return parseCommonHttpResult(response)
    },
    async addItem(data: any) {
        const response = await HttpService.doPostRequest("v1/weborder", data, true);
        return parseCommonHttpResult(response);
    },
    async editItem(data:any){
        const response = await HttpService.doPutRequest('v1/weborder', data)
        return parseCommonHttpResult(response)
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/weborder', data)
        return parseCommonHttpResult(response)
    },
}