class ProductExportModel{
    _id: string
    date:Date
    code: string
    type: string
    to_object: string
    refund: number
    products: any[]
    quantity:number
    weight:number
    stone:number
    gold_weight:number
    q10:number
    note:string
    status:string
    create_user:any
    disabled:boolean
    constructor(
        _id: string, 
        date:Date,
        code: string,
        type: string,
        to_object: string,
        refund: number,
        products: any[],
        quantity:number,
        weight:number,
        stone:number,
        gold_weight:number,
        q10:number,
        note:string,
        status:string,
        create_user:any,
        disabled:boolean
    ) {
      this._id = _id
      this.date=date
      this.code = code
      this.type = type
      this.to_object=to_object
      this.refund=refund
      this.products = products
      this.quantity=quantity
      this.weight=weight
      this.stone=stone
      this.gold_weight=gold_weight
      this.q10=q10
      this.note=note
      this.status=status
      this.create_user=create_user
      this.disabled=disabled
    }
    static initial(){
        return {
            _id:'',
            date:new Date(),
            code: "#",
            type: 'XH',
            to_object: '',
            refund: 0,
            products: [],
            quantity:0,
            weight:0,
            stone:0,
            gold_weight:0,
            q10:0,
            note:'',
            status:'ACTIVE',
            create_user:'',
            disabled:false
        }
    }
}
export {ProductExportModel}