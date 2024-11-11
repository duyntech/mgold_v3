import ActionButton from "../../components/action/ActionButton";
import Card from "../../components/commons/Card";

export default function AllReview(){
    return (
        <Card 
            body={
                <>
                </>
            } 
            title={<div style={{ cursor: "pointer" }}><i className="ri-mail-unread-line"></i> Danh sách đánh giá</div>} 
            tool={<div className="d-flex">
                    <ActionButton action={"EXC"} className={""} onClick={() => {}} minimumEnable={true} label={"Excel"}/>
                </div>
            } 
            isPadding={true} 
            className={""}
            />
    )
}