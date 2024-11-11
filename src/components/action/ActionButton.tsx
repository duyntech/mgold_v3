import { useAppSelector } from "../../app/hooks";
import { ActionButtonProps } from "../../types";
export default function ActionButton(props:ActionButtonProps){
    const actions = useAppSelector((state) => state.sidebar.actions);
    //console.log(actions)
    let Button:JSX.Element = <></>;
    if(actions.includes(props.action)){
        switch(props.action) {
            case 'INS':
                Button = <><button type="button" className={`btn btn-primary ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-add-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'UPD':
                Button = <><button type="button" className={`btn btn-primary ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-pencil-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'DEL':
                Button = <><button type="button" className={`btn btn-outline-danger ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-delete-bin-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'UND':
                Button = <><button type="button" className={`btn btn-primary ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-arrow-go-back-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'PDF':
                Button = <><button type="button" className={`btn btn-outline-primary ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-printer-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'EXC':
                Button = <><button type="button" className={`btn btn-outline-primary ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-file-excel-2-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'MPI':
                Button = <><button type="button" className={`btn btn-primary ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-add-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'APP':
                Button = <><button type="button" className={`btn btn-info ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-verified-badge-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'ISY':
                Button = <><button type="button" className={`btn btn-primary ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-gallery-upload-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'DEN':
                Button = <><button type="button" className={`btn btn-danger ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-close-circle-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'IMP':
                Button = <><button type="button" className={`btn btn-primary ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-import-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'UNV':
                Button = <><button type="button" className={`btn btn-warning ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-folder-shared-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'DVE':
                Button = <><button type="button" className={`btn btn-warning ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-file-close-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'CVE':
                Button = <><button type="button" className={`btn btn-warning ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-file-forbid-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'VER':
                Button = <><button type="button" className={`btn btn-primary ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-file-check-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'WLQ':
                Button = <><button type="button" className={`btn btn-info ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-file-unknow-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'DLQ':
                Button = <><button type="button" className={`btn btn-warning ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-file-check-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'LIQ':
                Button = <><button type="button" className={`btn btn-primary ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-file-check-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'CLQ':
                Button = <><button type="button" className={`btn btn-danger ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-file-close-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'WAI':
                Button = <><button type="button" className={`btn btn-info ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-file-unknow-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'DRE':
                Button = <><button type="button" className={`btn btn-danger ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-file-close-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'CRE':
                Button = <><button type="button" className={`btn btn-danger ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-file-close-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'RED':
                Button = <><button type="button" className={`btn btn-primary ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-file-check-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
            case 'CAN':
                Button = <><button type="button" className={`btn btn-danger ${props.className}`} disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-file-close-line"}></i>{props.minimumEnable?<span className="list-action-label">{props.label}</span>:props.label}</button></>;
                break;
        }
    }
    return Button
}