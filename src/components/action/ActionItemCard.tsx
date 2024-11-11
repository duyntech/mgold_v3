import { useAppSelector } from "../../app/hooks";
import { DropdownActionModel } from "../../model";
import { ActionItemCardProps } from "../../types";
import { actionIcons } from "../../utils/constants/const";
import { DropdownAction } from "../commons/DropdownActionToolbar";

export default function ActionItemCard(props:ActionItemCardProps){
    const actions = useAppSelector((state) => state.sidebar.actions);
    let validActions:DropdownActionModel[]=[]
    let activeActions:DropdownActionModel[]=[]
    for (let index = 0; index < props.list.length; index++) {
        const element = props.list[index];
        if(actions.includes(element.action)){
            validActions.push(element)
        }
    }
    for (let index = 0; index < validActions.length; index++) {
        const element = validActions[index];
        if(props.disabled){
            if(["VIE","UND"].includes(element.action)){
                activeActions.push(element)
            }
        }
        else{
            if(!["UND"].includes(element.action)){
                activeActions.push(element)
            }
        }
    }
    let Tools:JSX.Element=<></>
    if(activeActions.length===1){
       Tools= <h5 onClick={activeActions[0].onClick} style={{ cursor: "pointer" }}><i className={`fami-text-primary ${actionIcons[activeActions[0].action]}`}></i></h5>
    }
    else if(activeActions.length>1){
        Tools=<DropdownAction toolId={props.uniqueKey} actions={activeActions} /> 
    }
    return Tools
}