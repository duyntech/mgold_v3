type EmptyHeightProp={
    height:number
}
export default function EmptyHeight(props:EmptyHeightProp){
    return (
        <div style={{height:props.height}}></div>
    )
}