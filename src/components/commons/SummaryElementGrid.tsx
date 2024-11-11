import { SummaryElementGridProps } from "../../types";
import SummaryBox from "./SummaryBox";

export default function SummaryElementGrid(props:SummaryElementGridProps){
    return (
        <SummaryBox 
            body={
                <>
                <div className={`w-100 p-2 card-title ${props.items.length>0?"border-bottom":""}`}>{props.title}</div>
                {props.cols===3?
                    <>
                    {
                    props.items.map((item,index)=>{
                        return <div className={`d-flex ${item.sum?'fami-grid-cell-sum':'border-bottom'}`} key={"summary-element-3-"+index}>
                                    <div className={`${props.classNames.col_1} p-2`}>{item.col_1}</div>
                                    <div className={`${props.classNames.col_2} p-2 ${item.sum?"":"border-start"}`}>{item.col_2}</div>
                                    <div className={`${props.classNames.col_3} text-end p-2 border-start`}>{item.col_3}</div>
                                </div>
                    })
                    }
                    
                    </>
                :<>
                    {
                        props.items.map((item,index)=>{
                            return <div className={`d-flex ${item.sum?'fami-grid-cell-sum':'border-bottom'}`} key={"summary-element-2-"+index}>
                                        <div className={`${props.classNames.col_1} p-2`}>{item.col_1}</div>
                                        <div className={`${props.classNames.col_2} text-end p-2 ${item.sum?'':'border-start'}`}>{item.col_2}</div>
                                    </div>
                        })
                    }
                    
                </>
                }
                
                </>
            } 
            className={""}
        />
    )
}