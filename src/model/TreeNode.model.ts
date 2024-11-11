import { ProductTypeModel } from "./ProductType.model"

class TreeNodeModel{
    key:string
    label:string
    data:ProductTypeModel
    children:TreeNodeModel[]
    constructor(
        key:string,
        label:string,
        data:ProductTypeModel,
        children:TreeNodeModel[]
    ){
        this.key=key,
        this.label=label,
        this.data=data,
        this.children=children
    }
    static initial(){
        return {
            key:'',
            label:'',
            data:ProductTypeModel.initial(),
            children:[]
        }
    }
}
export {TreeNodeModel}