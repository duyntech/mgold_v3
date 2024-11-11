import { actions } from "../types"

class DropdownItemModel  {
    id:string
    title:string
    subtitle:string
    image:string
    icon:string
    time:string
    className:string
    url:string
    constructor(
        id:string,
        title:string,
        subtitle:string,
        image:string,
        icon:string,
        time:string,
        className:string,
        url:string
    ){
        this.id=id,
        this.title=title,
        this.subtitle=subtitle,
        this.image=image,
        this.icon=icon,
        this.time=time,
        this.className=className,
        this.url=url
    }
}
class DropdownActionItemModel  {
    icon:string
    name:string
    onClick:VoidFunction
    constructor(icon:string,name:string,onClick:VoidFunction){
        this.icon=icon,
        this.name=name,
        this.onClick=onClick
    }
}
class DropdownActionModel  {
    name:string
    action:actions
    onClick:VoidFunction
    constructor(name:string,action:actions,onClick:VoidFunction){
        this.name=name
        this.action=action
        this.onClick=onClick
    }
}
export { DropdownItemModel,DropdownActionItemModel,DropdownActionModel};
    