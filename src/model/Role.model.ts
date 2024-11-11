import { BaseModel } from "./Base.model"
import { FuncTreeNodeModel } from "./FuncTreeNode.model"
export class RoleModel extends BaseModel {
    id: string
    name: string
    code: string
    description: string
    permissions: FuncTreeNodeModel[]
    
    constructor(
        id: string, 
        name: string, 
        code: string, 
        description: string, 
        permissions: FuncTreeNodeModel[], 
        active: boolean, 
        disabled: boolean
        ) {
        super(active, disabled) 
        this.id = id
        this.name = name
        this.code = code
        this.description = description
        this.permissions = permissions
    }
    static initial() {
        return {
        id: '',
        name: '',
        code: '',
        description: '',
        permissions: [], 
        active: false,
        disabled: false,
        }
    }
}
