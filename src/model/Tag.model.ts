class TagModel {
    id: string
    code: string
    name: string
    description: string
    is_hot: boolean
    active: boolean
    disabled:boolean
    constructor(
        id: string, 
        code: string, 
        name: string, 
        description: string,
        is_hot: boolean, 
        active: boolean,
        disabled:boolean
    ) {
      this.id = id
      this.code = code
      this.name = name
      this.description = description
      this.is_hot=is_hot
      this.active = active  
      this.disabled = disabled
    }
    static initial(){
        return {
            id:'',
            code:'',
            name:'',
            description:'',
            is_hot: false,
            active:false,
            disabled:false
        }
    }
  }
  export {TagModel}
  