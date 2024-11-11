import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Assets from "../../assets";
import ActionButton from "../action/ActionButton";
import { DynamicDialog, EmptyBox } from "../commons";
import Card from "../commons/Card";
import EmptyHeight from "../commons/EmptyHeight";
import ItemCard from "../commons/ItemCard";
import MonneyFormat from "../commons/MoneyFormat";
import FormAction from "../commons/FormAction";
import { t } from "i18next";
import { FormikErrors, useFormik } from 'formik';
import { completed, failed, processing, warningWithConfirm } from "../../utils/alert";
import { actions } from "../../types";
import { Calendar } from "primereact/calendar";
import { NumericFormat } from "react-number-format";
import { dateStringToDate, dateToYMDFormat, toLocaleStringRefactor } from "../../utils/util";
import { InputText } from "primereact/inputtext";
import { addExtendItem, deleteExtendItem, editExtendItem, patchItemByCode, resetActionState } from "../../slices/pawn/temppawn.slice";

export default function TempPawnExtend(){
    const dispatch=useAppDispatch()
    const pawnState=useAppSelector(state=>state.temppawn)
    
    const [showDialog,setShowDialog]=useState(false)
    const [action,setAction]=useState<any>("INS")
    const disableInput=!["INS","UPD"].includes(action)
    const formik = useFormik<{id:string,date:Date,value:number,note:string}>({
        initialValues: {id:'',date:new Date(),value:0,note:''},
        validate: (data) => {
            const errors:FormikErrors<{id:string,date:Date,value:number,note:string}> = {};
            if (data.value&&data.value===0) {
                errors.value = 'Vui lòng nhập số tiền';
            }
            return errors;
        },
        onSubmit: (data:any) => {
            const submitData={
                id:data.id,
                pawn_id:pawnState.item.id,
                date:dateToYMDFormat(data.date,"-",0),
                value:data.value,
                note:data.note===''?null:data.note
            }
            switch (action) {
                case "INS":
                    dispatch(addExtendItem(submitData));
                break
                case "UPD":
                    dispatch(editExtendItem(submitData));
                break
                case "DEL":
                    warningWithConfirm({
                        title: "Xóa",
                        text: "Bạn muốn xóa bản ghi "+data.date +" ?",
                        confirmButtonText: "Đồng ý",
                        confirm: ()=>{
                            dispatch(deleteExtendItem(submitData))
                        }
                    })
                break
            }
        }
    });
    const handleActionClick=(item:any, action:actions)=>{ 
        setAction(action);  
        setShowDialog(true);
        formik.setValues(item)
    }
    const handleCancel = () => {
        setShowDialog(false);
        formik.resetForm();
    }
    useEffect(() => {
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
                dispatch(patchItemByCode({code:pawnState.item.code}))
                dispatch(resetActionState(''))
                handleCancel()
                break;
        }
    },[pawnState.statusAction])
    useEffect(()=>{
        dispatch(patchItemByCode({code:pawnState.item.code}))
    },[])
    return <>
        <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-8">
            <Card 
                body={<>
                    {pawnState.item.extend_records&&pawnState.item.extend_records.length>0?pawnState.item.extend_records.map((item,index)=>{
                        return <div className="pt-2" key={"import-item-"+index}>
                                        <ItemCard 
                                            uniqueKey={""}
                                            active={false}
                                            body={<>
                                                
                                                <div className="row">
                                                    <div className="col-sm-6">Ngày: {dateStringToDate(item.date).toLocaleDateString()}</div>
                                                    <div className="col-sm-6">Số tiền: {item.value.toLocaleString('de-DE')}đ</div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12">Ghi chú: {item.note}</div>
                                                </div>
                                                
                                            </>}
                                            background={"active-item-card-background"}
                                            onClick={()=>{}} 
                                            onDoubleClick={()=>{setAction("VIE");formik.setValues(item);setShowDialog(true)}}
                                             contextMenu={[]}/>
                                    </div>
                                }

                                
                            ):<EmptyBox description={<>Chưa có bản ghi nào</>} image={Assets.images.emptyBox1} disabled={false} />}
                        <DynamicDialog 
                            width={300}
                            visible={showDialog} 
                            position={undefined} 
                            title={<>Gia hạn(Đóng lãi)</>} 
                            body={<div className="pb-3">
                                <div className="form-group">
                                    <label className="form-label">Ngày<b className="text-danger">*</b></label>
                                    <Calendar
                                        disabled={disableInput}
                                        dateFormat="dd/mm/yy" 
                                        value={dateStringToDate(formik.values.date)}
                                        onChange={(e) => {
                                            formik.setFieldValue('date', e.target.value);
                                        }}
                                        style={{width: "100%",borderRadius: "10px"}}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="username">Số tiền<b className="text-danger">*</b></label>
                                    <NumericFormat
                                        disabled={disableInput}
                                        className={`p-inputtext ${disableInput?'disabled-element':''}`} 
                                        value={toLocaleStringRefactor(formik.values.value)}
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        decimalScale={0}
                                        style={{ width: "100%", textAlign: "right" }}
                                        onChange={(e) => {
                                                formik.setFieldValue("value", e.target.value.split('.').join(''));
                                        }}
                                        />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="username">Ghi chú</label>
                                    <InputText
                                        disabled={disableInput}
                                        value={formik.values.note}
                                        onChange={(e) => {
                                            formik.setFieldValue('note', e.target.value);
                                            } }
                                        
                                        placeholder="Ghi chú"
                                        style={{ width: "100%", borderRadius: "10px" }} />
                                </div>
                            </div>} 
                            footer={<>
                                <button type='button' className='btn btn-outline-danger' onClick={()=>handleCancel()}><i className='ri-close-line'></i> <span className="list-action-label">{t("action.close")}</span></button>
                                {action==='VIE'?
                                    pawnState.item.status!='REDEEM'&&<>
                                        <ActionButton action={"UPD"} className={""} minimumEnable={false} label={"Sửa"} onClick={()=>setAction("UPD")}/>
                                        <ActionButton action={"DEL"} className={""} minimumEnable={false} label={"Xóa"} onClick={()=>handleActionClick(formik.values,"DEL")}/>
                                    </>
                                :<></>
                                }
                                <FormAction action={action} onClick={formik.handleSubmit}/>
                            </>} 
                            draggable={false} 
                            resizeable={false} 
                            onClose={()=>setShowDialog(false)}/>
                </>} 
                title={<>Nhật ký gia hạn(đóng lãi)</>} 
                tool={<div className="d-flex">
                    {pawnState.item.status!='REDEEM'&&<ActionButton action={"INS"} className={"me-2"} onClick={() => {setAction("INS"); setShowDialog(true)}} minimumEnable={true} label={"Thêm"}/>}
                </div>} 
                isPadding={true} 
                className={""}
                />
            </div>
            <div className="col-sm-2"></div>
        </div>
        <EmptyHeight height={48}/>
            <div className='fixed-bottom'>
                <div className="row">
                    <div className="col-md-7"></div>
                    <div className="col-md-2">
                        <div className="d-flex">
                            <div className="me-2 align-self-end">Tổng lần:</div>
                            <b><MonneyFormat value={pawnState.item.extend_records?pawnState.item.extend_records.length:0} positiveColor={"fami-text-primary fw-bold"} unit={""} decimal={false}/></b>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex">
                            <div className="me-2 align-self-end">Tổng giá trị:</div>
                            <b><MonneyFormat value={pawnState.item.extend_records?pawnState.item.extend_records.reduce((sum, el) => sum += el.value, 0):0} positiveColor={"fami-text-primary fw-bold"} unit={"đ"} decimal={false}/></b>
                        </div>
                    </div>
                </div>
            </div>
    </>
}