class CounterModel {
    id: string
    code: string
    name: string
    active: boolean
    disabled:boolean
    constructor(
        id: string, 
        code: string, 
        name: string, 
        active: boolean,
        disabled:boolean
    ) {
      this.id = id
      this.code = code
      this.name = name
      this.active = active  
      this.disabled = disabled
    }
    static initial(){
        return {
            id:'',
            code:'',
            name:'',
            active:false,
            disabled:false
        }
    }
  }
  export {CounterModel}
  