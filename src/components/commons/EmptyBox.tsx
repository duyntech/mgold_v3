import { EmptyBoxProps } from "../../types";

export default function EmptyBox(props:EmptyBoxProps){
    return (
        <div className="form-group text-center pt-3" style={{pointerEvents:props.disabled?"none":"unset"}}>
            <img src={props.image} height={90}/>
            <div>{props.description}</div>
        </div>
    )
}