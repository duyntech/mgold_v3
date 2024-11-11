type KeyItemProps={
    iKey:string
    url?:string
    name:string
    hashtag?:boolean
    type?:boolean
    price?:boolean
    removeClick?:VoidFunction
    onClick?:VoidFunction
}
export default function KeyItem(props:KeyItemProps){
    return <a key={props.iKey} style={{height:32}} href={props.url} className={`collection-link ${props.type?'type':props.price?'price':'hashtag'}-outer  m-1 ps-3 ${props.removeClick?'':'pe-3'}`} onClick={props.onClick}>{props.hashtag?'#':''}{props.name}
            {props.removeClick&&<i className="ri-close-circle-line text-danger px-1" onClick={props.removeClick}></i>}
        </a>
}