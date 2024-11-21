import { useEffect, useRef, useState } from "react";
import { ContentLoading, DynamicDialog, EmptyBox, EmptyHeight, StatusDropdown } from "../../components/commons";
import Card from "../../components/commons/Card";
import ItemCard from "../../components/commons/ItemCard";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { completed, failed, processing, warningWithConfirm } from "../../utils/alert";
import Assets from "../../assets";
import { OverlayPanel } from "primereact/overlaypanel";
import { FormikErrors, useFormik } from "formik";
import { AccountingTransactionModel } from "../../model";
import { actions, moduleTransaction, status } from "../../types";
import ActionButton from "../../components/action/ActionButton";
import FormAction from "../../components/commons/FormAction";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { isFormFieldInvalid, getFormErrorMessageString } from "../../utils/validate";
import { classNames } from "primereact/utils";
import { removeVietnameseTones } from "../../utils/util";
import { t } from "i18next";
import { DropdownChangeEvent } from "primereact/dropdown";
import { addItem, changeAction, deleteItem, editItem, fetchAll, resetActionState, selectItem, restoreItem, setFilteredList } from "../../slices/accountingtransaction/AccountingTransaction.slice";
import ModuleTransactionDropdown from "../../components/commons/ModuleTransactionDropdown";
export default function AllTransaction() {
    const dispatch = useAppDispatch();
    const transactionState = useAppSelector((state) => state.accountingTransaction);
    const search = useAppSelector((state) => state.header.search);
    const [isShowDialog, setIsShowDialog] = useState(false);
    const disableInput = !["INS", "UPD"].includes(transactionState.action);
    const [status, setStatus] = useState<status>("ACTIVE");
    const [moduleTransaction, setModuleTransaction] = useState<moduleTransaction>("ALL");
    const filteredList = transactionState.filteredList;
    const op = useRef<any>(null);
    const formik = useFormik<AccountingTransactionModel>({
        initialValues: AccountingTransactionModel.initial(),
        validate: (data) => {
            const errors: FormikErrors<AccountingTransactionModel> = {};
            if (!data.code) {
                errors.code = 'Vui lòng nhập mã kho.';
            }
            if (!data.name) {
                errors.name = 'Vui lòng nhập tên kho.';
            }
            return errors;
        },
        onSubmit: (data: AccountingTransactionModel) => {
            switch (transactionState.action) {
                case "INS":
                    dispatch(addItem(data));
                    break
                case "UPD":
                    dispatch(editItem(data));
                    break
                case "DEL":
                    warningWithConfirm({
                        title: "Xóa",
                        text: "Bạn muốn xóa giao dịch " + data.name + " ?",
                        confirmButtonText: "Đồng ý",
                        confirm: () => {
                            dispatch(deleteItem(data))
                        }
                    })
                    break
            }

        }
    });
    const handleRestore = () => {
        dispatch(restoreItem(formik.values));
    };
    const handleActionClick = (item: AccountingTransactionModel, action: actions) => {
        if (action === "DEL") {
            warningWithConfirm({
                title: "Xóa",
                text: "Bạn muốn xóa kho " + item.name + " ?",
                confirmButtonText: "Đồng ý",
                confirm: () => {
                    dispatch(deleteItem(item))
                }
            })
        }
        else {
            dispatch(changeAction(action));
            setIsShowDialog(true);
            formik.setValues(item)
        }

    }
    const handleCancel = () => {
        setIsShowDialog(false);
        formik.resetForm();
    }
    const filterList = () => {
        let filtered = transactionState.list;
        if (status !== "ALL") {
            filtered = filtered.filter(
                item => item.disabled === (status === "DEACTIVE"))
        }
        if (moduleTransaction !== "ALL") {
            filtered = filtered.filter(item => {
                if (moduleTransaction === "RETAIL") {
                    return item.for_module === "RETAIL";
                } else if (moduleTransaction === "PAWN") {
                    return item.for_module === "PAWN";
                }
                return false;
            });
        }
        console.log(filtered);
        dispatch(setFilteredList(filtered))
    }
    useEffect(() => {
        filterList()
    }, [status, moduleTransaction])


    useEffect(() => {
        switch (transactionState.statusAction) {
            case 'failed':
                failed(transactionState.error);
                dispatch(resetActionState(''));
                break;
            case "loading":
                processing();
                break;
            case 'completed':
                completed();
                dispatch(resetActionState(''));
                handleCancel()
                dispatch(fetchAll({}))
                break;
        }
    }, [transactionState, dispatch])
    useEffect(() => {
        if (transactionState.status === 'failed') {
            failed(transactionState.error);
        }
        if (transactionState.status === "completed") {
            filterList()

        }
    }, [transactionState.status])
    useEffect(() => {
        if (search !== undefined && search !== '') {
            const filtered = transactionState.list.filter(
                item => item.code.toLowerCase().includes(search.toLowerCase()) ||
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    removeVietnameseTones(item.name.toLowerCase()).includes(removeVietnameseTones(search.toLowerCase()))
            )
            dispatch(setFilteredList(filtered))
        }
        else {
            filterList()
        }
    }, [search, dispatch])
    useEffect(() => {
        dispatch(fetchAll({}))
    }, [])

    return (
        <div>
            <DynamicDialog visible={isShowDialog} position={undefined}
                title={<>Giao dịch</>}
                body={
                    <div className="p-2">
                        <div className="row mb-2">
                            <div className="col-md-12">
                                <label className="form-label">Mã giao dịch<b className="text-danger">*</b></label>
                                <InputText
                                    disabled={transactionState.action !== 'INS'}
                                    id="code"
                                    name="code"
                                    value={formik.values.code}
                                    onChange={(e) => {
                                        formik.setFieldValue('code', e.target.value);
                                    }}
                                    placeholder={isFormFieldInvalid('code', formik) ? getFormErrorMessageString("code", formik) : ''}
                                    className={classNames('form-group', { 'p-invalid': isFormFieldInvalid('code', formik) })}
                                    style={{ width: '100%', borderRadius: 8 }} />
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-md-12">
                                <label className="form-label">Tên giao dịch<b className="text-danger">*</b></label>
                                <InputText
                                    disabled={disableInput}
                                    id="name"
                                    name="name"
                                    placeholder={isFormFieldInvalid('name', formik) ? getFormErrorMessageString("name", formik) : ''}
                                    value={formik.values.name}
                                    onChange={(e) => {
                                        formik.setFieldValue('name', e.target.value);
                                    }}
                                    className={classNames('form-group', { 'p-invalid': isFormFieldInvalid('name', formik) })}
                                    style={{ width: '100%', borderRadius: 8 }} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <label className="form-label">Ghi chú</label>
                                <InputTextarea
                                    disabled={disableInput}
                                    id="note"
                                    name="note"
                                    value={formik.values.note}
                                    onChange={(e) => {
                                        formik.setFieldValue('note', e.target.value);
                                    }}
                                    rows={3} className='form-group'
                                    style={{ width: '100%', borderRadius: 8 }} />
                            </div>
                        </div>
                    </div>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-outline-danger' onClick={() => handleCancel()}><i className='ri-close-line'></i> <span className="list-action-label">{t("action.close")}</span></button>
                        {transactionState.action === 'VIE' ?
                            formik.values.disabled ?
                                <ActionButton action={"UND"} className={""} minimumEnable={false} label={"Phục hồi"} onClick={() => handleRestore()} />
                                : <>
                                    <ActionButton action={"UPD"} className={""} minimumEnable={false} label={"Sửa"} onClick={() => dispatch(changeAction("UPD"))} />
                                    <ActionButton action={"DEL"} className={""} minimumEnable={false} label={"Xóa"} onClick={() => handleActionClick(transactionState.item, "DEL")} />
                                </>

                            : <></>}
                        <FormAction action={transactionState.action} onClick={formik.handleSubmit} />
                    </>
                }
                draggable={false}
                resizeable={false}
                onClose={() => handleCancel()}
            />
            <Card
                body={
                    transactionState.status === 'loading' ?
                        <ContentLoading.ItemCardHolder contentRows={1} items={10} image={false} uniqueKey="goldgroup-holder-item" /> :
                        <>
                            {
                                filteredList.length > 0 ?
                                    filteredList.map((item, index) => {
                                        return <div className="pt-2" key={"warehouse-item" + index}>
                                            <ItemCard
                                                uniqueKey={""}
                                                active={item.active}
                                                body={<>
                                                    <div className="row">
                                                        <div className="d-flex justify-content-between col-sm-3">
                                                            <div className="d-flex">
                                                                <div className={`fami-text-primary me-1 ${item.disabled ? 'disabled-text' : ''}`}><b>{item.name}</b></div>
                                                                <div>{item.disabled ? <i className="ri-close-line my-error"></i> : <i className="ri-check-line my-success"></i>}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-9">
                                                            <div className="d-flex">
                                                                <div className="fami-text-primary me-1"><b>Phê duyệt</b></div>
                                                                {
                                                                    item.approve_enable ? <i className="ri-close-line my-error"></i> : <i className="ri-check-line my-success"></i>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-sm-3">
                                                            <div><i className="ri-codepen-line fami-text-primary icon-on-list"></i> {item.code}</div>
                                                        </div>
                                                        <div className="col-sm-9">
                                                            <div><i className="ri-sticky-note-line fami-text-primary icon-on-list"></i> {item.note}</div>
                                                        </div>
                                                    </div>
                                                </>}
                                                background={item.disabled ? 'disabled-element' : "active-item-card-background"}
                                                onClick={() => dispatch(selectItem(item))}
                                                onDoubleClick={() => handleActionClick(item, "VIE")}
                                                contextMenu={[]}
                                            />
                                        </div>;
                                    })
                                    : <EmptyBox description={<>Chưa có dữ liệu</>} image={Assets.images.emptyBox1} disabled={false} />
                            }
                            <OverlayPanel ref={op} style={{ width: "300px" }}>

                                <div className="row pb-2">
                                    <div className="form-group col-sm-12">
                                        <label htmlFor="from-date">Trạng thái:</label>
                                        <StatusDropdown
                                            value={status} onChange={(e: DropdownChangeEvent) => {
                                                setStatus(e.value)
                                            }
                                            } />
                                    </div>
                                </div>
                                <div className="row pb-2">
                                    <div className="form-group col-sm-12">
                                        <label htmlFor="from-date">Tùy chọn:</label>
                                        <ModuleTransactionDropdown
                                            value={moduleTransaction} onChange={(e: DropdownChangeEvent) => {
                                                setModuleTransaction(e.value)
                                            }
                                            } />
                                    </div>
                                </div>
                                <EmptyHeight height={30} />
                            </OverlayPanel>
                        </>
                }
                title={<div style={{ cursor: "pointer" }} onClick={(e) => op.current.toggle(e)}><i className="ri-filter-2-fill"></i> Danh sách giao dịch</div>}
                isPadding={true}
                className={""}
            />
            <EmptyHeight height={48} />
        </div>
    )
}

