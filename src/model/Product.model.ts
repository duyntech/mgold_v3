import { status } from "../types"

class ProductModel{
    _id:string
    code:string
    name:string
    counter:string
    product_type:string
    supplier:string
    images:any[]
    tags:any[]
    gold_type:string
    unit:string
    weight:number
    stone:number
    gold_weight:number
    ni_weight:number
    final_weight:number
    age:number
    exchange_rate:number
    wage:number
    root_wage:number
    stone_value:number
    amount:number
    active:boolean
    is_online:boolean
    discount:number
    is_new:boolean
    is_hot:boolean
    date:string
    fixed_price:number
    status:status
    buyin_rate:number
    trading_rate:number
    import_detail_id?:string
    purchase_order_id?:string
    symbol?:string
    ni?:string
    note?:string
    descriptions?:any[]
    constructor(
        _id:string,
        code:string,
        name:string,
        counter:string,
        product_type:string,
        supplier:string,
        images:any[],
        tags:any[],
        gold_type:string,
        unit:string,
        weight:number,
        stone:number,
        gold_weight:number,
        ni_weight:number,
        final_weight:number,
        age:number,
        exchange_rate:number,
        wage:number,
        root_wage:number,
        stone_value:number,
        amount:number,
        active:boolean,
        is_online:boolean,
        discount:number,
        is_new:boolean,
        is_hot:boolean,
        date:string,
        fixed_price:number,
        status:status,
        buyin_rate:number,
        trading_rate:number,
        import_detail_id?:string,
        purchase_order_id?:string,
        symbol?:string,
        ni?:string,
        note?:string,
        descriptions?:any[]
        ){
        this._id=_id,
        this.code=code,
        this.name=name,
        this.counter=counter,
        this.product_type=product_type,
        this.supplier=supplier,
        this.images=images,
        this.tags=tags,
        this.gold_type=gold_type,
        this.unit=unit,
        this.weight=weight,
        this.stone=stone,
        this.gold_weight=gold_weight,
        this.ni_weight=ni_weight,
        this.final_weight=final_weight,
        this.age=age,
        this.exchange_rate=exchange_rate,
        this.wage=wage,
        this.root_wage=root_wage,
        this.stone_value=stone_value,
        this.discount=discount,
        this.amount=amount,
        this.active=active,
        this.is_online=is_online,
        this.is_new=is_new,
        this.is_hot=is_hot,
        this.date=date,
        this.fixed_price=fixed_price,
        this.status=status,
        this.buyin_rate=buyin_rate,
        this.trading_rate=trading_rate,
        this.import_detail_id=import_detail_id,
        this.purchase_order_id=purchase_order_id,
        this.symbol=symbol,
        this.ni=ni,
        this.note=note,
        this.descriptions=descriptions
    }
    static initial() {
        return {
            _id:"",
            code:'',
            name:'',
            counter:'',
            product_type:'',
            supplier:'',
            gold_type:'',
            images:[] as string[],
            tags:[],
            unit:'LY',
            weight:0,
            stone:0,
            gold_weight:0,
            ni_weight:0,
            final_weight:0,
            age:0,
            exchange_rate:0,
            wage:0,
            root_wage:0,
            stone_value:0,
            discount:0,
            amount:0,
            active:false,
            is_online:false,
            is_new:false,
            is_hot:false,
            fixed_price:0,
            date:'',
            status:"ACTIVE" as status,
            buyin_rate:100,
            trading_rate:100,
            import_detail_id:'',
            purchase_order_id:'',
            symbol:'C',
            ni:'',
            note:'',
            descriptions:[]
        }
    }
}
class OldProductModel extends ProductModel{
    refund:number
    makeup:number
    buyin_price:number
    value:number
    has_invoice:boolean
    invoice_checking:boolean
    trading_type:string
    trading_weight:number
    trading_gold:string
    trading_value:number
    retail_code:string
    constructor(
        _id:string,
        code:string,
        name:string,
        counter:string,
        product_type:string,
        supplier:string,
        images:string[],
        tags:string[],
        gold_type:string,
        unit:string,
        weight:number,
        stone:number,
        ni_weight:number,
        final_weight:number,
        gold_weight:number,
        age:number,
        exchange_rate:number,
        wage:number,
        root_wage:number,
        stone_value:number,
        amount:number,
        active:boolean,
        is_online:boolean,
        discount:number,
        is_new:boolean,
        is_hot:boolean,
        date:string,
        fixed_price:number,
        status:status,
        refund:number,
        makeup:number,
        buyin_rate:number,
        buyin_price:number,
        value:number,
        has_invoice:boolean,
        invoice_checking:boolean,
        trading_type:string,
        trading_rate:number,
        trading_weight:number,
        trading_gold:string,
        trading_value:number,
        retail_code:string,
        import_detail_id?:string,
        purchase_order_id?:string,
        symbol?:string,
        ni?:string,
        note?:string,
        descriptions?:any[]
    ){
        super(
            _id=_id,
            code=code,
            name=name,
            counter=counter,
            product_type=product_type,
            supplier=supplier,
            images=images,
            tags=tags,
            gold_type=gold_type,
            unit=unit,
            weight=weight,
            stone=stone,
            gold_weight=gold_weight,
            ni_weight=ni_weight,
            final_weight=final_weight,
            age=age,
            exchange_rate=exchange_rate,
            wage=wage,
            root_wage=root_wage,
            stone_value=stone_value,
            amount=amount,
            active=active,
            is_online=is_online,
            discount=discount,
            is_new=is_new,
            is_hot=is_hot,
            date=date,
            fixed_price=fixed_price,
            status=status,
            buyin_rate=buyin_rate,
            trading_rate=trading_rate,
            import_detail_id=import_detail_id,
            purchase_order_id=purchase_order_id,
            symbol=symbol,
            ni=ni,
            note=note,
            descriptions=descriptions
        )
        this.refund=refund,
        this.makeup=makeup,
        this.buyin_price=buyin_price,
        this.value=value,
        this.has_invoice=has_invoice,
        this.invoice_checking=invoice_checking,
        this.trading_type=trading_type,
        this.trading_gold=trading_gold,
        this.trading_weight=trading_weight,
        this.trading_value=trading_value,
        this.retail_code=retail_code
    }
    static initial() {
        return {
            _id:"",
            code:'',
            name:'',
            counter:'',
            product_type:'',
            supplier:'',
            gold_type:'',
            images:[],
            tags:[],
            unit:'LY',
            weight:0,
            stone:0,
            gold_weight:0,
            ni_weight:0,
            final_weight:0,
            age:0,
            exchange_rate:0,
            wage:0,
            root_wage:0,
            stone_value:0,
            value:0,
            amount:0,
            import_detail_id:'',
            purchase_order_id:'',
            symbol:'',
            ni:'',
            note:'',
            descriptions:[],
            refund:0,
            makeup:0,
            buyin_rate:100,
            buyin_price:0,
            has_invoice:false,
            invoice_checking:false,
            active:false,
            is_online:false,
            is_new:false,
            is_hot:false,
            discount:0,
            fixed_price:0,
            status:"ACTIVE" as status,
            trading_type:'TRADE',
            date:'',
            trading_rate:100,
            trading_weight:0,
            trading_gold:'',
            trading_value:0,
            retail_code:''
        }
    }
}
export {ProductModel,OldProductModel}