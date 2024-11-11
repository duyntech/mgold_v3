class TransactionModel {
    id: string
    code: string
    name:string
    transaction:string
    date:string
    last_action:object
    changed_keys:DataDiffModel[]
    active:boolean
    disabled:boolean
    constructor(
        id: string,
        code: string,
        name:string,
        transaction:string,
        date:string,
        last_action:object,
        changed_keys:DataDiffModel[],
        active:boolean,
        disabled:boolean
    ){
      this.id=id,
      this.code=code,
      this.name=name,
      this.transaction=transaction,
      this.date=date,
      this.last_action=last_action,
      this.changed_keys=changed_keys,
      this.active=active,
      this.disabled=disabled
    }
}
class HistoryModel {
    id: string
    transaction: string
    old_data: any
    new_data:any
    action:string
    datetime:string
    creator:string
    active:boolean
    more:boolean
    differents:DataDiffModel[]
    constructor(
        id: string,
        transaction: string,
        old_data: any,
        new_data:any,
        action:string,
        datetime:string,
        creator:string,
        active:boolean,
        more:boolean,
        differents:DataDiffModel[]
    ){
      this.id=id,
      this.transaction=transaction,
      this.old_data=old_data,
      this.new_data=new_data,
      this.action=action,
      this.datetime=datetime,
      this.creator=creator,
      this.active=active,
      this.more=more,
      this.differents=differents
    }
    static initial(){
      return {
        id: '',
        transaction: '',
        old_data: {},
        new_data:{},
        action:'',
        datetime:'',
        creator:'',
        active:false,
        more:false,
        differents:[]
      }
    }
}
class DataDiffModel {
  key: string
  revenueEffect:boolean
  oldValue: string
  newValue:string
  constructor(
      key: string,
      revenueEffect:boolean,
      oldValue: string,
      newValue:string,
  ){
    this.key=key,
    this.revenueEffect=revenueEffect,
    this.oldValue=oldValue,
    this.newValue=newValue
  }
}
export {TransactionModel,HistoryModel,DataDiffModel}