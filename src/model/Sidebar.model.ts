class SidebarItem {
    id: string
    title: string
    target: string
    icon: string
    actions:string[]
    module:string
    isActive: boolean
    constructor(
        id: string,
        title: string,
        target: string,
        icon: string,
        actions:string[],
        module:string,
        isActive: boolean
        ){
            this.id=id,
            this.title=title,
            this.target=target,
            this.icon=icon,
            this.actions=actions,
            this.module=module,
            this.isActive=isActive
        }
}
class SidebarSubItemModel extends SidebarItem {
    parentId: string
    constructor(
        id: string,
        title: string,
        target: string,
        icon: string,
        actions:string[],
        isActive: boolean,
        module:string,
        parentId:string
    ){
        super(
        id=id,
        title=title,
        target=target,
        icon=icon,
        actions=actions,
        module=module,
        isActive=isActive
        )
        this.parentId=parentId
    }
}
class SidebarItemModel extends SidebarItem {
    isExpanded: boolean
    isGroup: boolean
    submenus: SidebarSubItemModel[]
    constructor(
        id: string,
        title: string,
        target: string,
        icon: string,
        actions:string[],
        module:string,
        isActive: boolean,
        isExpanded: boolean,
        isGroup: boolean,
        submenus: SidebarSubItemModel[]
    ){
        super(
        id=id,
        title=title,
        target=target,
        icon=icon,
        actions=actions,
        module=module,
        isActive=isActive
        )
        this.isExpanded=isExpanded,
        this.isGroup=isGroup,
        this.submenus=submenus
    }
}
export { SidebarItemModel, SidebarSubItemModel }
