import { useEffect, useRef, useState } from "react";
import Card from "../../components/commons/Card";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ContentLoading, EmptyBox } from "../../components/commons";
import Assets from "../../assets";
import { Paginator } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { transactions } from "../../utils/constants/const";
import { CommonModel } from "../../model/Common.model";
import { fetchAll, patchItem, resetActionState, selectHistory, selectItem, setFilteredList, viewHistory } from "../../slices/history/history.slice";
import { dateToYMDFormat, removeVietnameseTones } from "../../utils/util";
import { failed } from "../../utils/alert";
import ItemCard from "../../components/commons/ItemCard";
import { TransactionModel } from "../../model";
import { t } from "i18next";
import SummaryElementGrid from "../../components/commons/SummaryElementGrid";
import ActionIcon from "../../components/commons/ActionIcon";
import CustomPanel from "../../components/commons/CustomPannel";
export default function AllHistory(){
    const dispatch = useAppDispatch()
    const historyState = useAppSelector((state)=>state.history)
    const search = useAppSelector((state) => state.header.search)
    const filteredList=historyState.filteredList
    const op = useRef<any>(null)
    const curentDate = new Date()
    const previous30Days =new Date()
    previous30Days.setDate(previous30Days.getDate() - 29)
    const [fromdate, setFromdate] = useState(previous30Days)
    const [todate, setTodate] = useState(curentDate)
    const [transaction, setTransaction] = useState<CommonModel>(transactions[0])
    const [filterChanged, setFilterChanged] = useState(false);
    const warningList=filteredList.filter(e=>e.changed_keys.filter(el=>el.revenueEffect).length>0)
    const basiclList=filteredList.filter(e=>e.changed_keys.filter(el=>!el.revenueEffect).length<=0)
    
    const [first, setFirst] = useState(0)
    const [page, setPage] = useState(1)
    const [rows, setRows] = useState(10)
    const totalPage= Math.ceil(warningList.length/rows)
    //const [totalPages, setTotalPages] = useState(totalPage);
    //console.log(totalPages)
    const [firstBasic, setFirstBasic] = useState(0)
    const [pageBasic, setPageBasic] = useState(1)
    const [rowsBasic, setRowsBasic] = useState(10)
    const basicTotalpage= Math.ceil(basiclList.length/rowsBasic)
    //const [totalPagesBasic, setTotalPagesBasic] = useState(basicTotalpage)
    //console.log(totalPagesBasic)
    const onPageChangeBasic = (event:any) => {
        //console.log(event)
        setFirstBasic(event.first)
        setRowsBasic(event.rows)
        //setTotalPagesBasic(event.pageCount)
        setPageBasic(event.page+1)
    };
    const onPageChange = (event:any) => {
        //console.log(event)
        setFirst(event.first)
        setRows(event.rows)
        //setTotalPages(event.pageCount)
        setPage(event.page+1)
    };
    const fetchList=()=>{
        const request={
            transaction:transaction.code,
            from:dateToYMDFormat(fromdate,'-',0),
            to:dateToYMDFormat(todate,'-',1)
        }
        //console.log(request)
        dispatch(fetchAll(request))
    }
    const handleTransactionClick=(item:TransactionModel)=>{
        const request={
            transaction:transaction.code,
            id:item.id
        }
        dispatch(selectItem(item))
        dispatch(patchItem(request))
    }
    const filterList=()=>{
        let filtered=historyState.list
        dispatch(setFilteredList(filtered))
    }
    useEffect(() => {
        if (historyState.statusAction === 'failed') {
            failed(historyState.error);
            dispatch(resetActionState(''))
        }
        if(historyState.statusAction==="completed"){
            
        }
    }, [historyState.statusAction])
    useEffect(() => {
        if (historyState.status === 'failed') {
            failed(historyState.error);
        }
        if(historyState.status==="completed"){
            //setTotalPages(Math.ceil(filteredList.length/rows))
            setFilterChanged(false)
        }
    }, [historyState.status])
    
    useEffect(() => {
        if(search!==undefined&&search!==''){
            const filtered=historyState.list.filter(
                item=>item.code.toLowerCase().includes(search.toLowerCase()) || 
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                removeVietnameseTones(item.name.toLowerCase()).includes(removeVietnameseTones(search.toLowerCase()))||
                item.date.includes(search.toLowerCase())
            )
            dispatch(setFilteredList(filtered))
        }
        else{
            filterList()
        }
    }, [search,dispatch])
    useEffect(() => {
        fetchList()
        //fetchHistory()
    }, [])
    return (
        <div className="row">
            <div className="col-sm-4">
                <Card 
                    body={
                        historyState.status === 'loading'?
                        <ContentLoading.ItemCardHolder contentRows={1} items={10} image={false} uniqueKey="transaction-holder-item"/>:
                        <>
                            <CustomPanel 
                                body={
                                    <>
                                    {warningList.length>0?
                                        <>{
                                            warningList.map((item,index)=>{
                                                if (index >= first && index <= (first + rows)){
                                                    return <div className="pt-2" key={"transaction-item-" + index}>
                                                        <ItemCard 
                                                            uniqueKey={""} 
                                                            active={item.active} 
                                                            body={<>
                                                                    <div className="d-flex justify-content-between">
                                                                        <div className="d-flex">
                                                                            <div className={`fami-text-primary me-1 ${item.disabled ? 'disabled-text' : ''}`}><b>{item.code}</b>{item.name!==''?<> - <b>{item.name}</b></>:<></>}</div>
                                                                            <div>{item.disabled ? <i className="ri-close-line my-error"></i> : <i className="ri-check-line my-success"></i>}</div>
                                                                        </div>
                                                                        
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-sm-12">
                                                                            <div><i className="ri-timer-flash-line fami-text-primary icon-on-list"></i> {item.date}</div>
                                                                        </div>
                                                                    </div>
                                                                </>} 
                                                            background={item.disabled ? 'disabled-element' : "active-item-card-background"}
                                                            onClick={()=>handleTransactionClick(item)} 
                                                            onDoubleClick={()=>{}}
                                                            contextMenu={[]}
                                                            />
                                                    </div>
                                                }
                                            })
                                        }</>
                                        :<EmptyBox description={<>Danh sách rỗng</>} image={Assets.images.emptyBox1} disabled={false} />
                                        }
                                        {totalPage > 1 ?
                                            <Paginator
                                                first={first}
                                                rows={rows}
                                                totalRecords={warningList.length}
                                                rowsPerPageOptions={[10, 20, 30]}
                                                onPageChange={onPageChange}
                                                template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }}
                                                currentPageReportTemplate={` ${page}/${totalPage}`} />:<></>}
                                    </>
                                } 
                                header={<span className="text-danger"><i className="ri-error-warning-line"></i> Doanh thu và lợi nhuận</span>} 
                                className={""} 
                                toggleable={true} 
                                collapsed={false}/>
                            <CustomPanel 
                                body={
                                    <>
                                    {basiclList.length>0?
                                        <>{
                                            basiclList.map((item,index)=>{
                                                if (index >= firstBasic && index <= (firstBasic + rowsBasic)){
                                                    return <div className="pt-2" key={"transaction-item-" + index}>
                                                        <ItemCard 
                                                            uniqueKey={""} 
                                                            active={item.active} 
                                                            body={<>
                                                                    <div className="d-flex justify-content-between">
                                                                        <div className="d-flex">
                                                                            <div className={`fami-text-primary me-1 ${item.disabled ? 'disabled-text' : ''}`}><b>{item.code}</b>{item.name!==''?<> - <b>{item.name}</b></>:<></>}</div>
                                                                            <div>{item.disabled ? <i className="ri-close-line my-error"></i> : <i className="ri-check-line my-success"></i>}</div>
                                                                        </div>
                                                                        
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-sm-12">
                                                                            <div><i className="ri-timer-flash-line fami-text-primary icon-on-list"></i> {item.date}</div>
                                                                        </div>
                                                                    </div>
                                                                </>} 
                                                            background={item.disabled ? 'disabled-element' : "active-item-card-background"}
                                                            onClick={()=>handleTransactionClick(item)} 
                                                            onDoubleClick={()=>{}}
                                                            contextMenu={[]}
                                                            />
                                                    </div>
                                                }
                                            })
                                        }</>
                                        :<EmptyBox description={<>Danh sách rỗng</>} image={Assets.images.emptyBox1} disabled={false} />
                                        }
                                        {basicTotalpage > 1 ?
                                            <Paginator
                                                first={firstBasic}
                                                rows={rowsBasic}
                                                totalRecords={basiclList.length}
                                                rowsPerPageOptions={[10, 20, 30]}
                                                onPageChange={onPageChangeBasic}
                                                template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }}
                                                currentPageReportTemplate={` ${pageBasic}/${basicTotalpage}`} />:<></>}
                                    </>
                                } 
                                header={<><i className="ri-information-line"></i> Thông thường</>} 
                                className={""} 
                                toggleable={true} 
                                collapsed={false}/>
                        
                        <OverlayPanel ref={op} >
                            <div className="row pb-2">
                                <div className="form-group col-sm-6">
                                    <label htmlFor="from-date">Từ ngày:</label>
                                    <Calendar
                                        inputId="from-date"
                                        name="from-date"
                                        dateFormat="dd/mm/yy"
                                        value={fromdate}
                                        onChange={(e) => {
                                            setFromdate(e.target.value as Date);
                                            setFilterChanged(true)
                                        } }
                                        placeholder="Từ ngày"
                                        style={{ width: "100%", borderRadius: "10px" }} />
                                </div>
                                <div className="form-group col-sm-6">
                                    <label htmlFor="to-date">Đến ngày:</label>
                                    <Calendar
                                        inputId="to-date"
                                        name="to-date"
                                        dateFormat="dd/mm/yy"
                                        value={todate}
                                        onChange={(e) => {
                                            setTodate(e.target.value as Date);
                                            setFilterChanged(true)
                                        } }
                                        placeholder="Đến ngày"
                                        style={{ width: "100%", borderRadius: "10px" }} />
                                </div>
                            </div>
                            
                            <div className="row pb-2">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="from-date">Nghiệp vụ:</label>
                                    <Dropdown
                                            filter
                                            options={transactions}
                                            name="transaction"
                                            optionLabel="name"
                                            placeholder="Chọn nghiệp vụ"
                                            value={transaction}
                                            onChange={(e) => {
                                                setTransaction(e.target.value)
                                                setFilterChanged(true)
                                                }
                                            }
                                            style={{ width: "100%" }}
                                        />
                                </div>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button disabled={!filterChanged} className='btn btn-primary' onClick={()=>{
                                    op.current.hide()
                                    fetchList()
                                    }}>
                                <i className="ri-check-double-line"></i> Áp dụng</button>
                            </div>
                        </OverlayPanel>
                        </>
                    } 
                    title={<div style={{ cursor: "pointer" }} onClick={(e) => op.current.toggle(e)}><i className="ri-filter-2-fill"></i> Danh sách {transaction.name}</div>} 
                    tool={<></>} 
                    isPadding={true} 
                    className={""}
                />
            </div>
            <div className="col-sm-8">
                <Card 
                    body={
                        historyState.statusAction === 'loading'?
                        <ContentLoading.ItemCardHolder contentRows={1} items={10} image={false} uniqueKey="histories-holder-item"/>:
                        <>
                        {historyState.histories.length>0?
                        <>{
                            historyState.histories.map((item,index)=>{
                                const diffElementList:any=[]
                                if(item.more){
                                    item.differents.map((e)=>{
                                        let oldValue=e.oldValue
                                        let newValue=e.newValue
                                        if(typeof oldValue === 'number' && oldValue !== null){
                                            oldValue=Number(oldValue).toLocaleString('de-DE')
                                        }
                                        if(typeof newValue === 'number' && oldValue !== null){
                                            newValue=Number(newValue).toLocaleString('de-DE')
                                        }
                                        diffElementList.push({
                                            col_1:<b>{t(e.key)}</b>,
                                            col_2:<div >{oldValue}</div>,
                                            col_3:<div >{newValue}</div>,
                                            sum:false
                                        })
                                    })
                                }
                                return <div className="pt-2" key={"history-item-" + index}>
                                <ItemCard 
                                    uniqueKey={""} 
                                    active={item.active} 
                                    body={<>
                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex">
                                                    <ActionIcon action={item.action} className={"fami-text-primary me-1"}/>
                                                    <div className={`fami-text-primary me-1`}><b>{t('action.'+item.action)}</b></div>
                                                </div>
                                                {item.action==="UPD"?<i className={`${item.more?"ri-eye-off-line":"ri-eye-line"} fami-text-primary`} onClick={()=>dispatch(viewHistory(item))}></i>:<></>}
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div><i className="ri-timer-flash-line fami-text-primary icon-on-list"></i> {item.datetime}</div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div><i className="ri-user-add-line fami-text-primary icon-on-list"></i> {item.creator}</div>
                                                </div>
                                            </div>
                                            {item.more?
                                            <>
                                                <div className="p-2"></div>
                                                <div style={{background:"white"}}>
                                                <SummaryElementGrid 
                                                    title={<div className="fami-text-primary"><b>Nội dung thay đổi</b></div>} 
                                                    cols={3} items={diffElementList} 
                                                    classNames={{
                                                    col_1: "w-20 overflow-auto",
                                                    col_2: "w-40 text-break",
                                                    col_3: "w-40 text-break text-danger"
                                                    }}
                                                />
                                                </div>
                                            </>
                                            :<></>}
                                        </>} 
                                    background={"active-item-card-background"}
                                    onClick={()=>dispatch(selectHistory(item))} 
                                    onDoubleClick={item.action==="UPD"?()=>dispatch(viewHistory(item)):()=>{}}
                                    contextMenu={[]}
                                    />
                            </div>
                            })
                        }</>
                        :<EmptyBox description={<>Chưa có thông tin</>} image={Assets.images.emptyBox1} disabled={false} />
                        }
                        </>
                    } 
                    title={<div><i className="ri-history-line"></i> Nhật ký</div>} 
                    tool={<></>} 
                    isPadding={true} 
                    className={""}
                />
            </div>
        </div>
    )
}