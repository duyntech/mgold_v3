import { MoneyFormatProps } from "../../types";
import { toLocaleStringRefactor } from "../../utils/util";

export default function MonneyFormat(props:MoneyFormatProps){
    const value=Math.abs(Number(props.value))
    const stringValue=props.decimal?toLocaleStringRefactor(value):value.toLocaleString('de-DE')
    return (
        <>
            {props.value<0?
            <span className="text-danger">({stringValue}){props.unit}</span>
            :<span className={`${props.positiveColor!==null?props.positiveColor:''}`}>{stringValue}{props.unit}</span>
            }
        </>
        )
}