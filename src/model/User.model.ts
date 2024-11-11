import { SidebarItemModel } from "."
import { CommonModel } from "./Common.model"

class UserModel {
    id:string 
    username: string
    role: string
    type: string
    stores: CommonModel[]
    sidebars: SidebarItemModel[]
    information:object
    constructor(
        id:string,
        username: string,
        role: string,
        type: string,
        stores: CommonModel[],
        sidebars: SidebarItemModel[],
        information:object){
        this.id=id,
        this.username=username,
        this.role=role,
        this.type=type,
        this.stores=stores,
        this.sidebars=sidebars,
        this.information=information
    }
    static initial(){
        return {
            id:'',
            username:'',
            role:'',
            type:'',
            stores:[],
            sidebars:[],
            information:{}
        }
    }
}
export {UserModel}