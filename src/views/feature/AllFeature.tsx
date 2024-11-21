import { editItem, fetchAll, resetActionState, changeAction, setFilteredList } from "../../slices/feature/feature.slice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import { completed, failed, processing } from "../../utils/alert";
import { FeatureModel } from "../../model";
import { useFormik } from "formik";
import { Droppable, Draggable } from "../../components/commons/DragDrop";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { actions, featureProps } from "../../types";
import { DynamicDialog, EmptyHeight } from "../../components/commons";
import { isValidAction } from "../../utils/util";
import { InputText } from "primereact/inputtext";
import { getFormErrorMessageString, isFormFieldInvalid } from "../../utils/validate";
import { classNames } from "primereact/utils";
import ActionButton from "../../components/action/ActionButton";
import FormAction from "../../components/commons/FormAction";
import { t } from "i18next";

const AllFeature = () => {
    const dispatch = useAppDispatch();
    const limitedActions = useAppSelector((state) => state.sidebar.actions)
    const featureState = useAppSelector((state) => state.feature);
    const [isDragging, setIsDragging] = useState(false);
    const [isShowDialog, setIsShowDialog] = useState(false);
    const [feature, setFeature] = useState<featureProps>({
        retail: [],
        wholesale: [],
        pawn: [],
        general: [],
    });
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
    useEffect(() => {
        const newFeatures: featureProps = {
            retail: [],
            wholesale: [],
            pawn: [],
            general: [],
        };

        featureState.list.forEach((item) => {
            switch (item.module) {
                case "RETAIL":
                    newFeatures.retail.push(item);
                    break;
                case "WHOLESALE":
                    newFeatures.wholesale.push(item);
                    break;
                case "PAWN":
                    newFeatures.pawn.push(item);
                    break;
                default:
                    newFeatures.general.push(item);
            }
        });

        setFeature(newFeatures);
    }, [featureState.list]);
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (isValidAction(limitedActions, "UPD") && over) {
            setFeature((prevFeatures) => {
                const sourceKey = Object.keys(prevFeatures).find((key) =>
                    prevFeatures[key as keyof featureProps].some((item) => item.id === active.id)
                ) as keyof featureProps | undefined;

                const destinationKey = over.id as keyof featureProps;

                if (!sourceKey || !destinationKey) return prevFeatures;

                const sourceList = [...prevFeatures[sourceKey]];
                const destinationList = [...prevFeatures[destinationKey]];

                const draggedItemIndex = sourceList.findIndex((item) => item.id === active.id);
                if (draggedItemIndex >= 0) {
                    const [draggedItem] = sourceList.splice(draggedItemIndex, 1);
                    destinationList.push(draggedItem);
                    const payload = {
                        id: draggedItem.id,
                        name: draggedItem.name,
                        module: String(over.id).toLocaleUpperCase(),
                        icon: draggedItem.icon,
                    }
                    dispatch(editItem(payload));
                }
                return {
                    ...prevFeatures,
                    [sourceKey]: sourceList,
                    [destinationKey]: destinationList,
                };
            });
        }
        setIsDragging(false);
    };
    // const handleDragStart = (e: React.DragEvent) => {
    //     e.preventDefault();
    //     setIsDragging(true);
    //     document.body.style.userSelect = 'none';
    // };
    const handleActionClick = (item: FeatureModel, action: actions) => {
        dispatch(changeAction(action));
        setIsShowDialog(true);
        formik.setValues(item);
    }
    const filterList = () => {
        let filtered = featureState.list;
        dispatch(setFilteredList(filtered))
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
            <div className="container mt-5">
                <h2 className="text-center mb-4">Danh sách chức năng</h2>
                <DndContext onDragEnd={handleDragEnd}>
                    <div className="row gy-4">
                        {Object.entries(feature).map(([key, list]) => (
                            <div key={key} className="col-md-3">
                                <Droppable id={key}
                                    title={
                                        key === "retail" ? "Bán lẻ" : key === "wholesale" ? "Bán sỉ" : key === "pawn" ? "Cầm đồ" : "Chung"
                                    }
                                >
                                    {list.map((item, index) => {
                                        return (
                                            <Draggable key={index} id={item.id} onClick={() => !isDragging && isValidAction(limitedActions, "UPD") && handleActionClick(item, "VIE")}>
                                                {item.name}
                                            </Draggable>
                                        )
                                    })}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DndContext>
                <EmptyHeight height={48} />
            </div>
        </>
    )
}

export default AllFeature