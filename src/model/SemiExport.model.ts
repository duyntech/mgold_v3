class SemiExportModel {
    _id: string
    date:Date
    code:string
    time:string
    type:string
    products:string
    ages:string
    import_weight:number
    import_stone:number
    import_gold:number
    export_weight:number
    export_stone:number
    export_gold:number
    diff_weight:number
    diff_stone:number
    diff_gold:number
    to_stocks:string
    note:string
    creator:string
    imports:any[]
    exports:any[]
    disabled:boolean
    constructor(
        _id: string,
        date: Date,
        code:string,
        time:string,
        type:string,
        products:string,
        ages:string,
        import_weight:number,
        import_stone:number,
        import_gold:number,
        export_weight:number,
        export_stone:number,
        export_gold:number,
        diff_weight:number,
        diff_stone:number,
        diff_gold:number,
        imports:any[],
        exports:any[],
        to_stocks:string,
        note:string,creator:string,disabled:boolean){
        this._id = _id,
        this.date = date,
        this.code=code,
        this.time=time,
        this.type=type,
        this.products=products,
        this.ages=ages,
        this.import_weight=import_weight,
        this.import_stone=import_stone,
        this.import_gold=import_gold,
        this.export_weight=export_weight,
        this.export_stone=export_stone,
        this.export_gold=export_gold,
        this.diff_weight=diff_weight,
        this.diff_stone=diff_stone,
        this.diff_gold=diff_gold,
        this.imports=imports,
        this.exports=exports,
        this.to_stocks=to_stocks,
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
            type:"XK",
            products:"",
            ages:"",
            import_weight:0,
            import_stone:0,
            import_gold:0,
            export_weight:0,
            export_stone:0,
            export_gold:0,
            diff_weight:0,
            diff_stone:0,
            diff_gold:0,
            imports:[],
            exports:[],
            to_stocks:"",
            note:"",
            creator:"",
            disabled:false
        }
    }
}
export {SemiExportModel}