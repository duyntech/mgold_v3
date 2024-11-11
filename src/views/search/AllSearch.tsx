import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { dateToYMDFormat, isPhone, removeVietnameseTones } from "../../utils/util";
import { deleteKey, fetchAll, resetActionState, selectItem, setFilteredList } from "../../slices/search/search.slice";
import { completed, failed, processing, warningWithConfirm } from "../../utils/alert";
import Card from "../../components/commons/Card";
import { ContentLoading, EmptyBox, EmptyHeight } from "../../components/commons";
import ItemCard from "../../components/commons/ItemCard";
import Assets from "../../assets";
import { Paginator } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";
import { Calendar } from "primereact/calendar";
import ActionButton from "../../components/action/ActionButton";
import MonneyFormat from "../../components/commons/MoneyFormat";
import { SearchModel } from "../../model";

export default function AllSearch(){
    const dispatch = useAppDispatch()
    const searchState=useAppSelector((state)=>state.search);
    const filteredList=searchState.filteredList;
    const search=useAppSelector((state)=>state.header.search);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);
    const [filterChanged, setFilterChanged] = useState(false);
    const [totalPages, setTotalPages] = useState(Math.ceil(filteredList.length/rows));
    const isPhoneDevice=isPhone();
    const curentDate = new Date();
    const firstDayOfMonth = new Date(curentDate.getFullYear(), curentDate.getMonth(), 1);
    const [fromdate, setFromdate] = useState(firstDayOfMonth);
    const [todate, setTodate] = useState(curentDate);
    const op = useRef<any>(null);
    const onPageChange = (event:any) => {
        //console.log(event)
        setFirst(event.first);
        setRows(event.rows);
        setTotalPages(event.pageCount);
        setPage(event.page+1);
    };
    const fetchList=()=>{
        dispatch(fetchAll(
            { 
                from:dateToYMDFormat(fromdate,'-',0),
                to:dateToYMDFormat(todate,'-',1)
            }
        ))
    }
    const handleDelete=(item:SearchModel)=>{
        warningWithConfirm({
            title: "Xóa",
            text: "Bạn muốn xóa từ khóa "+item.key +" ?",
            confirmButtonText: "Đồng ý",
            confirm: ()=>{
                dispatch(deleteKey({key:item.key}))
            }
        })
    }
    useEffect(() => {
        if (searchState.status === 'failed') {
            failed(searchState.error);
        }
        if(searchState.status==="completed"){
            setTotalPages(Math.ceil(filteredList.length/rows))
            setFilterChanged(false)
        }
    }, [searchState.status])
    useEffect(() => {
        if (searchState.statusAction === 'failed') {
            failed(searchState.error);
        }
        if (searchState.statusAction === 'loading') {
            processing()
        }
        if(searchState.statusAction==="completed"){
            completed()
            dispatch(resetActionState(''));
            fetchList()
        }
    }, [searchState.statusAction])
    useEffect(() => {
        if(search!==undefined&&search!==''){
            const filtered=searchState.list.filter(
                item=>removeVietnameseTones(item.key.toLowerCase()).includes(removeVietnameseTones(search.toLowerCase()))
            )
            dispatch(setFilteredList(filtered))
        }
        else{
            dispatch(setFilteredList(searchState.list))
        } 
    }, [search, dispatch])
    useEffect(() => {
        fetchList()
    }, [])
    return (
        <>
            <Card 
                body={
                    searchState.status === 'loading'?
                    <ContentLoading.ItemCardHolder contentRows={2} items={10} image={false} uniqueKey="semi-holder-item"/>:
                    <>
                        {filteredList.length>0?
                        <>{
                            filteredList.map((item,index)=>{
                                if (index >= first && index < (first + rows))
                                {
                                    return <div className="pt-2" key={"semi-product-item-" + index}>
                                        <ItemCard
                                            uniqueKey={""}
                                            onClick={() => dispatch(selectItem(item.key))}
                                            active={item.active}
                                            body={<div className={`${!item.active?'py-2':''}`}>
                                                {item.active&&<div className="w-100 text-end"><i className="ri-delete-bin-6-line text-danger" onClick={()=>{handleDelete(item)}}> Xóa</i></div>}
                                                <div className="d-flex justify-content-between">
                                                    <div className="fami-text-primary"><b>{item.key}</b></div>
                                                    <div className="fami-text-primary">{item.quantity} lần</div>
                                                </div>
                                                
                                            </div>}
                                            background={"active-item-card-background"} 
                                            onDoubleClick={()=>{}} 
                                            contextMenu={[]}
                                            />
                                    </div>;
                                }
                            })
                        }</>
                        :<EmptyBox description={<>Danh sách rỗng</>} image={Assets.images.emptyBox1} disabled={false} />}
                        {totalPages > 1 ?
                        <>{isPhoneDevice ?
                            <Paginator
                                first={first}
                                rows={rows}
                                totalRecords={filteredList.length}
                                rowsPerPageOptions={[10, 20, 30]}
                                onPageChange={onPageChange}
                                template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }}
                                currentPageReportTemplate={` ${page}/${totalPages}`} /> :
                            <Paginator
                                first={first}
                                rows={rows}
                                totalRecords={filteredList.length}
                                rowsPerPageOptions={[10, 20, 30]}
                                onPageChange={onPageChange} />}</> :
                        <></>}
                        <OverlayPanel ref={op}>
                            <div className="row pb-2">
                                <div className="form-group col-sm-6">
                                    <label htmlFor="dob">Từ ngày:</label>
                                    <Calendar
                                        inputId="from-date"
                                        name="from-date"
                                        dateFormat="dd/mm/yy"
                                        value={fromdate}
                                        onChange={(e) => {
                                            setFromdate(e.target.value as Date)
                                            setFilterChanged(true)
                                        } }
                                        placeholder="Từ ngày"
                                        style={{ width: "100%", borderRadius: "10px" }} />
                                </div>
                                <div className="form-group col-sm-6">
                                    <label htmlFor="dob">Đến ngày:</label>
                                    <Calendar
                                        inputId="to-date"
                                        name="to-date"
                                        dateFormat="dd/mm/yy"
                                        value={todate}
                                        onChange={(e) => {
                                            setTodate(e.target.value as Date)
                                            setFilterChanged(true)
                                        } }
                                        placeholder="Đến ngày"
                                        style={{ width: "100%", borderRadius: "10px" }} />
                                </div>
                            </div>
                            <button disabled={!filterChanged} className='btn btn-primary float-end' onClick={()=>{
                                op.current.hide()
                                fetchList()}
                                }><i className="ri-check-double-line"></i> Áp dụng</button>
                            <EmptyHeight height={28} />
                        </OverlayPanel>
                    </>
                    } 
                title={<div style={{ cursor: "pointer" }} onClick={(e) => op.current.toggle(e)}><i className="ri-filter-2-fill"></i> Thống kê lượt tìm kiếm</div>} 
                tool={
                    <ActionButton action={"EXC"} className={""} onClick={() => {}} minimumEnable={true} label={"Excel"}/>
                } 
                isPadding={true} 
                className={""}
                />
            <EmptyHeight height={36}/>
            <div className='fixed-bottom'>
                <div className="row">
                    <div className="col-md-10"></div>
                    <div className="col-md-2">
                        <div className="d-flex">
                            <div className="me-2 align-self-end">Tổng từ khóa:</div>
                            <b><MonneyFormat value={filteredList.length} positiveColor={"fami-text-primary fw-bold"} unit={""} decimal={false}/></b>
                            
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
}