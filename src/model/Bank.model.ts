import { status } from "../types"

class BankModel{
    id:string
    account_number:string
    bank_name:string
    bank_branch:string
    date_format:string
    for_module:"RETAIL" | "PAWN" | "WITHDRAW"
    rate_fee:number
    status:status
    for_method:"OTHER"|"MPOS"|"PAYON"|"PAYOS"
    active:boolean
    disabled:boolean
    constructor(
        id:string,
        account_number:string,
        bank_name:string,
        bank_branch:string,
        date_format:string,
        for_module:"RETAIL" | "PAWN" | "WITHDRAW",
        rate_fee:number,
        status:status,
        for_method:"OTHER"|"MPOS"|"PAYON"|"PAYOS",
        active:boolean,
        disabled:boolean
    ){
        this.id=id,
        this.account_number=account_number
        this.bank_name=bank_name
        this.bank_branch=bank_branch
        this.date_format=date_format
        this.for_module=for_module
        this.rate_fee=rate_fee
        this.status=status
        this.for_method=for_method
        this.active=active
        this.disabled=disabled
    }
    static initial(){
        return {
            id:'',
            account_number:'',
            bank_name:'',
            bank_branch:'',
            date_format:'',
            for_module:"RETAIL" as "RETAIL" | "PAWN" | "WITHDRAW",
            rate_fee:0,
            status:"ACTIVE" as status,
            for_method:"OTHER" as "OTHER"|"MPOS"|"PAYON"|"PAYOS",
            active:false,
            disabled:false
        }
    }
}
export {BankModel}