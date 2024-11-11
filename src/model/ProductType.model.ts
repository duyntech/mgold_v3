class ProductTypeModel{
    _id: string
    code: string
    name: string
    image: string
    website_enable: boolean
    id_parent: string
    level?:number
    tags:string[]
    disabled:boolean
    constructor(
        _id: string, 
        code: string, 
        name: string, 
        id_parent: string, 
        image: string,
        website_enable: boolean,
        level:number,
        tags:string[],
        disabled:boolean
    ) {
      this._id = _id
      this.code = code
      this.name = name
      this.image=image
      this.website_enable=website_enable
      this.id_parent = id_parent
      this.level=level
      this.tags=tags
      this.disabled = disabled
    }
    static initial(){
        return {
            _id:'',
            code:'',
            name:'',
            image:'',
            website_enable:false,
            id_parent:'',
            level:0,
            tags:[],
            disabled:false
        }
    }
}
export {ProductTypeModel}