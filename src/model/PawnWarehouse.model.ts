class PawnWarehouseModel {
    id: string
    code: string
    name: string
    note: string
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
      this.note = description
      this.active = active  
      this.disabled = disabled
    }
    static initial(){
        return {
            id:'',
            code:'',
            name:'',
            note:'',
            active:false,
            disabled:false
        }
    }
  }
  export {PawnWarehouseModel}
  