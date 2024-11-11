class CashSummaryModel{
    verified:{arising:number,first:number,last:number}
    waiting:number
    employee:any
    active:boolean
    constructor( 
        verified:{arising:number,first:number,last:number},
        waiting:number,
        employee:any,
        active:boolean){
            this.verified=verified,
            this.waiting=waiting,
            this.employee=employee,
            this.active=active
    }
    static initial(){
        return {
            verified:{arising:0,first:0,last:0},
            waiting:0,
            employee:{},
            active:false
        }
    }
}
export {CashSummaryModel}