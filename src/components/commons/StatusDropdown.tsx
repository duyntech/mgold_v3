import { Dropdown } from "primereact/dropdown";
import { StatusDropdownProps, status } from "../../types";

export default function StatusDropdown(props: StatusDropdownProps) {
    const StatusTemplate = (value: status) => {
        return (
            <div className="d-flex">
                <div className="me-1">{value !== "ALL" ? value === "ACTIVE" ? <i className="ri-check-line my-success"></i> : <i className="ri-close-line my-error"></i> : <></>}</div>
                <div>{value !== "ALL" ? value === "ACTIVE" ? 'Hoạt động' : 'Tạm dừng' : 'Tất cả'}</div>
            </div>
        );
    };
    return (
        <Dropdown
            value={props.value}
            options={["ALL", "ACTIVE", "DEACTIVE"]}
            itemTemplate={StatusTemplate}
            valueTemplate={StatusTemplate}
            onChange={(e) => props.onChange(e)}
            placeholder=''
            style={{ width: '100%', borderRadius: 8 }} />
    )
}