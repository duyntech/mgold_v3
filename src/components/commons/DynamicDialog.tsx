import { Dialog } from 'primereact/dialog';
type DialogConfigs={
    visible:boolean,
    position:any,
    title:JSX.Element,
    body:JSX.Element,
    width?:number,
    footer:JSX.Element,
    draggable:boolean,
    resizeable:boolean,
    className?:string,
    onClose:VoidFunction
}
export default function DynamicDialog(props:DialogConfigs){
    return (
        <>
            <Dialog header={props.title} 
                visible={props.visible} 
                position={props.position} 
                breakpoints={{ '960px': '50vw', '641px': '90vw' }} 
                onHide={props.onClose} footer={props.footer} 
                draggable={props.draggable} resizable={props.resizeable}>
                <div className={props.className?props.className:"pt-1"} style={{width:props.width}}>
                    {props.body}
                </div>
            </Dialog>
        </>
    )
}