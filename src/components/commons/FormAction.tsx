import { useAppSelector } from "../../app/hooks";
import { FormActionProps } from "../../types";

export default function FormAction(props:FormActionProps){
    const actions = useAppSelector((state) => state.sidebar.actions);
    let outPut:JSX.Element = <></>;
    if(actions.includes(props.action)){
        switch(props.action) {
            case 'INS':
                outPut = <><button type="submit" className="btn btn-primary" disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-add-line"}></i><span className="list-action-label">Thêm mới</span></button></>;
                break;
            case 'UPD':
                outPut = <><button type="submit" className="btn btn-primary" disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-pencil-line"}></i><span className="list-action-label">Cập nhật</span></button></>;
                break;
            case 'UNV':
                outPut = <><button type="submit" className="btn btn-warning" disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-folder-shared-line"}></i><span className="list-action-label">Chờ duyệt</span></button></>;
                break;
            case 'VER':
                outPut = <><button type="submit" className="btn btn-primary" disabled={props.disabled} onClick={props.onClick}><i className={props.icon?props.icon:"ri-verified-badge-line"}></i><span className="list-action-label">Duyệt</span></button></>;
                break;
            case 'DEL':
                outPut = <><button type="submit" className="btn btn-primary" onClick={props.onClick}><i className={props.icon?props.icon:"ri-delete-bin-line"}></i><span className="list-action-label">Xóa</span></button></>;
                break;
            case 'PDF':
                outPut = <><button type="submit" className="btn btn-primary" onClick={props.onClick}><i className={props.icon?props.icon:"ri-printer-line"}></i><span className="list-action-label">In</span></button></>;
                break;
        }
    }
    return outPut;
  }