class CustomerModel {
    id: string
    code: string
    firstName: string
    lastName: string
    fullName: string
    phone:string
    address:string
    active:boolean
    constructor(
        id: string,
        code: string,
        firstName: string,
        lastName: string,
        fullName: string,
        phone:string,
        address:string,
        active:boolean
    ){
        this.id=id,
        this.code=code,
        this.firstName=firstName,
        this.lastName=lastName,
        this.fullName=fullName,
        this.phone=phone,
        this.address=address,
        this.active=active
    }
    static initial(){
        return {
            id:'',
            code:'',
            firstName:'',
            lastName:'',
            fullName:'',
            phone:'',
            address:'',
            active:false
        }
    }
}
export {CustomerModel}