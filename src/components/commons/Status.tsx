import { t } from "i18next";
import { StatusProps } from "../../types";

export default function Status(props: StatusProps){
    let icon_status = "ri-check-line my-success";
    if (props.status == "deactive") {
        icon_status = "ri-close-line my-error";
    }
    return (
        <div><i className={`${icon_status} fami-text-primary icon-on-list`}></i> {t(`status.${props.status}`)}</div>
    )
}