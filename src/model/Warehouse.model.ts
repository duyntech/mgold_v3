class WarehouseModel {
    id: string
    code: string
    name: string
    description: string
    active: boolean
    disabled:boolean
    constructor(
        id: string, 
        code: string, 
        name: string, 
        description: string, 
        active: boolean,
        disabled:boolean
    ) {
      this.id = id
      this.code = code
      this.name = name
      this.description = description
      this.active = active  
      this.disabled = disabled
    }
    static initial(){
        return {
            id:'',
            code:'',
            name:'',
            description:'',
            active:false,
            disabled:false
        }
    }
  }
  export {WarehouseModel}
  