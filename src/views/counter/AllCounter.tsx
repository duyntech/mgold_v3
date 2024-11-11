import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ContentLoading, DynamicDialog, EmptyBox, EmptyHeight, StatusDropdown } from "../../components/commons";
import Card from "../../components/commons/Card";
import ItemCard from "../../components/commons/ItemCard";
import { addItem, changeAction, deleteItem, editItem, fetchAll, resetActionState, restoreItem, selectItem, setFilteredList } from "../../slices/counter/counter.slice";
import { InputText } from "primereact/inputtext";
import { completed, failed, processing, warningWithConfirm } from "../../utils/alert";
import { FormikErrors, useFormik } from "formik";
import { classNames } from "primereact/utils";
import { actions, status } from "../../types";
import FormAction from "../../components/commons/FormAction";
import { isFormFieldInvalid, getFormErrorMessageString } from "../../utils/validate";
import ActionButton from "../../components/action/ActionButton";
import Assets from "../../assets";
import { t } from "i18next";
import { removeVietnameseTones } from "../../utils/util";
import { OverlayPanel } from "primereact/overlaypanel";
import { DropdownChangeEvent } from "primereact/dropdown";
import { CounterModel } from "../../model/Counter.model";
        
export default function AllCounter() {
    const dispatch = useAppDispatch()
    const counterState = useAppSelector((state) => state.counter);
    const search = useAppSelector((state) => state.header.search);
    const filteredList=counterState.filteredList
    const [isShowDialog, setIsShowDialog] = useState(false);
    const disableInput = !["INS", "UPD"].includes(counterState.action);
    const [status, setStatus] = useState<status>("ACTIVE");
    const op = useRef<any>(null);
    const formik = useFormik<CounterModel>({
        initialValues: CounterModel.initial(),
        validate: (data) => {
            const errors:FormikErrors<CounterModel> = {};
            if (!data.code) {
                errors.code = 'Vui lòng nhập mã quầy.';
            }
            if (!data.name) {
                errors.name = 'Vui lòng nhập tên quầy.';
            }
            return errors;
        },
        onSubmit: (data:CounterModel) => {
            switch (counterState.action) {
                case "INS":
                    dispatch(addItem(data));
                break
                case "UPD":
                    dispatch(editItem(data));
                break
                case "DEL":
                    warningWithConfirm({
                        title: "Xóa",
                        text: "Bạn muốn xóa quầy "+data.name +" ?",
                        confirmButtonText: "Đồng ý",
                        confirm: ()=>{
                            dispatch(deleteItem(data))
                        }
                    })
                break
            }
        
        }
    });

    const handleActionClick=(item:CounterModel, action:actions)=>{ 
        if(action==="DEL"){
            warningWithConfirm({
                title: "Xóa",
                text: "Bạn muốn xóa quầy "+item.name +" ?",
                confirmButtonText: "Đồng ý",
                confirm: ()=>{
                    dispatch(deleteItem(item))
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
        let filtered=counterState.list
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
        switch (counterState.statusAction) {
            case 'failed':
                failed(counterState.error);
                dispatch(resetActionState(''));
                break;
            case "loading":
                processing();
                break;
            case 'completed':
                completed();
                dispatch(resetActionState(''));
                handleCancel()
                //formik.setValues(counterState.item)
                dispatch(fetchAll({}))
                break;
        }
    }, [counterState,dispatch])
    useEffect(() => {
        if (counterState.status === 'failed') {
            failed(counterState.error);
        }
        if(counterState.status==="completed"){
            filterList()
        
        }
    }, [counterState.status])
    useEffect(() => {
        if(search!==undefined&&search!==''){
            const filtered=counterState.list.filter(
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
            title={<>Quầy</>} 
            body={
                <div className="p-2">
                <div className="row mb-2">
                    <div className="col-md-12">
                    <label className="form-label">Mã quầy<b className="text-danger">*</b></label>
                    <InputText
                         disabled
                        value={formik.values.code}
                        placeholder={isFormFieldInvalid('code',formik) ? getFormErrorMessageString("code",formik): ''}
                        className={classNames('form-group',{'p-invalid': isFormFieldInvalid('code',formik) })}
                        style={{ width: '100%', borderRadius: 8 }} />
                    </div>
                </div>

                <div className="row mb-2">
                    <div className="col-md-12">
                    <label className="form-label">Tên quầy<b className="text-danger">*</b></label>
                    <InputText
                        disabled={disableInput}
                        placeholder={isFormFieldInvalid('name',formik) ? getFormErrorMessageString("name",formik): ''}
                        value={formik.values.name}
                        onChange={(e) => {
                            if(counterState.action==="INS"){
                                const code=removeVietnameseTones(e.target.value).split(" ").join("_").toLowerCase()
                                formik.setFieldValue('code', code);
                            }
                            formik.setFieldValue('name', e.target.value);
                            }}
                        className={classNames('form-group',{'p-invalid': isFormFieldInvalid('name',formik) })}
                        style={{ width: '100%', borderRadius: 8 }} />
                    </div>
                </div>
                
            </div>
            } 
            footer={
                <>
                <button type='button' className='btn btn-outline-danger' onClick={()=>handleCancel()}><i className='ri-close-line'></i> <span className="list-action-label">{t("action.close")}</span></button>
                {counterState.action==='VIE'?
                    formik.values.disabled?
                    <ActionButton action={"UND"} className={""} minimumEnable={false} label={"Phục hồi"} onClick={()=>handleRestore()}/>
                    :<>
                        <ActionButton action={"UPD"} className={""} minimumEnable={false} label={"Sửa"} onClick={()=>dispatch(changeAction("UPD"))}/>
                        <ActionButton action={"DEL"} className={""} minimumEnable={false} label={"Xóa"} onClick={()=>handleActionClick(counterState.item,"DEL")}/>
                    </>
                    
                :<></>}
                <FormAction action={counterState.action} onClick={formik.handleSubmit}/>
                </>
            } 
            draggable={false} 
            resizeable={false} 
            onClose={()=>handleCancel()} 
            />

            <Card 
                body={
                counterState.status === 'loading'?
                            <ContentLoading.ItemCardHolder contentRows={1} items={10} image={false} uniqueKey="goldgroup-holder-item"/>:
                <>
                    {
                    filteredList.length>0?
                        filteredList.map((item, index)=>{
                            return <div className="pt-2" key={"counter-item" + index}>
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
                                                <div><i className="ri-sticky-note-line fami-text-primary icon-on-list"></i> {item.name}</div>
                                            </div>
                                        </div>
                                    </>}
                                    background={item.disabled ? 'disabled-element' : "active-item-card-background"}
                                    onClick={() => dispatch(selectItem(item))} 
                                    onDoubleClick={()=>handleActionClick(item,"VIE")} 
                                    contextMenu={[]} 
                                    />
                            </div>;
                        })
                        :<EmptyBox description={<>Chưa có dữ liệu</>} image={Assets.images.emptyBox1} disabled={false}/>
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
                title={<div style={{ cursor: "pointer" }} onClick={(e) => op.current.toggle(e)}><i className="ri-filter-2-fill"></i> Danh sách quầy</div>}
                tool={
                <div className="d-flex">
                    <ActionButton action={"INS"} className={""} onClick={() => handleActionClick(CounterModel.initial(), "INS")} minimumEnable={true} label={"Thêm"}/>
                </div>
                }
                isPadding={true} 
                className={""} 
            />
            <EmptyHeight height={48}/>
        </div>
    );
}
