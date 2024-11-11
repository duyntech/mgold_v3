import { SidebarItemModel } from "../model"
export const SidbarService = {
    activeIfSelectParentMenuAndDeactiveOthers (index: number, menues: SidebarItemModel[]){
        if (index > 0) {
            if(menues[index])
                menues[index].isActive = true
            //Deactive others menues
            menues.forEach((_item, idx) => {
                if (idx !== index) {
                menues[idx].isActive = false
                menues[idx].isExpanded = false
                if (menues[idx].submenus.length > 0) {
                    menues[idx].submenus.forEach((_subItem, subIndex) => {
                    menues[idx].submenus[subIndex].isActive = false
                    })
                }
                }
            })
            //Expand/Closape  if it has submenues
            if (menues[index].submenus.length > 0) {
                menues[index].isExpanded = !menues[index].isExpanded
            }
        }
        return menues
    },
    activeIfSelectSubmenuAndDeactiveOthers(menuId: string, menues: SidebarItemModel[]){
        const idx = menues.findIndex((item) => item.submenus.find((sub) => sub.id === menuId))
        if (idx > 0) {
            const item = menues[idx]
            const subIdx = item.submenus.findIndex((sub) => sub.id === menuId)
            menues[idx].submenus[subIdx].isActive = true
            menues[idx].submenus.forEach((_m, i) => {
                if (i !== subIdx) {
                menues[idx].submenus[i].isActive = false
                }
            })
        }
        return menues
    },
    clearActivedMenues(menues:SidebarItemModel[]){
        for (let index = 0; index < menues.length; index++) {
            menues[index].isActive=false
            for (let idx = 0; idx < menues[index].submenus.length; idx++) {
                menues[index].submenus[idx].isActive=false
            }
        }
        return menues
    }
}