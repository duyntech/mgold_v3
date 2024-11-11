type ColorBoxProps={
    body:JSX.Element
    className?:string
    boxShadow?:string
    maxHeight?:string
}

export default function ColorBox(props:ColorBoxProps){
    return <div  className={`w-100 ${props.className}`} style={{borderRadius:10,boxShadow:"rgba(0, 0, 0, 0.16) 0px 1px 4px",maxHeight: props.maxHeight}}>
        {props.body}
    </div>
}