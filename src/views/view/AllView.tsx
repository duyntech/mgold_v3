import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { dateToYMDFormat, isPhone, productImageUrl, removeVietnameseTones } from "../../utils/util";
import { fetchAll, selectItem, setFilteredList, setFiltersTab } from "../../slices/view/view.slice";
import { failed } from "../../utils/alert";
import Card from "../../components/commons/Card";
import { ContentLoading, DashedBorderBox, EmptyBox, EmptyHeight } from "../../components/commons";
import ItemCard from "../../components/commons/ItemCard";
import Assets from "../../assets";
import { Paginator } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";
import { Calendar } from "primereact/calendar";
import ActionButton from "../../components/action/ActionButton";
import MonneyFormat from "../../components/commons/MoneyFormat";
import { Image } from 'primereact/image';
import { TabPanel, TabView } from "primereact/tabview";
export default function AllView(){
    const dispatch = useAppDispatch()
    const viewState=useAppSelector((state)=>state.view);
    const filteredList=viewState.filteredList;
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
    const [activeIndex, setActiveIndex] = useState(viewState.filters.tab)
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
    const goldTabHeaderTemplate = (options:any) => {
        return (
            <div onClick={options.onClick} className={options.className}>
                {options.leftIconElement}
                {options.titleElement}
            </div>
        );
    };
    const filterList=()=>{
        let filtered=viewState.list
        switch (activeIndex) {
            case 0:
                filtered=filtered.filter(item=>item.type==='PRODUCT')
                break;
            case 1:
                filtered=filtered.filter(item=>item.type==='TAG')
                break;
            default:
                filtered=filtered.filter(item=>item.type==='TYPE')
                break;
        }   
        dispatch(setFilteredList(filtered))
    }
    useEffect(() => {
        dispatch(setFiltersTab(activeIndex))
        filterList()
    }, [activeIndex])
    useEffect(() => {
        if (viewState.status === 'failed') {
            failed(viewState.error);
        }
        if(viewState.status==="completed"){
            filterList()
            setTotalPages(Math.ceil(filteredList.length/rows))
            setFilterChanged(false)
        }
    }, [viewState.status])
    useEffect(() => {
        if(search!==undefined&&search!==''){
            const filtered=viewState.list.filter(
                item=>removeVietnameseTones(item.code.toLowerCase()).includes(removeVietnameseTones(search.toLowerCase()))
            )
            dispatch(setFilteredList(filtered))
        }
        else{
            dispatch(setFilteredList(viewState.list))
        } 
    }, [search, dispatch])
    useEffect(() => {
        fetchList()
    }, [])
    return (
        <>
            <Card 
                body={
                    viewState.status === 'loading'?
                    <ContentLoading.ItemCardHolder contentRows={2} items={10} image={false} uniqueKey="semi-holder-item"/>:
                    <>
                    <TabView activeIndex={activeIndex} onTabChange={(e)=>setActiveIndex(e.index)}>
                        <TabPanel header={`Sản phẩm (${viewState.list.filter(item=>item.type==='PRODUCT').length})`} leftIcon="ri-box-3-line icon-on-list me-1" headerTemplate={goldTabHeaderTemplate}></TabPanel>
                        <TabPanel header={`Thẻ (${viewState.list.filter(item=>item.type==='TAG').length})`} leftIcon="ri-price-tag-3-line icon-on-list me-1" headerTemplate={goldTabHeaderTemplate}></TabPanel>
                        <TabPanel header={`Loại sản phẩm (${viewState.list.filter(item=>item.type==='TYPE').length})`} leftIcon="ri-list-unordered icon-on-list me-1" headerTemplate={goldTabHeaderTemplate}></TabPanel>
                    </TabView>
                        {filteredList.length>0?
                        <>{
                            filteredList.map((item,index)=>{
                                if (index >= first && index < (first + rows))
                                {
                                    return <div className="pt-2" key={"semi-product-item-" + index}>
                                        <ItemCard
                                            uniqueKey={""}
                                            onClick={() => dispatch(selectItem(item))}
                                            active={item.active}
                                            body={<div>
                                                <div className="d-flex justify-content-between">
                                                    <div className="d-flex">
                                                            <DashedBorderBox body={<Image style={{ bottom: 3, left: -5 }} src={item.images.length > 0 ? (productImageUrl(item.images[0]) !== null ? productImageUrl(item.images[0])! : Assets.images.logoLoading) : Assets.images.logoLoading} alt="Image" width="40" height="40" loading="lazy" preview />}
                                                                width={"50px"} />
                                                            <div className="ms-2">
                                                                <div><b>{item.code} ({activeIndex===0?item.productName:activeIndex===1?item.tagName:item.typeName})</b></div>
                                                                <div>{item.type==='TYPE'?'Loại sản phẩm':item.type==='TAG'?'Thẻ':'Sản phẩm'}</div>
                                                            </div>
                                                    </div>
                                                    <div className="fami-text-primary">{item.viewed} lượt</div>
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
                                fetchList()
                                }}><i className="ri-check-double-line"></i> Áp dụng</button>
                            <EmptyHeight height={28} />
                        </OverlayPanel>
                    </>
                    } 
                title={<div style={{ cursor: "pointer" }} onClick={(e) => op.current.toggle(e)}><i className="ri-filter-2-fill"></i> Thống kê lượt xem</div>} 
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
                            <div className="me-2 align-self-end">Tổng mã:</div>
                            <b><MonneyFormat value={filteredList.length} positiveColor={"fami-text-primary fw-bold"} unit={""} decimal={false}/></b>
                            
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
}