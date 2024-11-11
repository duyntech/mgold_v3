import ActionButton from "../../components/action/ActionButton";
import Card from "../../components/commons/Card";

export default function AllConsulting(){
    
    return (
        <Card 
            body={
                <>
                </>
            } 
            title={<div style={{ cursor: "pointer" }}><i className="ri-questionnaire-line"></i> Danh sách liên hệ tư vấn</div>} 
            tool={<div className="d-flex">
                    <ActionButton action={"EXC"} className={""} onClick={() => {}} minimumEnable={true} label={"Excel"}/>
                </div>
            } 
            isPadding={true} 
            className={""}
            />
    )
}