import { DashedBorderBoxProps } from "../../types";

export default function DashedBorderBox(props:DashedBorderBoxProps){
    return (
        <div className={`dashed-border-default py-2 ${props.autoMargin?'m-auto':''}`} style={{width:props.width,height:props.width}}>
            {props.body}
        </div>
    )

}