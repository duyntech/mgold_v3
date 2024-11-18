import { Dropdown } from "primereact/dropdown";
import { PartnerDropdownProps, partner } from "../../types";

export default function PartnerDropdown(props: PartnerDropdownProps) {
    const PartnerTemplate = (value: partner) => {
        return (
            <div className="d-flex">
                <div className="me-1">{value === "ALL" && <i className="ri-check-line my-success"></i>}</div>
                <div> {value !== "ALL" ? value === "SUPPLIER" ? 'Nhà cung cấp' : "Khách hàng" : 'Tất cả'}</div>
            </div>
        );
    };
    return (
        <Dropdown
            value={props.value}
            options={["ALL", "CUSTOMER", "SUPPLIER"]}
            itemTemplate={PartnerTemplate}
            valueTemplate={PartnerTemplate}
            onChange={(e) => props.onChange(e)}
            placeholder=''
            style={{ width: '100%', borderRadius: 8 }} />
    )
}