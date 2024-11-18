import { MenuItem } from "primereact/menuitem"
import { DropdownActionModel, DropdownItemModel } from "../model/Dropdown.model"
import { FormikProps } from "formik"
export interface ComponentFormikProps {
    formik: FormikProps<Record<string, any>>
}
export type Verify2faProps = {
    username: string
    token: string,
    device: string
}
export type LoginProps = {
    username: string
    password: string
}
export type StatusProps = {
    status: string
}
export type EmptyBoxProps = {
    description: JSX.Element,
    image: string,
    disabled: boolean
}
export type SummaryBoxProps = {
    body: JSX.Element
    className: string
}
export type IDropdownList = {
    items: DropdownItemModel[]
    status: 'idle' | 'loading' | 'failed';
}
export type ItemCardProps = {
    uniqueKey: string,
    active: boolean,
    body: JSX.Element,
    background: string,
    onClick: VoidFunction,
    onDoubleClick: VoidFunction,
    contextMenu: MenuItem[]
}
export type MoneyFormatProps = {
    value: number,
    positiveColor: string,
    unit: string,
    decimal: boolean
}
export type DashedButtonProps = {
    onClick: VoidFunction,
    iconEnable: boolean,
    iconClassName: string,
    label: string
    disabled: boolean
}
export type DashedBorderBoxProps = {
    body: JSX.Element,
    width: string,
    autoMargin?: boolean
}
export type CounterProps = {
    icon: string
    // counter: number
    // title: string
    body?: JSX.Element
    backgroundColor: string
}
export type IncomeProps = {
    className: string
    value: number
    currency: string
    title: JSX.Element
    icon?: string
    rounded?: boolean
}
export type ApexChartProps = {
    options: any,
    series: any,
    type: "line" | "area" | "bar" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "rangeArea" | "treemap" | undefined,
    height: number
}
export type ApexProps = {
    options: any
    series: any
}
export type LoadingProps = {
    height: number
}
export type ItemCardHolderProps = {
    items: number,
    contentRows: 1 | 2,
    image: boolean,
    uniqueKey: string
}
export type actions = "ALL" | "VIE" | "INS" | "UPD" | "DEL" | "UND" | "IMP" | "UNV" | "VER" | "WAI" | "CAN" | "DEN" | "PDF" | "APP" | "EXC" | "MSP" | "MBP" | "MWA" | "MSV" | "MDC" | "MRB" | "MRS" | "MCO" | "ISY" | "MPN" | "MGT" | "MCT" | "MPT" | "MSU" | "MWE" | "MST" | "MSW" | "VCP" | "MCP" | "MFP" | "MEW" | "MEH" | "MEN" | "MTA" | "MPI" | "VQT" | "VVL" | "MDA" | "MCU" | "MCN" | "MOD" | "MCI" | "MPH" | "MPV" | "MDT" | "MWD" | "MAD" | "MTG" | "MWH" | "MVA" | "MNO" | "DVE" | "CVE" | "WLQ" | "DLQ" | "LIQ" | "CLQ" | "DRE" | "RED" | "CRE" | "MDL" | "MDR" | "VTA" | "MTD" | "MDD" | 'VBR' | 'VSR' | 'VPTP' | 'VGP' | 'VTP' | 'VRP'
export type FormActionProps = {
    action: actions,
    onClick: VoidFunction,
    icon?: string,
    disabled?: boolean
}
export type ActionButtonProps = {
    action: actions,
    className: string,
    minimumEnable: boolean,
    label: string,
    onClick: VoidFunction,
    icon?: string
    size?: string
    disabled?: boolean
}
export type status = "ALL" | "ACTIVE" | "DEACTIVE" | "BOOKED" | "WAITING" | "SOLD" | "EXPORTED"
export type partner = "ALL" | "CUSTOMER" | "SUPPLIER"
export type financeStatus = "ALL" | "ACTIVE" | "DEACTIVE" | "WAITING" | "DENIED"
export type transactions = "RETAIL" | "PAWN" | "WITHDRAW" | "RECEIPT" | "PAYSLIP" | "WEBORDER" | "CREDIT" | "DEBIT"
export type StatusDropdownProps = {
    value: status,
    onChange: any
}
export type PartnerDropdownProps = {
    value: partner,
    onChange: any
}
export type ActionItemCardProps = {
    list: DropdownActionModel[]
    uniqueKey: string
    disabled: boolean
}
export type TreeNodeHolderProps = {
    items: number,
    uniqueKey: string
}
export type SummaryGridProps = {
    title: JSX.Element,
    cols: 2 | 3,
    items: {
        key: string,
        value_1: number,
        value_1_unit: string,
        value_2: number,
        value_2_unit: string
    }[],
    sumRow: {
        value_1: boolean,
        value_2: boolean
    }

}
export type SummaryElementGridProps = {
    title: JSX.Element,
    cols: 2 | 3,
    items: {
        col_1: JSX.Element,
        col_2: JSX.Element,
        col_3: JSX.Element,
        sum: boolean
    }[]
    classNames: {
        col_1: string,
        col_2: string,
        col_3: string
    }
}
export type goldtypeOperators = "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE" | ''
export type codeScannerProps = {
    onDecoded: (text: string) => void
    onError: (error: any) => void
}
export type NewTradingDetail = {
    gold_type: string,
    gold_age: number,
    final_weight: number,
    trading_gold: string,
    trading_age: number,
    trading_weight: number,
    trading_rest: number,
    remain_weight: number,
    trading_type: string
}
export interface IPdfPrint {
    print(): void;
}
export type ActionIconProps = {
    action: string
    className: string
}
export type CustomPanelProps = {
    body: JSX.Element,
    header: JSX.Element,
    className: string,
    toggleable: boolean,
    collapsed: boolean
}
export type ProductFilterProps = {
    status: status[],
    goldTypes: string[],
    productTypes: string[],
    secondProductTypes: string[],
    thirdProductTypes: string[],
    productTypeStatus: string,
    secondProductTypeStatus: string,
    thirdProductTypeStatus: string,
    tags: string[],
    counter: string,
    tagStatus: string,
    weightFrom: number,
    weightTo: number,
    isNew: string,
    isHot: string,
    isImage: string,
    isWebsite: string,
    isDiscount: string,
    date: Date | null,
    tagQuantity: number
}
export type OptionProps = {
    key: string
    name: string
}
export type weborderStatues = "ALL" | "WAIT" | "PAID" | "CANCEL" | "CONFIRM" | "DELIVERING" | "COMPLETE" | undefined
export type StatusWeborderProps = {
    value: weborderStatues,
    onChange: any
}
export type installmentPeriod = {
    months: number,
    rate: number
}
export type dropdownItem = {
    label: string,
    value: string,
    parent: boolean
}