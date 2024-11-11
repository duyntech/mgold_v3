
import { t } from "i18next"
import { CashDetailModel } from "../model/CashDetail.model"
import { financeStatus } from "../types"
import { transactionCodes } from "../utils/constants/const"
import { formatDateTimeToFormatString, formatDateToFormatString } from "../utils/util"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"

export const CashDetailService = {
    activeIfSelectAndDeactiveOthers(id: string, list: CashDetailModel[]){
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
    udpateAccountingByIndex(item:CashDetailModel,payload:any){
        const {index,keyName,keyValue}=payload
        let accountings=[...item.accountings]
        let currentAccounting=accountings[index]
        switch (keyName) {
            case "description":
                currentAccounting.description=keyValue
                break;
            case "value":
                currentAccounting.value=keyValue
                break;
            case "credit_object":
                currentAccounting.credit_object=keyValue?._id??null
                switch (item.reason) {
                    case transactionCodes.receiptBank:
                        currentAccounting.credit_object_name=keyValue?.account_number??null
                        break;
                    case transactionCodes.receiptRetail:
                    case transactionCodes.receiptWeborder:
                        currentAccounting.credit_object_name=keyValue?.code??null
                        break;
                }
                break;
            case "debit_object":
                currentAccounting.debit_object=keyValue?._id??null
                switch (item.reason) {
                    case transactionCodes.payslipBank:
                        currentAccounting.debit_object_name=keyValue?.account_number??''
                        break;
                    case transactionCodes.paysliptRetail:
                    case transactionCodes.payslipWeborder:
                        currentAccounting.debit_object_name=keyValue?.code??null
                        break;
                }
                break;
        }
        //console.log({...currentAccounting})
        accountings[index]=currentAccounting
        
        return accountings
    },
    udpateCreditObjectAccountings(item:CashDetailModel){
        let accountings:any[]=[]
        if(item.accountings.length>0){
            for (let index = 0; index < item.accountings.length; index++) {
                let element = item.accountings[index]
                element.credit_object=item.payer_id
                element.credit_object_name=item.payer_name
                accountings.push(element)
            }
        }
        return accountings
    },
    clearCreditObjectAccountings(item:CashDetailModel){
        let accountings:any[]=[]
        if(item.accountings.length>0){
            for (let index = 0; index < item.accountings.length; index++) {
                let element = item.accountings[index]
                element.credit_object=null
                element.credit_object_name=null
                accountings.push(element)
            }
        }
        return accountings
    },
    udpateDebitObjectAccountings(item:CashDetailModel){
        let accountings:any[]=[]
        if(item.accountings.length>0){
            for (let index = 0; index < item.accountings.length; index++) {
                let element = item.accountings[index]
                element.debit_object=item.receiver_id
                element.debit_object_name=item.receiver_name
                accountings.push(element)
            }
        }
        return accountings
    },
    clearDebitObjectAccountings(item:CashDetailModel){
        let accountings:any[]=[]
        if(item.accountings.length>0){
            for (let index = 0; index < item.accountings.length; index++) {
                let element = item.accountings[index]
                element.debit_object=null
                element.debit_object_name=null
                accountings.push(element)
            }
        }
        return accountings
    },
    parseTransactionAccountingToJounal(data:any[]){
        //const currentUser=new AuthService().getCurrentUser()
        //const userInfomation=currentUser!==null?currentUser.information:{}
        let list:any[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const jounal={
                debit_account:element.debit_account,
                credit_account:element.credit_account,
                value:0,
                exchange:1,
                description:element.description??null,
                debit_object:null,
                debit_object_name:null,
                credit_object:null,
                credit_object_name:null,
                active:false
            }
            list.push(jounal)
        }
        return list
    },
    itemFromJson(data:any){
        //.log(data)
        const item:CashDetailModel={
            id:data._id,
            code:data.code,
            date:new Date(data.date),
            invoice_date:new Date(data.date),
            invoiced_at:data.invoiced_at,
            major:data.major,
            major_id:data.major_id,
            type:data.type,
            payer_id:data.payer_id??'',
            payer_name:data.payer_name??'',
            receiver_id:data.receiver_id??'',
            receiver_name:data.receiver_name??'',
            address:data.address??'',
            phone:data.phone??'',
            reason:data.reason,
            description:data.description,
            deny_reason:data.deny_reason??'',
            value:data.value,
            accountings:data.accountings??[],
            status:data.status as financeStatus,
            verify_user:data.verify_user,
            verify_date:data.verify_date,
            create_user:data.create_user,
            created_at:formatDateToFormatString(data.createdAt,"DD-MM-YYYY HH:mm"),
            createdAt:data.createdAt,
            active:false,
            disabled:data.status==="DEACTIVE"?true:false
        }
        return item
    },
    listFromJson(data:any){
        console.log(data)
        let list:CashDetailModel[]=[]
        if(data){
            for (let index = 0; index < data.length; index++) {
                const element = data[index]
                //console.log(element)
                list.push(
                    {
                        id:element._id,
                        code:element.code,
                        date:new Date(element.date),
                        invoice_date:new Date(element.date),
                        invoiced_at:element.invoiced_at,
                        major:element.major,
                        major_id:element.major_id,
                        type:element.type,
                        payer_id:element.payer_id,
                        payer_name:element.payer_name,
                        receiver_id:element.receiver_id,
                        receiver_name:element.receiver_name,
                        address:element.address,
                        phone:element.phone,
                        reason:element.reason,
                        description:element.description,
                        deny_reason:element.deny_reason??'',
                        value:element.value,
                        accountings:element.accountings,
                        status:element.status as financeStatus,
                        verify_user:element.verify_user,
                        verify_date:element.verify_date,
                        create_user:element.create_user,
                        created_at:formatDateToFormatString(element.createdAt,"DD-MM-YYYY HH:mm"),
                        createdAt:element.createdAt,
                        active:false,
                        disabled:element.status==="DEACTIVE"?true:false
                    }
                )
            }
        }
        
        //console.log(list)
        return list
    },
    convertVerifiedData2GridData(first:number,list:CashDetailModel[],conditions:any,filters:any){
        const users=conditions.employees as any[]
        const status=conditions.status
        let datas:any[]=[]
        let accumulated=first
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            const creator=users.find(u=>u._id===element.create_user)
            const verifier=users.find(u=>u._id===element.verify_user)
            const item={
                id:element.id,
                type:element.type,
                creator:creator?creator.full_name??'':element.create_user,
                datetime:Date.parse(element.createdAt),
                date:formatDateTimeToFormatString(element.createdAt,'DD-MM-YYYY'),
                time:formatDateTimeToFormatString(element.createdAt,'HH:mm'),
                invoice_date:formatDateTimeToFormatString(element.invoiced_at,'DD-MM-YYYY'),
                invoice_time:formatDateTimeToFormatString(element.invoiced_at,'HH:mm'),
                invoice:element.code,
                reason:element.description,
                object:'',
                receipt_amount:element.type==='IMPORT'?element.value:0,
                payslip_amount:element.type==='EXPORT'?element.value:0,
                accumulate_amount:0,
                transaction: t("transaction."+element.major),
                pay_receiver:element.type==='IMPORT'?element.payer_name:element.receiver_name,
                verifier:verifier?verifier.full_name??'':element.verify_user,
                status:element.status
            }
            datas.push(item)
        }
        datas.sort((a,b)=>a.datetime-b.datetime)
        for (let index = 0; index < datas.length; index++) {
            const element = datas[index];
            if(element.type==="IMPORT"){
                accumulated+=element.receipt_amount
                
            }
            else{
                accumulated-=element.payslip_amount

            }
            datas[index]["accumulate_amount"]=accumulated
        }
        datas=datas.reverse()
        const firstRecord={
            id:'',
            type:'IMPORT',
            creator:'',
            datetime:0,
            date:formatDateTimeToFormatString(filters.from,'DD-MM-YYYY'),
            time:'00:00',
            invoice_date:formatDateTimeToFormatString(filters.from,'DD-MM-YYYY'),
            invoice_time:'00:00',
            invoice:'DAUKY',
            reason:'Số dư đầu kỳ',
            object:'',
            receipt_amount:first,
            payslip_amount:0,
            accumulate_amount:first,
            transaction:'',
            pay_receiver:'',
            verifier:'',
            status:''
        }
        const final=status==="ACTIVE"?[...datas,firstRecord]:datas
        return final
    },
    async denyItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/cashbook/verify', data)
        return parseCommonHttpResult(response)
    },
    async confirmItem(data:any){
        const response = await HttpService.doPutRequest('v1/cashbook/verify', data)
        return parseCommonHttpResult(response)
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/cashbook/restore', data)
        return parseCommonHttpResult(response)
    },
    async deleteItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/cashbook', data)
        return parseCommonHttpResult(response)
    },
    async editItem(data:any){
        const response = await HttpService.doPutRequest('v1/cashbook', data)
        return parseCommonHttpResult(response)
    },
    async addItem(data:any){
        const response = await HttpService.doPostRequest('v1/cashbook', data)
        return parseCommonHttpResult(response)
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/cashbook/detail', data)
        return parseCommonHttpResult(response)
    },
    async fetchSummary(data:any){
        const response = await HttpService.doGetRequest('v1/cashbook/summary', data)
        return parseCommonHttpResult(response)
    },
}