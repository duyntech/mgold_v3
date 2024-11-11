class SemiLabelModel {
    _id: string
    date:Date
    code:string
    purchase:any
    purchaseId:string
    purchaseCode:string
    imports:any[]
    exports:any[]
    note:string
    creator:string
    disabled:boolean
    constructor(_id: string, date: Date,code:string,purchase:any,purchaseId:string,
        purchaseCode:string,
        imports:any[],
        exports:any[],note:string,creator:string,disabled:boolean){
        this._id = _id,
        this.date = date,
        this.code=code,
        this.purchase=purchase,
        this.purchaseId=purchaseId,
        this.purchaseCode=purchaseCode,
        this.imports=imports,
        this.exports=exports,
        this.note=note,
        this.creator=creator
        this.disabled=disabled
    }
    static initial(){
        return {
            _id: "",
            date:new Date(),
            code:"",
            purchase:false,
            purchaseId:'',
            purchaseCode:'',
            imports:[],
            exports:[],
            note:"",
            creator:"",
            disabled:false
        }
    }
}
export {SemiLabelModel}