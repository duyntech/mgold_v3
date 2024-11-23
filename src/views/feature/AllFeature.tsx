import { editItem, fetchAll, resetActionState, changeAction, setFilteredList } from "../../slices/feature/feature.slice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import { completed, failed, processing } from "../../utils/alert";
import { FeatureModel } from "../../model";
import { useFormik } from "formik";
import { Droppable } from "../../components/commons/DragDrop";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { moduleFeatures } from "../../types";
import { ContentLoading, DynamicDialog, EmptyHeight } from "../../components/commons";
import { InputText } from "primereact/inputtext";
import { getFormErrorMessageString, isFormFieldInvalid } from "../../utils/validate";
import { classNames } from "primereact/utils";
import ActionButton from "../../components/action/ActionButton";
import FormAction from "../../components/commons/FormAction";
import { t } from "i18next";
export type ColumnType = {
    id: moduleFeatures;
    title: string;
};

const AllFeature = () => {
    const dispatch = useAppDispatch();
    const featureState = useAppSelector((state) => state.feature);
    const [isShowDialog, setIsShowDialog] = useState(false);
    const [dataFeature, setDataFeature] = useState<FeatureModel[]>([])
    const formik = useFormik<FeatureModel>({
        initialValues: FeatureModel.initial(),
        onSubmit: (data: FeatureModel) => {
            switch (featureState.action) {
                case "UPD":
                    dispatch(editItem(data));
                    break
            }

        }
    });
    useEffect(() => {
        switch (featureState.statusAction) {
            case 'failed':
                failed(featureState.error);
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
    }, [featureState, dispatch])
    const handleCancel = () => {
        setIsShowDialog(false);
        formik.resetForm();
    }
    useEffect(() => {
        dispatch(fetchAll({}))
    }, [])
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id as string;
        const module = over.id as FeatureModel['module'];


        setDataFeature(() =>
            dataFeature.map((feature) => feature.id === activeId
                ? {
                    ...feature,
                    module
                } : feature)
        )
        const findFeature = dataFeature.find((feature) => feature.id === activeId)
        if (findFeature) {
            const payload = {
                id: findFeature.id,
                name: findFeature.name,
                module: String(module).toLocaleUpperCase(),
                icon: findFeature.icon,
            }
            dispatch(editItem(payload));
        }
    }
    const filterList = () => {
        let filtered = featureState.list;
        setDataFeature(filtered);
        dispatch(setFilteredList(filtered));
    }
    useEffect(() => {
        filterList()
    }, [])
    useEffect(() => {
        if (featureState.status === 'failed') {
            failed(featureState.error);
        }
        if (featureState.status === "completed") {
            filterList()
        }
    }, [featureState.status])
    const COLUMNS: ColumnType[] = [
        { id: 'RETAIL', title: 'Bán sỉ' },
        { id: 'WHOLESALE', title: 'Bán lẻ' },
        { id: 'PAWN', title: 'Cầm đồ' },
        { id: 'GENERAL', title: 'Chung' },
    ];

    return (
        <>
            <DynamicDialog visible={isShowDialog} position={undefined}
                title={<>Chức năng</>}
                body={
                    <div className="p-2">
                        <div className="row mb-2">
                            <div className="col-md-12">
                                <label className="form-label">Tên chức năng</label>
                                <InputText
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
                        <div className="row mb-2">
                            <div className="col-md-12">
                                <label className="form-label">Icon</label>
                                <InputText
                                    id="icon"
                                    name="icon"
                                    placeholder={isFormFieldInvalid('icon', formik) ? getFormErrorMessageString("icon", formik) : ''}
                                    value={formik.values.icon}
                                    onChange={(e) => {
                                        formik.setFieldValue('icon', e.target.value);
                                    }}
                                    className={classNames('form-group', { 'p-invalid': isFormFieldInvalid('icon', formik) })}
                                    style={{ width: '100%', borderRadius: 8 }} />
                            </div>
                        </div>
                    </div>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-outline-danger' onClick={() => handleCancel()}><i className='ri-close-line'></i> <span className="list-action-label">{t("action.close")}</span></button>
                        {featureState.action === 'VIE' ?
                            <ActionButton action={"UPD"} className={""} minimumEnable={false} label={"Sửa"} onClick={() => dispatch(changeAction("UPD"))} />
                            : <></>}
                        <FormAction action={featureState.action} onClick={formik.handleSubmit} />
                    </>
                }
                draggable={false}
                resizeable={false}
                onClose={() => handleCancel()}
            />
            <div className="container">
                <h2 className="text-center mb-4">Danh sách chức năng</h2>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: "16px",
                }}>
                    {
                        featureState.status === "loading" ?
                            <>
                                <ContentLoading.ItemCardHolder items={4} contentRows={2} image={false} uniqueKey={""} />
                            </>
                            : <DndContext onDragEnd={handleDragEnd}>
                                {COLUMNS.map((column) => {
                                    return (
                                        <Droppable
                                            key={column.id}
                                            module={column.id}
                                            features={dataFeature.filter((item) => item.module === column.id)}
                                            setIsShowDialog={setIsShowDialog}
                                            formik={formik}
                                        />
                                    )
                                })}
                            </DndContext>
                    }
                </div>
            </div>
            <EmptyHeight height={48} />
        </>
    )
}

export default AllFeature