class DescriptionModel {
    id: string
    code: string
    name: string
    numberic:number
    active: boolean
    disabled:boolean
    constructor(
        id: string, 
        code: string, 
        name: string,  
        numberic:number,
        active: boolean,
        disabled:boolean
    ) {
      this.id = id
      this.code = code
      this.name = name
      this.numberic=numberic
      this.active = active  
      this.disabled = disabled
    }
    static initial(){
        return {
            id:'',
            code:'',
            name:'',
            numberic:0,
            active:false,
            disabled:false
        }
    }
  }
  export {DescriptionModel}
  