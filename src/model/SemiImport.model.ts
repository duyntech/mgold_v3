class SemiImportModel {
    _id: string
    date:Date
    code:string
    time:string
    imports:any[]
    ages:string
    quantity:number
    weight:number
    stone:number
    gold_weight:number
    wage:number
    gold_value:number
    value:number
    to_stock:string
    partner:string
    note:string
    creator:string
    disabled:boolean
    constructor(
        _id: string,
        date: Date,
        code:string,
        time:string,
        imports:any[],
        ages:string,
        quantity:number,
        weight:number,
        stone:number,
        gold_weight:number,
        wage:number,
        gold_value:number,
        value:number,
        to_stock:string,
        partner:string,
        note:string,
        creator:string,
        disabled:boolean){
        this._id = _id,
        this.date = date,
        this.code=code,
        this.time=time,
        this.imports=imports,
        this.ages=ages,
        this.quantity=quantity,
        this.weight=weight,
        this.stone=stone,
        this.gold_weight=gold_weight,
        this.wage=wage,
        this.gold_value=gold_value,
        this.value=value,
        this.to_stock=to_stock,
        this.partner=partner,
        this.note=note,
        this.creator=creator
        this.disabled=disabled
    }
    static initial(){
        return {
            _id: "",
            date:new Date(),
            code:"",
            time:"00:00",
            imports:[],
            ages:'',
            quantity:0,
            weight:0,
            stone:0,
            gold_weight:0,
            wage:0,
            gold_value:0,
            value:0,
            to_stock:'',
            partner:'',
            note:'',
            creator:'',
            disabled:false
        }
    }
}
export {SemiImportModel}