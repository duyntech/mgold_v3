import { useNavigate } from "react-router-dom";
import { EmptyBox, EmptyHeight } from "../../components/commons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as xlsx from 'xlsx';
import FormAction from "../../components/commons/FormAction";
import { t } from "i18next";
import Card from "../../components/commons/Card";
import { Button } from "primereact/button";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { dateToSubmit, isPhone } from "../../utils/util";
import ItemCard from "../../components/commons/ItemCard";
import Assets from "../../assets";
import { Paginator } from "primereact/paginator";
import { tempPawnTypes } from "../../utils/constants/const";
import { completed, failed, processing, warning } from "../../utils/alert";
import { importItem, resetActionState } from "../../slices/pawn/temppawn.slice";
export default function TempPawnImport(){
    const navigate = useNavigate()
    const dispatch=useAppDispatch()
    const pawnState=useAppSelector(state=>state.temppawn)
    const fileRef = useRef<HTMLInputElement>(null);
    const [pawns, setPawns] = useState<any[]>([]);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);
    const [fileName, setFileName] = useState('');
    const isPhoneDevice=isPhone()
    const [totalPages, setTotalPages] = useState(Math.ceil(pawns.length/rows))
    const onPageChange = (event:any) => {
        //console.log(event)
        setFirst(event.first);
        setRows(event.rows);
        setTotalPages(event.pageCount);
        setPage(event.page+1);
    };
    const handleCancel = () => {
        navigate(-1)
      }
    const handleImport = () => {
        const submitData={
            votes:pawns
        }
        const invalidType=pawns.find(e=>!tempPawnTypes.map((i)=>i.code).includes(e.product_type))
        if(invalidType){
            warning({title:"Loại sản phẩm "+invalidType.product_type+" chưa được khai báo!",onClose:()=>{}})
        }
        else{
            dispatch(importItem(submitData))
        }
    }
    const handleFileSelect = (e:ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target!.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet) ;
                let pArr:any[]=[]
                const createUser=localStorage.getItem("userId")
                const codeStore=localStorage.getItem("branch")
                for (let index = 0; index < json.length; index++) {
                    const item = Object(json[index]);
                    //console.log(item)
                    pArr.push({
                        _id: "",
                        code: item.code,
                        customer: item.customer,
                        value: Number(String(item.value).replace(/\./g,"")),
                        date: dateToSubmit(item.date),
                        product: item.product ?? null,
                        product_type: item.type ?? null,
                        note:null,
                        create_user:createUser,
                        code_store:codeStore
                    })
                }
                //console.log(pArr);
                setPawns(pArr)
                setTotalPages(Math.ceil(pArr.length/rows))
            };
            reader.readAsArrayBuffer(e.target.files[0]);
            const selectedFile=e.target.files?.item(0);
            setFileName(selectedFile!.name)
            e.target.value=''
        }
        
    }
    const uploadClick = () => {
        fileRef.current?.click();
    }
    const clearSelectedFile = () => {
        setFileName('');
        setTotalPages(0);
        setPawns([])
    }
    useEffect(()=>{
        switch (pawnState.statusAction) {
            case 'failed':
                failed(pawnState.error);
                dispatch(resetActionState(''));
                break;
            case "loading":
                processing();
                break;
            case 'completed':
                completed();
                //dispatch(setReload(true))
                dispatch(resetActionState(''))
                handleCancel()
                break;
        }
    },[pawnState.statusAction])
    return <>
        <div className="row">
            <div className="col-sm-1"></div>
            <div className="col-sm-3">
                <Card 
                        body={<>
                            <div className="p-inputgroup w-100">
                                    <Button label="Chọn tệp" style={{fontSize:9,padding:0,width:100}} onClick={uploadClick} />
                                    <div className="position-relative w-100">
                                        <InputText
                                            value={fileName}
                                            disabled
                                            placeholder=""
                                            
                                            style={{width: "100%",borderRadius: 8,borderTopLeftRadius:0,borderBottomLeftRadius:0}}
                                        />
                                        {
                                            fileName!=''?
                                            <i className="ri-close-circle-line position-absolute text-danger" 
                                                onClick={clearSelectedFile}
                                                style={{right:8,top:8,cursor:"pointer"}}/>
                                            :<></>
                                        }
                                        
                                    </div>
                                    <input  className="file-upload" type="file" ref={fileRef} accept=".xlsx" onChange={e=>handleFileSelect(e)}/>
                            </div>
                            <a href={"CAMDO.xlsx"} download="CAMDO.xlsx"> Download Template </a>
                        </>} 
                        title={<>Import danh phiếu cầm</>} 
                        tool={<></>} 
                        isPadding={true} 
                        className={""}
                    />
            </div>
            <div className="col-sm-7">
                <Card 
                    body={
                        <>
                            
                        {pawns.length>0?pawns.map((item,index)=>{
                                    if (index >= first && index <= (first + rows)){
                                    return <div className="pt-2" key={"import-item-"+index}>
                                        <ItemCard 
                                            uniqueKey={""}
                                            active={false}
                                            body={<>
                                                
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <div>Mã: {item.code}</div>
                                                        <div>Khách hàng: {item.customer}</div>
                                                    </div>
                                                    
                                                    <div className="col-sm-3">
                                                        <div>Tiền vay: {(item.value !== null && item.value !== undefined ? item.value : 0).toLocaleString('de-DE')}đ</div>
                                                        
                                                        <div>Ngày: {item.date}</div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div>Loại sản phẩm: {item.product_type}</div>
                                                        
                                                        <div>Sản phẩm: {item.product}</div>
                                                    </div>
                                                </div>
                                                
                                            </>}
                                            background={"active-item-card-background"}
                                            onClick={()=>{}} 
                                            onDoubleClick={()=>{}}
                                             contextMenu={[]}/>
                                    </div>
                                }

                                
                            }):<EmptyBox description={<>Chưa có sản phẩm nào</>} image={Assets.images.emptyBox1} disabled={false} />}
                            {totalPages > 1 ?
                            <>{isPhoneDevice ?
                                <Paginator
                                    first={first}
                                    rows={rows}
                                    totalRecords={pawns.length}
                                    rowsPerPageOptions={[10, 20, 30]}
                                    onPageChange={onPageChange}
                                    template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }}
                                    currentPageReportTemplate={` ${page}/${totalPages}`} /> :
                                <Paginator
                                    first={first}
                                    rows={rows}
                                    totalRecords={pawns.length}
                                    rowsPerPageOptions={[10, 20, 30]}
                                    onPageChange={onPageChange} />}</> :
                            <></>}
                            <div className="p-2 fw-bold">Tổng:</div>
                            <div className="row px-2">
                                <div className="col-sm-3">
                                    <div>Số phiếu: <b className="fami-text-primary">{pawns.length}</b></div>
                                </div>
                                
                                <div className="col-sm-9">
                                    <div>Tiền vay: <b className="fami-text-primary">{pawns.length>0?pawns.reduce((sum,el)=>sum+=el.value,0).toLocaleString('de-DE'):0}đ</b></div>
                                </div>
                            </div>
                        </>
                    } 
                    title={<><i className="ri-list-ordered-2"></i> Danh sách phiếu</>} 
                    tool={<></>} 
                    isPadding={true} className={""}
                />
            </div>
            <div className="col-sm-1"></div>
        </div>
        <EmptyHeight height={48}/>
        <div className='fixed-bottom'>
                <div className='d-flex justify-content-end'>
                    <button type='button' className='btn btn-outline-danger me-2' onClick={()=>handleCancel()}><i className='ri-close-line'></i> <span className="list-action-label">{t("action.close")}</span></button>
                    <FormAction action={"INS"} onClick={()=>handleImport()}/>
                </div>
        </div>
    </>
}