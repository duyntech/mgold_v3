class SearchModel {
    key: string
    quantity:number
    active:boolean
    constructor(key: string, quantity: number,active:boolean){
        this.key = key,
        this.quantity = quantity,
        this.active=active
    }
    static initial(){
        return {
            key:'',
            quantity:0,
            active:false
        }
    }
}
class SearchDetailModel {
    key:string
    ip_address:string
    create_user:string
    createdAt:string
    constructor(key: string, ip_address: string,create_user:string,createdAt:string){
        this.key = key,
        this.ip_address = ip_address,
        this.create_user=create_user,
        this.createdAt=createdAt
    }
}
export {SearchModel,SearchDetailModel}