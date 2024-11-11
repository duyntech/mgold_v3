import { ProductModel } from "."
import { OptionProps } from "../types"

class ImportModel {
    _id: string
    code: string
    create_user:string
    action:string
    method:string
    date:string
    products:ProductModel[]
    images:any[]
    tags:any[]
    updateKeys:OptionProps[]
    total:number
    active:boolean
    disabled:boolean
    constructor(
        _id: string,
        code: string,
        create_user:string,
        action:string,
        method:string,
        date:string,
        products:ProductModel[],
        images:any[],
        tags:any[],
        updateKeys:OptionProps[],
        total:number,
        active:boolean,
        disabled:boolean
    ){
        this._id=_id,
        this.code=code,
        this.create_user=create_user,
        this.action=action,
        this.method=method,
        this.date=date,
        this.products=products,
        this.images=images,
        this.tags=tags,
        this.updateKeys=updateKeys,
        this.total=total,
        this.active=active,
        this.disabled=disabled
    }
    static initial(){
        return {
            _id:'',
            code:'',
            create_user:'',
            action:'INS',
            method:'EXCEL',
            date:'',
            products:[],
            images:[],
            tags:[],
            updateKeys:[],
            total:0,
            active:false,
            disabled:false
        }
    }
}
export {ImportModel}