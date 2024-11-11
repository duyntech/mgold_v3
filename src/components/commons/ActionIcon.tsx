import { ActionIconProps } from "../../types";
import { actionMapIcon } from "../../utils/constants/const";

export default function ActionIcon(props:ActionIconProps){
    
    let iconClass=''
    Object.entries(actionMapIcon).map(([k, v]) => {
        if(k===props.action){
            iconClass=v
        }
    });
    return <i className={`${iconClass} ${props.className}`}></i>
}