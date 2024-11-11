import { SummaryBoxProps } from "../../types";

export default function SummaryBox(props:SummaryBoxProps){
    return (
        <div className={props.className} style={{width:"100%",border:"1px solid #E6E8E6",borderRadius:8}} >
            {props.body}
        </div>
        )
}