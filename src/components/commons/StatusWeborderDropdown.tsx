import { Dropdown } from "primereact/dropdown";
import { StatusWeborderProps, weborderStatues,  } from "../../types";
import { t } from "i18next";

export default function StatusWeborderDropdown(props:StatusWeborderProps){
    const StatusTemplate=(value:weborderStatues)=>{
        return (
            <div className="d-flex">
                <div>{t("weborder."+value)}</div>
            </div>
        );
    };
    return (
        <Dropdown
            value={props.value}
            options={["ALL","WAIT","PAID","CANCEL","CONFIRM","DELIVERING","COMPLETE"]}
            itemTemplate={StatusTemplate}
            valueTemplate={StatusTemplate}
            onChange={(e)=>props.onChange(e)}
            placeholder=''
            style={{ width: '100%' ,borderRadius: 8}}/>
    )
}