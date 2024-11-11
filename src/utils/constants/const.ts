export const decimalScale=2
export const contentTableLoadingHeight=window.innerHeight-230
export const contentTreeLoadingHeight=window.innerHeight-275
export const actionIcons={'VBR':'','VSR':'','VPTP':'','VGP':'','VTP':'','VRP':'',"VTA":"","MDD":"","MTD":"","MDL":"","MDR":"","DLQ":"","LIQ":"","CLQ":"","DRE":"","RED":"","CRE":"","WLQ":"","CVE":"","DVE":"","MDA":"","MCU":"","MCN":"","MOD":"","MCI":"","MPH":"","MPV":"","MDT":"","MWD":"","MAD":"","MTG":"","MWH":"","MVA":"","MNO":"","VVL":"","VQT":"","CAN":"","WAI":"","VER":"","UNV":"","IMP":"","MPI":"","MTA":"","MEN":"","MEH":"","MEW":"","MFP":"","MCP":"","VCP":"","MSW":"","MST":"","MWE":"","MSU":"","MPT":"","MCT":"","MGT":"","MPN":"","ISY":"","MCO":"","MRS":"","MRB":"","MDC":"","MSV":"","MWA":"","MBP":"","MSP":"","DEN":"","ALL":"","VIE":"ri-eye-line","INS":"ri-add-line","UPD":"ri-pencil-line","DEL":"ri-delete-bin-line","UND":"ri-arrow-go-back-line","APP":"ri-double-check-line","PDF":"ri-printer-line","EXC":"ri-file-excel-2-line"}
export const statuses=["ACTIVE","DEACTIVE","BOOKED","WAITING","SOLD","EXPORTED"]
export const transactions=[
    {_id:"",code:"RETAIL",name:"Bán lẻ"},
    {_id:"",code:"PRODUCT",name:"Sản phẩm"},
    {_id:"",code:"PRODUCTTYPE",name:"Loại sản phẩm"},
    {_id:"",code:"GOLDGROUP",name:"Nhóm vàng"},
    {_id:"",code:"GOLDTYPE",name:"Loại vàng"},
    {_id:"",code:"IMPORT",name:"Nhập kho"},
    {_id:"",code:"TAG",name:"Thẻ"},
    {_id:"",code:"ROLE",name:"Vai trò"},
    {_id:"",code:"WAREHOUSE",name:"Kho"}
]
export const actionMapIcon={
    INS:"ri-add-line",
    UPD:"ri-pencil-line",
    RES:"ri-arrow-go-back-line",
    UND:"ri-arrow-go-back-line",
    DEL:"ri-delete-bin-line",
    APP:"ri-check-line"
}
export const numberRoundTo=1000
export const revenuesEffectKeys=["weight","stone","gold_weight","stone_value","wage","cost_wage","fixed_price","discount","gold_type","buy_rate","change_rate","age","buy_price","sell_price","compensation","new_value","old_value","exchange_value","total_value","discount_value","final_value"]
export const weborderStatus=['PAID','CONFIRM','DELIVERING','COMPLETE','WAIT','DELETE','CANCEL']
export const transactionCodes={
    receiptRetail:"R002",
    receiptWeborder:"R003",
    receiptBank:"R004",
    receiptEmployee:"R005",
    creditRetail:"R007",
    creditWeborder:"R008",
    paysliptRetail:"P002",
    payslipWeborder:"P003",
    payslipBank:"P004",
    payslipEmployee:"P005",
    debitRetail:"P007",
    debitWeborder:"P008",
    debitInternal:"P009"
}
export const baseWssUrl="wss://txajxl8iy7.execute-api.ap-southeast-1.amazonaws.com/production"
export const statusFillter = [
    { code: "ACTIVE", value: "Hoạt động" },
    { code: "DEACTIVE", value: "Không hoạt động" },
];
export const exportTypes = [
    { code: "XK", name: "Xuất kho" },
    { code: "XT", name: "Xuất tách" },
    { code: "XG", name: "Xuất gộp" },
];
export const printUrl="http://localhost:8096/Integration/print/Execute"
export const tempPawnTypes=[
    {code:'bac',name:'Bạc'},
    {code:'dien-thoai',name:'Điện thoại'},
    {code:'dong-ho',name:'Đồng hồ'},
    {code:'laptop',name:'Laptop'},
    {code:'may-anh',name:'Máy ảnh'},
    {code:'may-tinh-bang',name:'Máy tính bảng'},
    {code:'o-to',name:'Ô tô'},
    {code:'tai-nghe',name:'Tai nghe'},
    {code:'vang',name:'Vàng'},
    {code:'xe-may',name:'Xe máy'},
    {code:'khac',name:'Khác'},
]
export const pawnStatus=['ACTIVE','UNVERIFY','VERIFY','WAIT','REDEEM',"UNLIQUID","LIQUID",'DEACTIVE']
export const pawnFuncs=['F-TEMP-PAWN','F-PAWN-WAREHOUSE','F-PAWN-TAG']
export const customerStatus=['VERIFY','UNVERIFY']
export const productLimitRecords=4000