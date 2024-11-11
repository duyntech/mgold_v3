class FuncTreeNodeModel{
    key:string
    label:string
    partialChecked: boolean
    checked: boolean
    data:any
    children:FuncTreeNodeModel[]
    sort:number
    constructor(
        key:string,
        label:string,
        partialChecked: boolean,
        checked: boolean,
        data:any,
        children:FuncTreeNodeModel[],
        sort:number
    ){
        this.key=key,
        this.label=label,
        this.partialChecked=partialChecked,
        this.checked=checked,
        this.data=data,
        this.children=children
        this.sort=sort
    }
    static initial(){
        return {
            key:'',
            label:'',
            partialChecked:false,
            checked:false,
            data:{},
            children:[],
            sort:0
        }
    }
}
export {FuncTreeNodeModel}