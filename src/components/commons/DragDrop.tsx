import { useDraggable, useDroppable } from "@dnd-kit/core";
import { FeatureModel } from "../../model";
import { actions, moduleFeatures } from "../../types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { changeAction } from "../../slices/feature/feature.slice";
import { FormikProps } from "formik";
import { isValidAction } from "../../utils/util";

type FeatureCardProps = {
    feature: FeatureModel;
    onClick: VoidFunction;
}
type FeatureColumnProps = {
    module: moduleFeatures;
    features: FeatureModel[];
    setIsShowDialog: (isShowDialog: boolean) => void;
    formik: FormikProps<any>
}
export const Draggable = ({ feature, onClick }: FeatureCardProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: feature.id });
    const style = transform
        ? {
            transform: `translate(${transform.x}px, ${transform.y}px)`,
            cursor: 'grabbing',
            position: 'absolute' as 'absolute',
            zIndex: isDragging ? 9999 : undefined,
        }
        : undefined;
    return (
        <>
            <div
                className="alert alert-info mb-2 w-100 d-flex align-items-center justify-content-between"
                style={style}
                onClick={onClick}
            >
                {feature.name}
                <i
                    className="ri-drag-move-line"
                    style={{ cursor: "grab" }}
                    ref={setNodeRef}
                    {...listeners}
                    {...attributes} />
            </div>
        </>
    );
};

export const Droppable = ({ module, features, setIsShowDialog, formik }: FeatureColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({ id: module });
    const dispatch = useAppDispatch();
    const limitedActions = useAppSelector((state) => state.sidebar.actions)
    const handleActionClick = (item: FeatureModel, action: actions) => {
        dispatch(changeAction(action));
        setIsShowDialog(true);
        formik.setValues(item);
    }
    return (
        <div
            className={`card shadow-sm`}
            style={{
                position: 'relative',
                display: 'flex',
                transition: 'box-shadow 0.2s ease-in-out',
                border: isOver ? '1px solid #007bff' : "1px solid transparent",
            }}
        >
            <div className="card-header bg-primary text-white text-center">
                {module === "RETAIL" ? "Bán lẻ" : module === "WHOLESALE" ? "Bán sỉ" : module === "PAWN" ? "Cầm đồ" : "Chung"}
            </div>
            <div ref={setNodeRef} className="card-body" >
                {
                    features.map(feature => {
                        return <Draggable feature={feature} key={feature.id} onClick={() => {
                            if (isValidAction(limitedActions, "UPD")) {
                                handleActionClick(feature, 'VIE');
                            }
                        }} />
                    })
                }
            </div>
        </div>
    );
};