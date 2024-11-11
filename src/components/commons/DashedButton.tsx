import { DashedButtonProps } from "../../types";
export default function DashedButton(props:DashedButtonProps){
    return (
        <div  className='form-group dashed-border-primary' style={{cursor:"pointer",pointerEvents:props.disabled?"none":"unset"}} onClick={props.onClick} >
            {props.iconEnable?<i className={props.iconClassName}></i>:<></>}
            &nbsp;{props.label}
        </div>
    )

}