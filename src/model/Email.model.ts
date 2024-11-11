class EmailModel {
    id: string
    email: string
    datetime:string
    active:boolean
    constructor(
        id: string,
        email: string,
        datetime:string,
        active:boolean
    ){
        this.id=id,
        this.email=email,
        this.datetime=datetime,
        this.active=active
    }
    static initial(){
        return {
            id:'',
            email:'',
            datetime:'',
            active:false
        }
    }
}
export {EmailModel}