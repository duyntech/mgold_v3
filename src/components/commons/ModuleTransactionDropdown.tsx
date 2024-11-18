import { Dropdown } from "primereact/dropdown";
import { ModuleTransactionDropdownProps, moduleTransaction } from "../../types";

export default function ModuleTransactionDropdown(props: ModuleTransactionDropdownProps) {
    const ModuleTransactionTemplate = (value: moduleTransaction) => {
        return (
            <div className="d-flex">
                <div className="me-1">{value === "ALL" && <i className="ri-check-line my-success"></i>}</div>
                <div>{value !== "ALL" ? value === "RETAIL" ? 'Bán lẻ' : 'Cầm đồ' : 'Tất cả'}</div>
            </div>
        );
    };
    return (
        <Dropdown
            value={props.value}
            options={["ALL", "RETAIL", "PAWN"]}
            itemTemplate={ModuleTransactionTemplate}
            valueTemplate={ModuleTransactionTemplate}
            onChange={(e) => props.onChange(e)}
            placeholder=''
            style={{ width: '100%', borderRadius: 8 }} />
    )
}