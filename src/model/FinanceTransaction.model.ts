import { status, transactions } from "../types"

class FinanceTransactionModel{
    id:string
    code:string
    type:transactions
    name:string
    note:string
    status:status
    for_module:"RETAIL" | "PAWN"
    approve_enable:boolean
    accountings:AccountingModel[]
    constructor(
        id:string,
        code:string,
        type:transactions,
        name:string,
        note:string,
        status:status,
        for_module:"RETAIL" | "PAWN",
        approve_enable:boolean,
        accountings:AccountingModel[]){
            this.id=id,
            this.code=code,
            this.type=type,
            this.name=name,
            this.note=note,
            this.status=status,
            this.for_module=for_module,
            this.approve_enable=approve_enable,
            this.accountings=accountings
        }
}
class AccountingModel{
    id:string
    transaction:string
    code:string
    debit_account:string
    credit_account:string
    constructor(id:string,
        transaction:string,
        code:string,
        debit_account:string,
        credit_account:string){
        this.id=id,
        this.code=code,
        this.transaction=transaction,
        this.debit_account=debit_account,
        this.credit_account=credit_account
    }
}
export {FinanceTransactionModel,AccountingModel}