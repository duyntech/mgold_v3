class ConsultingModel {
    id: string
    full_name: string
    phone:string
    requirement:string
    consultant:string
    consultant_name:string
    consulting_note:string
    datetime:string
    active:boolean
    constructor(
        id: string,
        full_name: string,
        phone:string,
        requirement:string,
        consultant:string,
        consultant_name:string,
        consulting_note:string,
        datetime:string,
        active:boolean
    ){
        this.id=id,
        this.full_name=full_name,
        this.phone=phone,
        this.requirement=requirement,
        this.consultant=consultant,
        this.consultant_name=consultant_name,
        this.consulting_note=consulting_note,
        this.datetime=datetime,
        this.active=active
    }
    static initial(){
        return {
            id:'',
            full_name: '',
            phone:'',
            requirement:'',
            consultant:'',
            consultant_name:'',
            consulting_note:'',
            datetime:'',
            active:false
        }
    }
}
export {ConsultingModel}