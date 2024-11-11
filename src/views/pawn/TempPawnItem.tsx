import React, { Suspense } from "react";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
const TempPawn=React.lazy(() => import('../../components/pawn/TempPawn'));
const TempPawnExtend=React.lazy(() => import('../../components/pawn/TempPawnExtend'));
const tabs=[ 
    {
        "title":"Thông tin phiếu cầm",
        "component":TempPawn
    },
    {
        "title":"Thông tin gia hạn",
        "component":TempPawnExtend
    }
];
export default function TempPawnItem(){
    const pawnState=useAppSelector(state=>state.temppawn)
    const [tabIndex, settabIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState<any>(tabs[0]);
    const handleTab = (idx:number) => {
        settabIndex(idx);
        setCurrentPage(tabs[idx]);
    }
    return <>
        {pawnState.action!="INS"&&<div className="row">
            <div className="col-lg-12">
                <div className="iq-card">
                    <div className="iq-card-body p-0">
                        <div className="iq-edit-list">
                            <ul className="iq-edit-profile d-flex nav nav-pills">
                                {
                                    tabs.map((item,index)=>{
                                        return (
                                            <li key={`profile-tab-${index}`} className="col-md-6 p-0" style={{cursor:"pointer"}}>
                                                <a className={`nav-link ${tabIndex===index?'active':''}`} data-toggle="pill" onClick={()=>handleTab(index)} >
                                                    {item.title}
                                                </a>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>}
        <div className="row">
            <div className="col-lg-12">
                <Suspense>{<currentPage.component/>}</Suspense>
            </div>
        </div>
    </>
}