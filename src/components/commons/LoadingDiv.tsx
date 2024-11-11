import { Spinner } from "react-bootstrap"

type LoadingDivProps={
    loading:boolean,
    body:JSX.Element,
    className?:string
}
export default function LoadingDiv(props:LoadingDivProps){
    //console.log(props.loading)
    return <div className={`position-relative ${props.className}`}>
        {props.body}
        {props.loading&&<div className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-center top-0 start-0">
            <Spinner style={{zIndex:500}}/>
        </div>
        }
    </div>
}