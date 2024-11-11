class GoldgroupModel {
    id: string
    name: string
    goldtypes:string[]
    active:boolean
    disabled:boolean
    constructor(
        id: string,
        name: string,
        goldtypes: string[],
        active:boolean,
        disabled:boolean
    ){
        this.id=id,
        this.name=name,
        this.goldtypes=goldtypes,
        this.active=active
        this.disabled=disabled
    }
    static initial(){
        return {
            id:'',
            name:'',
            goldtypes:[],
            active:false,
            disabled:false
        }
    }
}
export {GoldgroupModel}