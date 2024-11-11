import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { dateToYMDFormat, deepCloneObject, isPhone, isValidAction, removeVietnameseTones } from "../../utils/util";
import Card from "../../components/commons/Card";
import { ContentLoading, EmptyBox, EmptyHeight } from "../../components/commons";
import ItemCard from "../../components/commons/ItemCard";
import { changeAction, clearExtraFilters, fetchAll, selectItem, setFilteredList, setFiltersByKey } from "../../slices/pawn/temppawn.slice";
import Assets from "../../assets";
import { Paginator } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";
import { Calendar } from "primereact/calendar";
import ActionButton from "../../components/action/ActionButton";
import MonneyFormat from "../../components/commons/MoneyFormat";
import { actions } from "../../types";
import { TempPawnModel } from "../../model/TempPawn.model";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { pawnStatus, tempPawnTypes } from "../../utils/constants/const";
import { TabPanel, TabView } from "primereact/tabview";
import { setPawnProducts } from "../../slices/app.slice";
import { NumericFormat } from "react-number-format";
import { failed } from "../../utils/alert";
import { MultiSelect } from "primereact/multiselect";
import { fetchCategories, setFetched } from "../../slices/category/category.slice";
import { SelectButton } from "primereact/selectbutton";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

export default function AllTempPawn(){
    const dispatch = useAppDispatch()
    const navigate=useNavigate()
    const pawnState=useAppSelector(state=>state.temppawn)
    const categoryState = useAppSelector((state) => state.category)
    const search=useAppSelector((state)=>state.header.search)
    const limitedActions=useAppSelector((state) => state.sidebar.actions)
    const [activeIndex, setActiveIndex] = useState(pawnState.filters.tab)
    const filteredList=pawnState.filteredList.filter(e=>e.status===pawnStatus[activeIndex])
    const curentDate = new Date();
    const firstDayOfMonth = new Date(2022, 1, 1);
    const [fromdate, setFromdate] = useState(pawnState.filters.from?pawnState.filters.from: firstDayOfMonth);
    const [todate, setTodate] = useState(pawnState.filters.from?pawnState.filters.to:curentDate);
    const [fromValue, setFromValue] = useState(pawnState.filters.fromValue);
    const [toValue, setToValue] = useState(pawnState.filters.toValue);
    const [filterTags, setFilterTags] = useState<any[]>([]);
    const [filterStatusTags, setFilterStatusTags] = useState<any[]>([]);
    const [filterWarehouses, setFilterWarehouses] = useState<any[]>(pawnState.filters.warehouses);
    const [filterCustomerName, setFilterCustomerName] = useState('');
    const [filterNumberic, setFilterNumberic] = useState('');
    //const [tagStatus, setTagStatus] = useState(pawnState.filters.tagStatus);
    const [warehouseStatus, setWarehouseStatus] = useState(pawnState.filters.warehouseStatus);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);
    const [totalPages, setTotalPages] = useState(Math.ceil(filteredList.length/rows));
    const [tags, setTags] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const isPhoneDevice=isPhone();
    const [ftype, setFtype] = useState("");
    const op = useRef<any>(null);
    const onPageChange = (event:any) => {
        //console.log(event)
        setFirst(event.first);
        setRows(event.rows);
        setTotalPages(event.pageCount);
        setPage(event.page+1);
    };
    const [filterChanged, setFilterChanged] = useState(false);
    const [extraFilter,setExtraFilter]=useState(ftype!==''||warehouseStatus!=='ALL'||fromValue!==0||toValue!==0||filterTags.length>0||filterCustomerName!==''||filterNumberic!=='')
    const handleActionClick=(item:TempPawnModel,action:actions)=>{
        dispatch(changeAction(action))
        switch (action) {
            case "VIE":
            case "INS":
            case "UPD":
            case "DEL":
                dispatch(selectItem(item))
                navigate("/tpawn-item")
                break;
        }   
    }
    const statusTemplate=(value:string)=>{
        return (
            <div className="d-flex">
                <div>{value!=="ALL"?value==="YES"?'Đã thiết lập':'Chưa thiết lập':'Tất cả'}</div>
            </div>
        );
    };
    const fetchList=()=>{
        dispatch(fetchAll(
            { 
                from:dateToYMDFormat(fromdate,'-',0),
                to:dateToYMDFormat(todate,'-',0)
            }
        ))
       
    }
    const filterList=()=>{
        //const status=pawnStatus[activeIndex]
        let filtered=pawnState.list
        //filtered=filtered.filter(item=>item.status===status)
        if(ftype!=''){
            filtered=filtered.filter(item=>item.productType===ftype)
        }
        // if(filterTags.length>0){
        //     filtered=filtered.filter(item=>item.tags&&item.tags.some(e=>filterTags.includes(e)))
        // }
        if(filterWarehouses.length>0){
            filtered=filtered.filter(item=>filterWarehouses.includes(item.warehouse))
        }
        if(fromValue>0&&toValue>0&&fromValue<toValue){
            filtered=filtered.filter(item=>item.value>=fromValue&&item.value<=toValue)
        }
        // switch (tagStatus) {
        //     case "YES":
        //         filtered=filtered.filter(item=>item.tags&&item.tags.length>0)
        //         break;
        //     case "NO":
        //         filtered=filtered.filter(item=>!item.tags||item.tags&&item.tags.length===0)
        //         break;
        // }
        switch (warehouseStatus) {
            case "YES":
                filtered=filtered.filter(item=>item.warehouse&&item.warehouse!=='')
                break;
            case "NO":
                filtered=filtered.filter(item=>!item.warehouse||item.warehouse==='')
                break;
        }
        if(filterStatusTags.length>0){
            //filtered=filtered.filter(item=>item.tags&&item.tags.some(e=>filterStatusTags.includes(e)))
            //let records:TempPawnModel[][]=[]
            for (let index = 0; index < filterStatusTags.length; index++) {
                const element = filterStatusTags[index];
                //let result=filtered
                switch (element.status) {
                    case "YES":
                        filtered=filtered.filter(item=>item.tags&&item.tags.includes(element.code))
                        break;
                    case "NO":
                        filtered=filtered.filter(item=>!item.tags||item.tags&&!item.tags.includes(element.code))
                        break;
                }
                //records.push(result)
            }
            // let filteredCodes:string[]=[]
            // for (let index = 0; index < records.length; index++) {
            //     const element = records[index];
            //     for (let idx = 0; idx < element.length; idx++) {
            //         const elm = element[idx];
            //         filteredCodes.push(elm.code)
            //     }
            // }
            // filtered=filtered.filter(item=>filteredCodes.includes(item.code))
        }
        if(filterCustomerName!==''&&filterCustomerName!==undefined&&filterCustomerName!==null){
            const key=removeVietnameseTones(filterCustomerName).toLowerCase()
            filtered=filtered.filter(
                item=>removeVietnameseTones(item.customer.toLowerCase()).includes(key)
                //|| item.numbericalOrder&&item.numbericalOrder.toLowerCase().includes(key)
            )
        }
        //console.log(filterNumberic)
        if(filterNumberic!==''&&filterNumberic!==null&&filterNumberic!==undefined){
            const key=removeVietnameseTones(filterNumberic).toLowerCase()
            filtered=filtered.filter(
                item=>item.numbericalOrder&&item.numbericalOrder.toLowerCase().includes(key)
            )
        }
        dispatch(setFilteredList(filtered))
    }
    const resetFilter=()=>{
        dispatch(clearExtraFilters())
        setFilterStatusTags([])
        setFilterTags([])
        setFilterCustomerName('')
        setFilterNumberic('')
        setExtraFilter(false)
        op.current.hide()
    }
    const goldTabHeaderTemplate = (options:any) => {
        return (
            <div onClick={options.onClick} className={options.className}>
                {options.leftIconElement}
                {options.titleElement}
            </div>
        );
    };
    const openItemInNewTab=(item:TempPawnModel)=>{
        window.open("/tpawn-item/"+item.code,"_blank")
    }
    useEffect(() => {
        filterList()
    }, [ftype,fromValue,toValue,filterStatusTags,filterWarehouses,warehouseStatus,filterCustomerName,filterNumberic])
    useEffect(() => {
        if(search!==undefined&&search!==''){
            //const status=pawnStatus[activeIndex]
            const key=removeVietnameseTones(search.toLowerCase())
            let filtered=pawnState.list.filter(
                item=>item.code.toLowerCase().includes(key) 
                || removeVietnameseTones(item.customer.toLowerCase()).includes(key) 
                || item.date.toLocaleDateString().includes(key)
                || item.value===Number(key.replace(/,|\./g,""))
                || item.productType.toLowerCase().includes(key)
                || item.numbericalOrder&&item.numbericalOrder.toLowerCase().includes(key)
                || item.product&&item.product.toLowerCase().includes(key)
                || item.note&&removeVietnameseTones(item.note.toLowerCase()).includes(key)
            )
            //filtered=filtered.filter(item=>item.status===status)
            if(ftype!=''){
                filtered=filtered.filter(item=>item.productType===ftype)
            }
            dispatch(setFilteredList(filtered))
        }
        else{
            filterList()
        }
    }, [search])
    useEffect(()=>{
        switch(pawnState.status){
            case "completed":
                let products=pawnState.list.map((e)=>e.product)
                products=[...new Set(products)]
                dispatch(setPawnProducts(products))
                filterList()
                break
            case "failed":
                failed(pawnState.error)
                break
        }
    },[pawnState.status])
    useEffect(()=>{
        setTotalPages(Math.ceil(filteredList.length/rows))
    },[filteredList])
    useEffect(()=>{
        dispatch(fetchAll({from:dateToYMDFormat(fromdate,'-',0),to:dateToYMDFormat(todate,'-',0)}))
    },[])
    useEffect(() => {
        switch (categoryState.status) {
            case 'failed':
                failed(categoryState.error);
                break;
            case 'completed':
                setTags(categoryState.data.pawntags??[])
                setWarehouses(categoryState.data.pawnwarehouses??[])
                dispatch(setFetched(true))
                break;
        }
    }, [categoryState.status])
    useEffect(() => {
        if(!categoryState.fetched){
            dispatch(fetchCategories({categories:["pawntags","pawnwarehouses"]}))
        }
    },[categoryState.fetched])
    return <>
        <div className='mb-3'>
            <Card 
            body={
                pawnState.status === 'loading'?
                    <ContentLoading.ItemCardHolder contentRows={1} items={10} image={false} uniqueKey="holder-item"/>:
                <>
                <TabView activeIndex={activeIndex} onTabChange={(e)=>{
                        //dispatch(setFilters({from:fromdate,to:todate,tab:e.index,fromValue:fromValue,toValue:toValue}))
                        dispatch(setFiltersByKey({key:"tab",value:e.index}))
                        setActiveIndex(e.index)
                }}>
                        <TabPanel header={"Cầm mới"+` (${pawnState.filteredList.filter(item=>item.status==='ACTIVE'&&!item.disabled).length})`} leftIcon="ri-sticky-note-add-fill icon-on-list me-1" headerTemplate={goldTabHeaderTemplate}>  
                        </TabPanel>
                        <TabPanel header={"Chờ duyệt"+` (${pawnState.filteredList.filter(item=>item.status==='UNVERIFY'&&!item.disabled).length})`} leftIcon="ri-questionnaire-line icon-on-list me-1" headerTemplate={goldTabHeaderTemplate}>
                        </TabPanel>
                        <TabPanel header={"Đã duyệt"+` (${pawnState.filteredList.filter(item=>item.status==='VERIFY'&&!item.disabled).length})`} leftIcon="ri-check-double-line icon-on-list me-1" headerTemplate={goldTabHeaderTemplate}>   
                        </TabPanel>
                        <TabPanel header={"Chờ tất toán"+` (${pawnState.filteredList.filter(item=>item.status==='WAIT'&&!item.disabled).length})`} leftIcon="ri-file-edit-fill icon-on-list me-1" headerTemplate={goldTabHeaderTemplate}>
                        </TabPanel>
                        <TabPanel header={"Đã tất toán"+` (${pawnState.filteredList.filter(item=>item.status==='REDEEM'&&!item.disabled).length})`} leftIcon="ri-money-dollar-circle-line icon-on-list me-1" headerTemplate={goldTabHeaderTemplate}>
                        </TabPanel>
                        <TabPanel header={"Chờ thanh lý"+` (${pawnState.filteredList.filter(item=>item.status==='UNLIQUID'&&!item.disabled).length})`} leftIcon="ri-scissors-cut-line icon-on-list me-1" headerTemplate={goldTabHeaderTemplate}>
                        </TabPanel>
                        <TabPanel header={"Đã thanh lý"+` (${pawnState.filteredList.filter(item=>item.status==='LIQUID'&&!item.disabled).length})`} leftIcon="ri-scissors-2-fill icon-on-list me-1" headerTemplate={goldTabHeaderTemplate}>
                        </TabPanel>
                        <TabPanel header={"Đã xóa"+` (${pawnState.filteredList.filter(item=>item.disabled).length})`} leftIcon="ri-close-circle-line icon-on-list me-1" headerTemplate={goldTabHeaderTemplate}>  
                        </TabPanel>
                </TabView>
                {filteredList.length > 0 ?
                    <>{filteredList.map((item, index) => {
                        if (index >= first && index < (first + rows)){
                            const type=tempPawnTypes.find(e=>e.code===item.productType)
                            return <div className="pt-2" key={"item-" + index}>
                                <ItemCard
                                    uniqueKey={""}
                                    onClick={() => dispatch(selectItem(item))}
                                    active={item.active}
                                    body={<>
                                        <div className="d-flex justify-content-between">
                                            <div className="d-flex">
                                                <div className={`fami-text-primary me-1 ${item.disabled ? 'disabled-text' : ''}`}><b>{item.code}</b></div>
                                                <div>{item.disabled ? <i className="ri-close-line my-error"></i> : item.status==="REDEEM"?<i className="ri-check-double-line text-primary"></i>: <i className="ri-check-line my-success"></i>}</div>
                                                {["UNLIQUID","LIQUID"].includes(item.status)&&item.liquidDate&&<div className="px-1">Ngày thanh lý: {item.liquidDate.toLocaleDateString()}</div>}
                                                {["WAIT","REDEEM"].includes(item.status)&&item.redeemDate&&<div className="px-1">Ngày tất toán: {item.redeemDate.toLocaleDateString()}</div>}
                                            </div>
                                            <div className="d-flex">
                                                <div className="text-secondary">{item.product}</div>
                                                <i className="ri-external-link-line fami-text-primary ms-3" onClick={()=>openItemInNewTab(item)}></i>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <div><i className="ri-user-line fami-text-primary icon-on-list"></i> {item.customer} {item.numbericalOrder&&item.numbericalOrder!==''?' - '+item.numbericalOrder:''}</div>
                                            </div>
                                            <div className="col-sm-2">
                                                <div><i className="ri-timer-flash-line fami-text-primary icon-on-list"></i> {item.date.toLocaleDateString()}</div>
                                            </div>
                                            <div className="col-sm-2">
                                                <div><i className="ri-money-dollar-circle-line fami-text-primary icon-on-list"></i>  <MonneyFormat value={item.value} positiveColor={"fami-text-primary"} unit={"đ"} decimal={false} /></div>
                                            </div>

                                            <div className="col-sm-2">
                                                <div><i className="ri-list-view fami-text-primary icon-on-list"></i> {type?type.name:''}</div>
                                            </div>
                                            <div className="col-sm-3">
                                                {isValidAction(limitedActions, "VTA")?<div><i className="ri-price-tag-3-line fami-text-primary icon-on-list"></i> {item.tags?item.tags.join(','):''}</div>:<></>}
                                            </div>
                                        </div>


                                    </>}
                                    background={item.disabled ? 'disabled-element' : "active-item-card-background"}
                                    onDoubleClick={() => handleActionClick(item, "VIE")} 
                                    contextMenu={[]}
                                    />
                            </div>;
                        }
                    })}</> :
                    <EmptyBox description={<>Chưa có phiếu nào</>} image={Assets.images.emptyBox3} disabled={false} />}
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
                                    //dispatch(setFilters({from:e.target.value as Date,to:todate,tab:activeIndex,fromValue:fromValue,toValue:toValue}))
                                    dispatch(setFiltersByKey({key:"from",value:e.target.value as Date}))
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
                                    //dispatch(setFilters({from:fromdate,to:e.target.value as Date,tab:activeIndex,fromValue:fromValue,toValue:toValue}))
                                    dispatch(setFiltersByKey({key:"to",value:e.target.value as Date}))
                                    setFilterChanged(true)
                                } }
                                placeholder="Đến ngày"
                                style={{ width: "100%", borderRadius: "10px" }} />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button disabled={!filterChanged} className='btn btn-primary' onClick={()=>{
                            op.current.hide()
                            fetchList()
                            }
                            }><i className="ri-check-double-line"></i> Áp dụng</button>
                    </div>
                    <div className="row pb-2">
                        <div className="form-group col-sm-6">
                            <label htmlFor="from-date">Giá trị từ:</label>
                            <NumericFormat
                                className={`p-inputtext`}
                                value={fromValue}
                                thousandSeparator="."
                                decimalSeparator=","
                                decimalScale={0}
                                style={{ width: "100%", textAlign: "right" }}
                                onChange={(e) =>{
                                    const value=Number(e.target.value.split('.').join('').split(',').join('.'))
                                    setFromValue(value)
                                    //dispatch(setFilters({from:fromdate,to:todate,tab:activeIndex,fromValue:value,toValue:toValue}))
                                    dispatch(setFiltersByKey({key:"fromValue",value:value}))
                                    }} 
                                />
                        </div>
                        <div className="form-group col-sm-6">
                            <label htmlFor="to-date">Đến giá trị:</label>
                            <NumericFormat
                                className={`p-inputtext`}
                                value={toValue}
                                thousandSeparator="."
                                decimalSeparator=","
                                decimalScale={0}
                                style={{ width: "100%", textAlign: "right" }}
                                onChange={(e) =>{
                                    const value=Number(e.target.value.split('.').join('').split(',').join('.'))
                                    setToValue(value)
                                    //dispatch(setFilters({from:fromdate,to:todate,tab:activeIndex,fromValue:fromValue,toValue:value}))
                                    dispatch(setFiltersByKey({key:"toValue",value:value}))
                                    }} 
                                />
                        </div>
                    </div>
                    <div className="row pb-2">
                        <div className="form-group col-sm-12">
                            <label htmlFor="from-date">Loại sản phẩm:</label>
                            <Dropdown
                                filter
                                value={ftype}
                                options={[ {code:"",name:"Tất cả"},...tempPawnTypes]}
                                optionValue="code"
                                optionLabel="name"
                                onChange={(e)=>{
                                    setFtype(e.target.value)
                                }}
                                placeholder=''
                                style={{ width: '100%' ,borderRadius: 8}}/>
                        </div>
                        <div className="form-group col-sm-6">
                            <label htmlFor="from-date">Kho:</label>
                            <MultiSelect 
                                filter
                                value={filterWarehouses} 
                                onChange={(e) => {
                                    dispatch(setFiltersByKey({key:"warehouse",value:e.target.value}))
                                    setFilterWarehouses(e.target.value)
                                }}
                                options={warehouses} 
                                //disabled={disableInput||!isValidAction(limitedActions, "MTG")}
                                optionLabel="name" 
                                optionValue="code"
                                display="chip"
                                maxSelectedLabels={3} 
                                placeholder="Chọn các kho"
                                style={{ width: '100%' ,borderRadius: 8}}
                                />
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label">Trạng thái</label>
                            <Dropdown
                                value={warehouseStatus}
                                options={["ALL","YES","NO"]}
                                itemTemplate={statusTemplate}
                                valueTemplate={statusTemplate}
                                onChange={(e)=>{
                                    setExtraFilter(true)
                                    dispatch(setFiltersByKey({key:'warehouseStatus',value:e.value}))
                                    setWarehouseStatus(e.value)
                                }}
                                placeholder=''
                                style={{ width: '100%' ,borderRadius: 8}}/>
                        </div>
                        
                    </div>
                    <div className="row pb-2">
                        <div className="form-group col-sm-6">
                            <label className="form-label">Tên khách hàng</label>
                            <InputText 
                                value={filterCustomerName}
                                onChange={(e)=>{
                                    setFilterCustomerName(e.target.value)
                                    setExtraFilter(true)
                                }}
                                className="w-100"
                                />
                        </div>
                        <div className="form-group col-sm-6">
                            <label className="form-label">STT</label>
                            <InputNumber 
                                value={filterNumberic===''?null:Number(filterNumberic)}
                                onChange={(e)=>{
                                    setFilterNumberic(e.value?e.value.toString():'')
                                    setExtraFilter(true)
                                }}
                                className="w-100"
                                />
                        </div>
                        {isValidAction(limitedActions, "VTA")&&
                        <>
                            <div className="col-sm-6">
                                <label className="form-label">Thẻ</label>
                                <MultiSelect 
                                    filter
                                    value={filterTags} 
                                    onChange={(e) => {
                                        dispatch(setFiltersByKey({key:"tags",value:e.target.value}))
                                        setFilterTags(e.target.value)
                                        setExtraFilter(true)
                                        let statusArr:any[]=[]
                                        for (let index = 0; index < e.target.value.length; index++) {
                                            const element = e.target.value[index];
                                            const tag=tags.find(e=>e.code===element)
                                            statusArr.push({
                                                code:element,
                                                name:tag.name,
                                                status:"ALL"
                                            })
                                        }
                                        setFilterStatusTags(statusArr)
                                    }}
                                    options={tags} 
                                    //disabled={disableInput||!isValidAction(limitedActions, "MTG")}
                                    optionLabel="name" 
                                    optionValue="code"
                                    display="chip"
                                    maxSelectedLabels={3} 
                                    placeholder="Chọn các thẻ"
                                    style={{ width: '100%' ,borderRadius: 8}}
                                    />
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label">Trạng thái</label>
                                {filterStatusTags.map((t,i)=>{
                                    
                                    return <div key={"tag-"+i} className="d-flex justify-content-between align-items-center py-1">
                                        <div>{t.name}</div>
                                        <SelectButton  className="module" value={t.status} onChange={(e) => {
                                            const update=deepCloneObject(filterStatusTags)
                                            update[i].status=e.value
                                            setFilterStatusTags(update)
                                        }} options={["ALL","YES","NO"]} />
                                    </div>
                                })}
                            </div>
                        </>
                        
                        }
                    </div>
                    <div className="d-flex justify-content-end">
                        <button disabled={!extraFilter} className='btn btn-outline-danger me-2' onClick={()=>resetFilter()}><i className="ri-close-line"></i> Bỏ lọc</button>
                                
                    </div>
                    
                </OverlayPanel>
            </>}
            title={<div style={{ cursor: "pointer" }} onClick={(e) => op.current.toggle(e)}><i className="ri-filter-2-fill"></i> Danh sách phiếu cầm</div>}
            tool={<div className="d-flex">
                    <ActionButton action={"INS"} className={"me-2"} onClick={() => {handleActionClick(TempPawnModel.initial(), "INS")}} minimumEnable={true} label={"Thêm"}/>
                    <ActionButton action={"IMP"} className={"me-2"} onClick={() => navigate('/tpawn-import')} minimumEnable={true} label={"Import"}/>
                    <ActionButton action={"EXC"} className={"me-2"} onClick={() => handleActionClick(TempPawnModel.initial(), "EXC")} minimumEnable={true} label={"Excel"}/>
                    <button className='btn btn-primary' onClick={()=>fetchList()}><i className="ri-restart-line"></i> Reload</button>
                </div>}
            isPadding={true} className={""}/>

                <EmptyHeight height={48}/>
                <div className='fixed-bottom'>
                    <div className="row">
                        <div className="col-md-7"></div>
                        <div className="col-md-2">
                        {isValidAction(limitedActions, "VQT")?<div className="d-flex">
                                <div className="me-2 align-self-end">Tổng phiếu:</div>
                                <b><MonneyFormat value={filteredList.length} positiveColor={"fami-text-primary fw-bold"} unit={""} decimal={false}/></b>
                            </div>
                            :<></>
                        }
                        </div>
                        <div className="col-md-3">
                        {isValidAction(limitedActions, "VVL")?<div className="d-flex">
                                <div className="me-2 align-self-end">Tổng giá trị:</div>
                                <b><MonneyFormat value={filteredList.reduce((sum, el) => sum += el.value, 0)} positiveColor={"fami-text-primary fw-bold"} unit={"đ"} decimal={false}/></b>
                            </div>
                            :<></>
                        }
                        </div>
                    </div>
                </div>
            
        </div>
    </>
}