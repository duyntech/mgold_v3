class ViewModel {
    code: string
    type: string
    tagName: string
    productName: string
    typeName: string
    images:string[]
    viewed:number
    active:boolean
    constructor(code: string,type:string,tagName: string,
        productName: string,
        typeName: string,images:string[],viewed:number, active: boolean){
        this.code = code,
        this.type=type,
        this.tagName=tagName,
        this.productName=productName,
        this.typeName=typeName,
        this.images = images,
        this.active=active,
        this.viewed=viewed
    }
    static initial(){
        return {
            key:'',
            type:'',
            tagName:'',
            productName:'',
            typeName:'',
            iamges:[],
            active:false,
            viewed:0
        }
    }
}
class ViewDetailModel {
    code:string
    type:string
    ip_address:string
    create_user:string
    createdAt:string
    constructor(code: string,type:string, ip_address: string,create_user:string,createdAt:string){
        this.code = code,
        this.type=type,
        this.ip_address = ip_address,
        this.create_user=create_user,
        this.createdAt=createdAt
    }
}
export {ViewModel,ViewDetailModel}