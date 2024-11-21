import { useAppDispatch, useAppSelector } from "../../app/hooks"
import Card from "../../components/commons/Card"
import ItemCard from "../../components/commons/ItemCard"
import { changeAction, fetchAll, selectItem, setFilteredList } from "../../slices/goldtype/goldtype.slice"
import { t } from "i18next"
import MonneyFormat from "../../components/commons/MoneyFormat"
import { GoldtypeModel } from "../../model"
import { useNavigate } from 'react-router-dom'
import { actions, status } from "../../types"
import { ContentLoading, EmptyBox, EmptyHeight, StatusDropdown } from "../../components/commons"
import { useEffect, useRef, useState } from "react"
import { failed } from "../../utils/alert"
import { removeVietnameseTones, toLocaleStringRefactor } from "../../utils/util"
import ActionButton from "../../components/action/ActionButton"
import Assets from "../../assets"
import { OverlayPanel } from "primereact/overlaypanel"
import { DropdownChangeEvent } from "primereact/dropdown"


export default function AllGoldType(){
    const dispatch = useAppDispatch()
    const goldtypeState = useAppSelector((state)=>state.goldtype)
    const search = useAppSelector((state) => state.header.search)
    const filteredList=goldtypeState.filteredList
    const {status,error} = useAppSelector((state)=>state.goldtype)
    const [statusFilter, setStatusFilter] = useState<status>("ACTIVE");
    const op = useRef<any>(null);
    const navigate = useNavigate()
    const handleActionClick=(item:GoldtypeModel, action:actions)=>{ 
        dispatch(changeAction(action));  
        switch (action) {
            case "VIE":
            case "INS":
            case "UPD":
            case "DEL":
                dispatch(selectItem(item))
                navigate("/goldtype-item")
                break;
        }
    }
    const filterList=()=>{
        let filtered=goldtypeState.list
        if(statusFilter!=="ALL"){
            filtered=filtered.filter(
                item=>item.disabled===(statusFilter==="DEACTIVE"))
        }
        dispatch(setFilteredList(filtered))
    }
    useEffect(() => {
        filterList()
    }, [statusFilter])
    useEffect(() => {
        if (status === 'failed') {
            failed(error);
        }
        else if(status==="completed"){
            filterList()    
        }
    }, [status])
    useEffect(() => {
        if(search!==undefined&&search!==''){
            const filtered=goldtypeState.list.filter(
                item=>item.code.toLowerCase().includes(search.toLowerCase()) || 
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                removeVietnameseTones(item.name.toLowerCase()).includes(removeVietnameseTones(search.toLowerCase()))
            )
            dispatch(setFilteredList(filtered))
        }
        else{
            filterList()
        }
    }, [search,dispatch])
    useEffect(() => {
        dispatch(fetchAll({ store: localStorage.getItem("branch") }))
    }, [])
    return (
        <>
            <Card 
                body={
                    status === 'loading'?
                    <ContentLoading.ItemCardHolder contentRows={1} items={10} image={false} uniqueKey="goldtype-holder-item"/>:
                    <>
                    {filteredList.length>0?
                        <>{filteredList.map((item, index) => {
                        
                        return <div className="pt-2" key={"goldtype-item-" + index}>
                            <ItemCard
                                uniqueKey={""}
                                active={item.active}
                                body={<>
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex">
                                            <div className={`fami-text-primary me-1 ${item.disabled ? 'disabled-text' : ''}`}><b>{item.code}</b>  (Đơn vị tính: {t(item.unit)})</div>
                                            {item.online&&<i className="ri-global-line fami-text-primary me-1"></i>}
                                            {item.screen&&<i className="ri-tv-2-line fami-text-primary mx-1"></i>}
                                            <div>{item.disabled ? <i className="ri-close-line my-error"></i> : <i className="ri-check-line my-success"></i>}</div>
                                        </div>
                                        
                                    </div>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="d-flex">
                                                <div>Tên loại:&nbsp;</div>
                                                <div>{item.name}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="d-flex">
                                                <div>Tuổi vàng:&nbsp;</div>
                                                <div>{toLocaleStringRefactor(item.age)}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="d-flex">
                                                <div>Giá mua:&nbsp;</div>
                                                <MonneyFormat value={item.buyPrice} positiveColor={"fami-text-primary"} unit={"đ"} decimal={false} />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="d-flex">
                                                <div>Giá bán:&nbsp;</div>
                                                <MonneyFormat value={item.sellPrice} positiveColor={"fami-text-primary"} unit={"đ"} decimal={false} />
                                            </div>
                                        </div>
                                    </div>
                                </>}
                                onClick={() => dispatch(selectItem(item))}
                                background={item.disabled ? 'disabled-element' : "active-item-card-background"} 
                                onDoubleClick={()=>handleActionClick(item,"VIE")}
                                contextMenu={[]}
                            />
                        </div>

                    })}</>
                    :
                    <EmptyBox description={<>Chưa có dữ liệu</>} image={Assets.images.emptyBox1} disabled={false} />}
                    <OverlayPanel ref={op} style={{width:"300px"}}>
                            
                            <div className="row pb-2">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="from-date">Trạng thái:</label>
                                    <StatusDropdown 
                                        value={statusFilter} onChange={(e:DropdownChangeEvent) => {
                                            setStatusFilter(e.value)
                                            }
                                        }/>
                                    
                                </div>
                            </div>
                            <EmptyHeight height={30} />
                        </OverlayPanel>
                </>}
                title={<div style={{ cursor: "pointer" }} onClick={(e) => op.current.toggle(e)}><i className="ri-filter-2-fill"></i> Loại vàng</div>}
                tool={<div className="d-flex">
                    <ActionButton action={"INS"} className={""} onClick={() => handleActionClick(GoldtypeModel.initial() ,"INS")} minimumEnable={true} label={"Thêm"}/>
                </div>}
                isPadding={true} className={""}/>
        </>
    )
}