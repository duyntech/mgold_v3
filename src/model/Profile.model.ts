import { BaseModel } from "."
import { CommonModel } from "./Common.model"

export class ProfileModel extends BaseModel {
    id:string
    username: string
    firstName:string
    lastName:string
    fullName:string
    filterName:string
    role: CommonModel
    birthDate:string
    phone: string
    email: string
    province: string
    district: string
    ward: string
    address: string
    personalCard:string
    personalCardImage:string
    isAdmin:boolean
    isOnline:boolean
    ipAddress:string
    expireTime:number
    accessTime:number
    status:string
    customer?:any
    constructor(
        id:string,
        username: string,
        firstName:string,
        lastName:string,
        fullName:string,
        filterName:string,
        role: CommonModel,
        birthDate:string,
        phone: string,
        email: string,
        province: string,
        district: string,
        ward: string,
        address: string,
        personalCard:string,
        personalCardImage:string,
        isAdmin:boolean,
        active: boolean,
        disabled:boolean,
        isOnline:boolean,
        ipAddress:string,
        expireTime:number,
        accessTime:number,
        status:string,
        customer?:any
    ){
        super(active, disabled)
        this.id=id,
        this.username=username,
        this.firstName=firstName,
        this.lastName=lastName,
        this.fullName=fullName,
        this.filterName=filterName,
        this.role=role,
        this.birthDate=birthDate,
        this.phone=phone,
        this.email=email,
        this.province=province,
        this.district=district,
        this.ward=ward,
        this.address=address,
        this.personalCard=personalCard,
        this.personalCardImage=personalCardImage,
        this.isAdmin=isAdmin,
        this.active=active,
        this.disabled=disabled,
        this.isOnline=isOnline,
        this.ipAddress=ipAddress,
        this.expireTime=expireTime,
        this.accessTime=accessTime,
        this.status=status
        this.customer=customer
    }
    static initial(){
        return {
            id:"",
            username:"",
            firstName:"",
            lastName:"",
            fullName:"",
            filterName:"",
            role:{_id:'',code:'',name:''},
            birthDate:"",
            phone:"",
            email:"",
            province: "",
            district: "",
            ward: "",
            address:"",
            personalCard:"",
            personalCardImage:"",
            isAdmin:false,
            active:false,
            disabled:false,
            isOnline:false,
            ipAddress:'',
            expireTime:60,
            accessTime:3,
            status:"VERIRY",
            customer:undefined
        }
    }
}