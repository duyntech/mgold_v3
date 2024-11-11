import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { isPhone, removeVietnameseTones } from "../../utils/util";
import { SupplierModel } from "../../model/Supplier.model";
import { actions, status } from "../../types";
import { FormikErrors, useFormik } from "formik";
import { addItem, changeAction, deleteItem, editItem, fetchAll, resetActionState, restoreItem, selectItem, setFilteredList } from "../../slices/supplier/supplier.slice";
import { completed, failed, processing, warningWithConfirm } from "../../utils/alert";
import { ContentLoading, DynamicDialog, EmptyBox, EmptyHeight, StatusDropdown } from "../../components/commons";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { getFormErrorMessageString, isFormFieldInvalid } from "../../utils/validate";
import ActionButton from "../../components/action/ActionButton";
import FormAction from "../../components/commons/FormAction";
import Card from "../../components/commons/Card";
import ItemCard from "../../components/commons/ItemCard";
import Assets from "../../assets";
import { Paginator } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";
import { DropdownChangeEvent } from "primereact/dropdown";
import { t } from "i18next";
export default function AllSupplier(){
    const dispatch = useAppDispatch()
    const supplierState = useAppSelector((state) => state.supplier);
    const search=useAppSelector((state)=>state.header.search);
    const filteredList=supplierState.filteredList;
    const [isShowDialog, setIsShowDialog] = useState(false);
    const disableInput = !["INS", "UPD"].includes(supplierState.action);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);
    const [totalPages, setTotalPages] = useState(Math.ceil(filteredList.length/rows));
    const isPhoneDevice=isPhone();
    const [status, setStatus] = useState<status>("ACTIVE");
    const op = useRef<any>(null);
    const formik = useFormik<SupplierModel>({
        initialValues: SupplierModel.initial(),
        validate: (data) => {
            const errors:FormikErrors<SupplierModel> = {};
            if (!data.code) {
                errors.code = 'Vui lòng nhập mã nhà cung cấp';
            }
            if (!data.name) {
                errors.name = 'Vui lòng nhập tên nhà cung cấp';
            }
            return errors;
        },
        onSubmit: (data:SupplierModel) => {
            let submitData={
                id:data.id,
                code:data.code,
                name:data.name,
                address:data.address===''?null:data.address,
                phone:data.phone===''?null:data.phone,
                tax_code:data.tax_code===''?null:data.tax_code,
                standard:data.standard===''?null:data.standard
            }
            switch (supplierState.action) {
                case "INS":
                    dispatch(addItem(submitData));
                break
                case "UPD":
                    dispatch(editItem(submitData));
                break
                case "DEL":
                    warningWithConfirm({
                        title: "Xóa",
                        text: "Bạn muốn xóa Nhà cung cấp "+data.name +" ?",
                        confirmButtonText: "Đồng ý",
                        confirm: ()=>{
                            dispatch(deleteItem(data))
                        }
                    })
                break
            }
        }
    });
    const onPageChange = (event:any) => {
        //console.log(event)
        setFirst(event.first);
        setRows(event.rows);
        setTotalPages(event.pageCount);
        setPage(event.page+1);
    };
    const handleActionClick=(item:SupplierModel, action:actions)=>{ 
        if(action==="DEL"){
            //console.log(item)
            warningWithConfirm({
                title: "Xóa",
                text: "Bạn muốn xóa thẻ "+item.name +" ?",
                confirmButtonText: "Đồng ý",
                confirm: ()=>{
                    dispatch(deleteItem(item));
                }
            })
            
        }
        else{
            dispatch(changeAction(action));  
            setIsShowDialog(true);
            formik.setValues(item)
        }
    }
    const handleCancel = () => {
        setIsShowDialog(false);
        formik.resetForm();
    }
    const handleRestore = () => {
        dispatch(restoreItem(formik.values));
    }
    const filterList=()=>{
        let filtered=supplierState.list
        if(status!=="ALL"){
            filtered=filtered.filter(
                item=>item.disabled===(status==="DEACTIVE"))
        }
        dispatch(setFilteredList(filtered))
    }
    useEffect(() => {
        filterList()
    }, [status])
    useEffect(() => {
        switch (supplierState.statusAction) {
            case 'failed':
                failed(supplierState.error);
                dispatch(resetActionState(''));
                break;
            case "loading":
                processing();
                break;
            case 'completed':
                completed();
                dispatch(resetActionState(''));
                handleCancel()
                //formik.setValues(supplierState.item)
                dispatch(fetchAll({}))
                break;
        }
    }, [supplierState,dispatch])
    useEffect(() => {
        if (supplierState.status === 'failed') {
            failed(supplierState.error);
        }
        if(supplierState.status==="completed"){
            filterList()
            setTotalPages(Math.ceil(filteredList.length/rows))
        
        }
    }, [supplierState.status])
    useEffect(() => {
        if(search!==undefined&&search!==''){
            const filtered=supplierState.list.filter(
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
        dispatch(fetchAll({}))
    }, [])
    return (
        <div>
            <DynamicDialog visible={isShowDialog} position={undefined} 
            title={<>Nhà cung cấp</>} 
            body={
                <div className="p-2">
                <div className="row mb-2">
                    <div className="col-md-12">
                    <label className="form-label">Mã nhà cung cấp<b className="text-danger">*</b></label>
                    <InputText
                        disabled={supplierState.action!=="INS"}
                        id="code"
                        name="code"
                        value={formik.values.code}
                        onChange={(e) => {
                            formik.setFieldValue('code', e.target.value);
                            }}
                        className={classNames('form-group',{'p-invalid': isFormFieldInvalid('code',formik) })}
                        style={{ width: '100%', borderRadius: 8 }} />
                    </div>
                </div>

                <div className="row mb-2">
                    <div className="col-md-12">
                    <label className="form-label">Tên nhà cung cấp<b className="text-danger">*</b></label>
                    <InputText
                        disabled={disableInput}
                        id="name"
                        name="name"
                        placeholder={isFormFieldInvalid('name',formik) ? getFormErrorMessageString("name",formik): ''}
                        value={formik.values.name}
                        onChange={(e) => {
                            formik.setFieldValue('name', e.target.value);
                            }}
                        className={classNames('form-group',{'p-invalid': isFormFieldInvalid('name',formik) })}
                        style={{ width: '100%', borderRadius: 8 }} />
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-md-12">
                    <label className="form-label">Điện thoại</label>
                    <InputText
                        disabled={disableInput}
                        placeholder={"Só điện thoại"}
                        value={formik.values.phone}
                        onChange={(e) => {
                            formik.setFieldValue('phone', e.target.value);
                            }}
                        className={"form-group"}
                        style={{ width: '100%', borderRadius: 8 }} />
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-md-12">
                    <label className="form-label">Mã số thuế</label>
                    <InputText
                        disabled={disableInput}
                        placeholder={""}
                        value={formik.values.tax_code}
                        onChange={(e) => {
                            formik.setFieldValue('tax_code', e.target.value);
                            }}
                        className={"form-group"}
                        style={{ width: '100%', borderRadius: 8 }} />
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-md-12">
                    <label className="form-label">Địa chỉ</label>
                    <InputText
                        disabled={disableInput}
                        placeholder={""}
                        value={formik.values.address}
                        onChange={(e) => {
                            formik.setFieldValue('address', e.target.value);
                            }}
                        className={"form-group"}
                        style={{ width: '100%', borderRadius: 8 }} />
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-md-12">
                    <label className="form-label">Tiêu chuẩn cơ sở</label>
                    <InputText
                        disabled={disableInput}
                        placeholder={"Tiêu chuẩn cơ sở sản xuất"}
                        value={formik.values.standard}
                        onChange={(e) => {
                            formik.setFieldValue('standard', e.target.value);
                            }}
                        className={"form-group"}
                        style={{ width: '100%', borderRadius: 8 }} />
                    </div>
                </div>
            </div>
            } 
            footer={
                <>
                <button type='button' className='btn btn-outline-danger' onClick={()=>handleCancel()}><i className='ri-close-line'></i> <span className="list-action-label">{t("action.close")}</span></button>
                {supplierState.action==='VIE'?
                    formik.values.disabled?
                    <ActionButton action={"UND"} className={""} minimumEnable={false} label={"Phục hồi"} onClick={()=>handleRestore()}/>
                    :
                    <>
                        <ActionButton action={"UPD"} className={""} minimumEnable={false} label={"Sửa"} onClick={()=>dispatch(changeAction("UPD"))}/>
                        <ActionButton action={"DEL"} className={""} minimumEnable={false} label={"Xóa"} onClick={()=>handleActionClick(formik.values,"DEL")}/>
                    </>
                :<></>}
                <FormAction action={supplierState.action} onClick={formik.handleSubmit}/>
                </>
            } 
            draggable={false} 
            resizeable={false} 
            onClose={()=>handleCancel()} 
            />

            <Card 
                body={
                supplierState.status === 'loading'?
                            <ContentLoading.ItemCardHolder contentRows={1} items={10} image={false} uniqueKey="goldgroup-holder-item"/>:
                <>
                    {
                    filteredList.length>0?
                        filteredList.map((item, index)=>{
                            return <div className="pt-2" key={"supplier-item" + index}>
                            <ItemCard 
                                    uniqueKey={""}
                                    active={item.active}
                                    body={<>
                                        <div className="d-flex justify-content-between">
                                            <div className="d-flex">
                                                <div className={`fami-text-primary me-1 ${item.disabled ? 'disabled-text' : ''}`}><b>{item.name}</b></div>
                                                <div>{item.disabled ? <i className="ri-close-line my-error"></i> : <i className="ri-check-line my-success"></i>}</div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <div><i className="ri-codepen-line fami-text-primary icon-on-list"></i> {item.code}</div>
                                            </div>
                                            <div className="col-sm-9">
                                                {/* <div><i className="ri-sticky-note-line fami-text-primary icon-on-list"></i> {item.description}</div> */}
                                            </div>
                                        </div>
                                    </>}
                                    background={item.disabled ? 'disabled-element' : "active-item-card-background"}
                                    onClick={() => dispatch(selectItem(item.id))}
                                    onDoubleClick={()=>handleActionClick(item,"VIE")} 
                                    contextMenu={[]}
                                    />
                            </div>;
                        })
                        :<EmptyBox description={<>Chưa có dữ liệu</>} image={Assets.images.emptyBox1} disabled={false}/>
                        }
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
                            <></>
                        }
                    <OverlayPanel ref={op} style={{width:"300px"}}>
                                
                                <div className="row pb-2">
                                    <div className="form-group col-sm-12">
                                        <label htmlFor="from-date">Trạng thái:</label>
                                        <StatusDropdown 
                                            value={status} onChange={(e:DropdownChangeEvent) => {
                                                setStatus(e.value)
                                                }
                                            }/>
                                        
                                    </div>
                                </div>
                                <EmptyHeight height={30} />
                            </OverlayPanel>
                    
                </>
                }
                title={<div style={{ cursor: "pointer" }} onClick={(e) => op.current.toggle(e)}><i className="ri-filter-2-fill"></i> Danh sách nhà cung cấp</div>}
                tool={
                <div className="d-flex">
                    <ActionButton action={"INS"} className={""} onClick={() => handleActionClick(SupplierModel.initial(), "INS")} minimumEnable={true} label={"Thêm"}/>
                </div>
                }
                isPadding={true} 
                className={""} 
            />
            <EmptyHeight height={48}/>
        </div>
    );
}