import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ContentLoading, DynamicDialog, EmptyBox, EmptyHeight, StatusDropdown } from "../../components/commons";
import Card from "../../components/commons/Card";
import ItemCard from "../../components/commons/ItemCard";
import { addItem, changeAction, deleteItem, editItem, fetchAll, resetActionState, restoreItem, selectItem, setFilteredList } from "../../slices/tag/tag.slice";
import { TagModel } from "../../model";
import { InputText } from "primereact/inputtext";
import { completed, failed, processing, warningWithConfirm } from "../../utils/alert";
import { InputTextarea } from 'primereact/inputtextarea';
import { FormikErrors, useFormik } from "formik";
import { classNames } from "primereact/utils";
import { actions, status } from "../../types";
import FormAction from "../../components/commons/FormAction";
import { isFormFieldInvalid, getFormErrorMessageString } from "../../utils/validate";
import ActionButton from "../../components/action/ActionButton";
import Assets from "../../assets";
import { t } from "i18next";
import { isPhone, removeVietnameseTones } from "../../utils/util";
import { Paginator } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { SelectButton } from "primereact/selectbutton";
        
export default function AllTag() {
    const dispatch = useAppDispatch()
    const tagState = useAppSelector((state) => state.tag);
    const search=useAppSelector((state)=>state.header.search);
    const filteredList=tagState.filteredList;
    const [isShowDialog, setIsShowDialog] = useState(false);
    const disableInput = !["INS", "UPD"].includes(tagState.action);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);
    const [totalPages, setTotalPages] = useState(Math.ceil(filteredList.length/rows));
    const isPhoneDevice=isPhone();
    const [status, setStatus] = useState<status>("ACTIVE");
    const [hot,setHot]=useState('ALL')
    const [alpha,setAlpha]=useState('')
    const op = useRef<any>(null);
    const formik = useFormik<TagModel>({
        initialValues: TagModel.initial(),
        validate: (data) => {
            const errors:FormikErrors<TagModel> = {};
            if (!data.code) {
                errors.code = 'Vui lòng nhập mã thẻ';
            }
            if (!data.name) {
                errors.name = 'Vui lòng nhập tên thẻ';
            }
            return errors;
        },
        onSubmit: (data:TagModel) => {
            switch (tagState.action) {
                case "INS":
                    dispatch(addItem(data));
                break
                case "UPD":
                    dispatch(editItem(data));
                break
                case "DEL":
                    warningWithConfirm({
                        title: "Xóa",
                        text: "Bạn muốn xóa thẻ "+data.name +" ?",
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
    const handleActionClick=(item:TagModel, action:actions)=>{ 
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
        let filtered=tagState.list
        if(status!=="ALL"){
            filtered=filtered.filter(
                item=>item.disabled===(status==="DEACTIVE"))
        }
        switch (hot) {
            case 'HOT':
                filtered=filtered.filter(
                    item=>item.is_hot)
                break;
            case 'NOR':
                filtered=filtered.filter(
                    item=>!item.is_hot)
                break;
        }
        if(alpha&&alpha!==''){
            filtered=filtered.filter(e=>e.name.toUpperCase().charAt(0)===alpha)
        }
        dispatch(setFilteredList(filtered))
        setFirst(0);
        setTotalPages(Math.ceil(filtered.length/rows))
        setPage(1);
    }
    const hotTemplate=(value:string)=>{
        return (
            <div className="d-flex">
                <div>{value!=="ALL"?value==="HOT"?'Hot':'Bình thường':'Tất cả'}</div>
            </div>
        );
    };
    useEffect(() => {
        filterList()
    }, [status,hot,alpha])
    useEffect(() => {
        switch (tagState.statusAction) {
            case 'failed':
                failed(tagState.error);
                dispatch(resetActionState(''));
                break;
            case "loading":
                processing();
                break;
            case 'completed':
                completed();
                dispatch(resetActionState(''));
                handleCancel()
                //formik.setValues(tagState.item)
                dispatch(fetchAll({}))
                break;
        }
    }, [tagState,dispatch])
    useEffect(() => {
        if (tagState.status === 'failed') {
            failed(tagState.error);
        }
        if(tagState.status==="completed"){
            filterList()
            //setTotalPages(Math.ceil(filteredList.length/rows))
        
        }
    }, [tagState.status])
    useEffect(() => {
        if(search!==undefined&&search!==''){
            const filtered=tagState.list.filter(
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
            title={<>Thẻ</>} 
            body={
                <div className="p-2">
                <div className="row mb-2">
                    <div className="col-md-12">
                    <label className="form-label">Mã thẻ<b className="text-danger">*</b></label>
                    <InputText
                        disabled={true}
                        id="code"
                        name="code"
                        value={formik.values.code}
                        // onChange={(e) => {
                        //     formik.setFieldValue('code', e.target.value);
                        //     }}
                        className={classNames('form-group',{'p-invalid': isFormFieldInvalid('code',formik) })}
                        style={{ width: '100%', borderRadius: 8 }} />
                    </div>
                </div>

                <div className="row mb-2">
                    <div className="col-md-12">
                    <label className="form-label">Tên thẻ<b className="text-danger">*</b></label>
                    <InputText
                        disabled={disableInput}
                        id="name"
                        name="name"
                        placeholder={isFormFieldInvalid('name',formik) ? getFormErrorMessageString("name",formik): ''}
                        value={formik.values.name}
                        onChange={(e) => {
                            formik.setFieldValue('name', e.target.value);
                            if(tagState.action==="INS"){
                                const code=removeVietnameseTones(e.target.value).split(" ").join("-").toLowerCase()
                                formik.setFieldValue('code', code);
                            }
                            }}
                        className={classNames('form-group',{'p-invalid': isFormFieldInvalid('name',formik) })}
                        style={{ width: '100%', borderRadius: 8 }} />
                    </div>
                </div>
                    
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-label">
                            Tag hot
                        </div>
                        <InputSwitch
                            disabled={disableInput}
                            checked={formik.values.is_hot}
                            onChange={(e) => {
                                formik.setFieldValue('is_hot', e.value);
                                }}
                        />
                    </div>
                    <div className="col-md-12">
                    <label className="form-label">Ghi chú</label>
                    <InputTextarea 
                        disabled={disableInput}
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={(e) => {
                            formik.setFieldValue('description', e.target.value);
                            }}
                        rows={3} className='form-group'
                        style={{ width: '100%', borderRadius: 8 }}  />
                    </div>
                </div>
                </div>
            } 
            footer={
                <>
                <button type='button' className='btn btn-outline-danger' onClick={()=>handleCancel()}><i className='ri-close-line'></i> <span className="list-action-label">{t("action.close")}</span></button>
                {tagState.action==='VIE'?
                    formik.values.disabled?
                    <ActionButton action={"UND"} className={""} minimumEnable={false} label={"Phục hồi"} onClick={()=>handleRestore()}/>
                    :
                    <>
                        <ActionButton action={"UPD"} className={""} minimumEnable={false} label={"Sửa"} onClick={()=>dispatch(changeAction("UPD"))}/>
                        <ActionButton action={"DEL"} className={""} minimumEnable={false} label={"Xóa"} onClick={()=>handleActionClick(formik.values,"DEL")}/>
                    </>
                :<></>}
                <FormAction action={tagState.action} onClick={formik.handleSubmit}/>
                </>
            } 
            draggable={false} 
            resizeable={false} 
            onClose={()=>handleCancel()} 
            />

            <Card 
                body={
                tagState.status === 'loading'?
                            <ContentLoading.ItemCardHolder contentRows={1} items={10} image={false} uniqueKey="goldgroup-holder-item"/>:
                <>
                <div className="w-100 py-2 text-center">
                    <SelectButton className="module icon-select" value={alpha} onChange={(e) => setAlpha(e.value)} options={tagState.alphabets} />
                </div>
                    {
                    filteredList.length>0?
                        filteredList.map((item, index)=>{
                            if (index >= first && index < (first + rows)){
                                return <div className="pt-2" key={"tag-item" + index}>
                                <ItemCard 
                                        uniqueKey={""}
                                        active={item.active}
                                        body={<>
                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex">
                                                    <div className={`fami-text-primary me-1 ${item.disabled ? 'disabled-text' : ''}`}><b>{item.name}</b></div>
                                                    <div>{item.disabled ? <i className="ri-close-line my-error"></i> : <i className="ri-check-line my-success"></i>}</div>
                                                    <div className="ms-2"><i className={`${item.is_hot ? "ri-fire-fill fami-text-primary" : ""}`}></i></div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <div><i className="ri-codepen-line fami-text-primary icon-on-list"></i> {item.code}</div>
                                                </div>
                                                <div className="col-sm-9">
                                                    <div><i className="ri-sticky-note-line fami-text-primary icon-on-list"></i> {item.description}</div>
                                                </div>
                                            </div>
                                        </>}
                                        background={item.disabled ? 'disabled-element' : "active-item-card-background"}
                                        onClick={() => dispatch(selectItem(item.id))}
                                        onDoubleClick={()=>handleActionClick(item,"VIE")} 
                                        contextMenu={[]}
                                        />
                                </div>;
                            }
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
                                    <div className="col-md-12">
                                        <div className="form-label">
                                            Trạng thái thẻ
                                        </div>
                                        <Dropdown
                                            options={['ALL','HOT','NOR']}
                                            value={hot}
                                            valueTemplate={hotTemplate}
                                            itemTemplate={hotTemplate}
                                            onChange={(e)=>{
                                                setHot(e.value)
                                            }}
                                            className="w-100"
                                        />                                        
                                    </div>
                                </div>
                                <EmptyHeight height={30} />
                            </OverlayPanel>
                    
                </>
                }
                title={<div style={{ cursor: "pointer" }} onClick={(e) => op.current.toggle(e)}><i className="ri-filter-2-fill"></i> Danh sách thẻ</div>}
                tool={
                <div className="d-flex">
                    <ActionButton action={"INS"} className={""} onClick={() => handleActionClick(TagModel.initial(), "INS")} minimumEnable={true} label={"Thêm"}/>
                </div>
                }
                isPadding={true} 
                className={""} 
            />
            <EmptyHeight height={48}/>
        </div>
    );
}
