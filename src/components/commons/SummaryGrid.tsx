import { SummaryGridProps } from "../../types";
import {weightFormat } from "../../utils/util";
import MonneyFormat from "./MoneyFormat";
import SummaryBox from "./SummaryBox";

export default function SummaryGrid(props:SummaryGridProps){
    return (
        <SummaryBox 
            body={
                <>
                <div className={`w-100 p-2 card-title ${props.items.length>0?"border-bottom":""}`}>{props.title}</div>
                {props.cols===3?
                    <>
                    {
                    props.items.map((item,index)=>{
                        

                        return <div className="d-flex border-bottom" key={"summary-3-"+index}>
                                    <div className="w-25 p-2"><b>{item.key}</b></div>
                                    <div className="w-25 text-end p-2 border-start">{item.value_1_unit==='GRAM'?<>{weightFormat(item.value_1,"GRAM")}</>:<MonneyFormat value={item.value_1} positiveColor={""} unit={' Ly'} decimal={true}/>} </div>
                                    <div className="w-50 text-end p-2 border-start" ><MonneyFormat value={item.value_2} positiveColor={""} unit={item.value_2_unit} decimal={false}/></div>
                                </div>
                    })
                    }
                    {
                    props.items.length>0 &&(props.sumRow.value_1||props.sumRow.value_2)?
                    <div className="d-flex fami-grid-cell-sum">
                        <div className="w-25 p-2"></div>
                        <div className="w-25 p-2">
                            {props.sumRow.value_1?
                            props.items[0].value_1_unit==='GRAM'?<>{weightFormat(props.items.reduce((sum, el) => sum += el.value_1, 0),"GRAM")}</>:<MonneyFormat value={props.items.reduce((sum, el) => sum += el.value_1, 0)} positiveColor={""} unit={' Ly'} decimal={true}/>
                            :<></>}
                        </div>
                        <div className="w-50 text-end p-2 border-start">
                            {props.sumRow.value_2?
                            <MonneyFormat value={props.items.reduce((sum, el) => sum += el.value_2, 0)} positiveColor={"fami-text-primary"} unit={props.items[0].value_2_unit} decimal={false}/>
                            :<></>}
                        </div>
                    </div>
                    :<></> 
                    }
                    </>
                :<>
                    {
                        props.items.map((item,index)=>{
                            return <div className="d-flex border-bottom" key={"summary-2-"+index}>
                                        <div className="w-50 p-2"><b>{item.key}</b></div>
                                        <div className="w-50 text-end p-2 border-start" >{item.value_1}</div>
                                    </div>
                        })
                    }
                    {
                    props.items.length>0 &&props.sumRow.value_1?
                    <div className="d-flex">
                        <div className="w-50 p-2"></div>
                        <div className="w-50 p-2 border-start">
                            {props.sumRow.value_1?
                            <MonneyFormat value={props.items.reduce((sum, el) => sum += el.value_1, 0)} positiveColor={"fami-text-primary"} unit={props.items[0].value_1_unit} decimal={false}/>
                            :<></>}
                        </div>
                    </div>
                    :<></> 
                    }
                </>
                }
                
                </>
            } 
            className={""}
        />
    )
}