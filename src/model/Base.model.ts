abstract class BaseModel {
    active: boolean
    disabled:boolean
    constructor(active: boolean, disabled: boolean){
        this.active = active,
        this.disabled = disabled
    }
}

export {BaseModel}