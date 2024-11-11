import { useRef } from "react";
import { ItemCardProps } from "../../types"
import { ContextMenu } from 'primereact/contextmenu';
export default function ItemCard(props:ItemCardProps){
    const cm = useRef<any>(null);
    return (
        <>
        <ContextMenu model={props.contextMenu} ref={cm} breakpoint="767px" />
        <div 
            key={props.uniqueKey} 
            className={`px-2 py-1 ${props.background}`}  
            style={{cursor:"pointer",width:"100%",border:`1px solid ${props.active?"#283673":"#E6E8E6"}`,borderRadius:8}} 
            onClick={props.onClick} 
            onDoubleClick={props.onDoubleClick}
            onContextMenu={(e) => props.contextMenu.length>0?cm.current.show(e):{}}
            >
            {props.body}
        </div>
        </>
    )
}