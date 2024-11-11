import { useEffect, useRef, useState } from "react";
import Card from "./Card";
import { completed, failed, processing, warning, warningWithConfirm } from "../../utils/alert";
import EmptyBox from "./EmptyBox";
import Assets from "../../assets";
import { DataView } from 'primereact/dataview';
import ActionButton from "../action/ActionButton";
import { Galleria } from 'primereact/galleria';
import ImageSelect from "./ImageSelect";
import { productImageUrl } from "../../utils/util";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deleteImage, resetActionState } from "../../slices/upload/upload.slice";
import { TabPanel, TabView } from "primereact/tabview";
import NetworkImage from "./NetworkImage";
const s3Original=import.meta.env.VITE_APP_s3ImagesLink!+"originals/"
export default function ImagesSelect(props: any) {
    const uploadState=useAppSelector(state=>state.upload)
    const dispatch =useAppDispatch()
    const [deleteIndex,setDeleteIndex]=useState(-1)
    const [tabIndex, setTabIndex] = useState(0)
    const handleAddImage = () => {
        const productCode=props.formik.values["code"]
        const currentQuantity=props.formik.values[props.field].length??0
        if (!props.disableInput) {
            if (currentQuantity >= props.maxImages) {
                warning({ title: `Đã đạt giới hạn ${props.maxImages} ảnh`, onClose: () => { } })
            } else {
                const a = [...props.formik.values[props.field] ?? [], productCode+"-"+(currentQuantity+1)]
                props.formik.setFieldValue(props.field, a)
            }
        }
    }
    const [activeIndex, setActiveIndex] = useState(0);
    const galleria = useRef<any>(null);
    const itemGalleryTemplate = (item: any) => {
        const src = typeof item == 'object' ?import.meta.env.VITE_APP_baseURL +  item.url : productImageUrl(item)
        return <img src={src} alt={item} style={{ width: '100%', display: 'block' }} />;
    }
    const gridItem = (item: string) => {
        const src = item.includes(props.uploadType)?productImageUrl(item):''
        const index = props.formik.values[props.field]?.indexOf(item)
        return (
            <div className="col-sm-4 p-1">
                <ImageSelect 
                    formik={props.formik} 
                    bucket={props.uploadType} 
                    index={index} 
                    field={props.field} 
                    src={src!}
                    onDelete={()=>handleDeleteClick(index)}
                    onClick={()=>{
                        setActiveIndex(index)
                        galleria.current.show()
                    }}
                    disabled={props.disableInput}
                    capture={false}
                />
            </div>
        );
    };
    const goldTabHeaderTemplate = (options:any) => {
        return (
            <div onClick={options.onClick} className={options.className}>
                {options.leftIconElement}
                {options.titleElement}
            </div>
        );
    };
    const handleDeleteClick = async (index: number) => {
        setDeleteIndex(index)
        const images = [...props.formik.values[props.field]]
        const image=images[index] as string
        //console.log(image)
        const imageSplit=image.split('.')
        if(imageSplit.length>1){
            warningWithConfirm({
                title: "Xóa",
                text: "Xóa hình số " + (index + 1).toString()+': '+image,
                confirmButtonText: "Đồng ý",
                confirm: async () => {
                    const productCode=props.formik.values["code"]
                    const submitData={
                        object_id:productCode,
                        image:image,
                        type:"PRODUCT"
                    }
                    //console.log(submitData)
                    dispatch(deleteImage(submitData))               
                }
            })
        }
        else{
            images.splice(index, 1)
            props.formik.setFieldValue(props.field, images)
        }
    }
    useEffect(()=>{
        switch (uploadState.statusAction) {
            case "failed":
                failed(uploadState.error)
                dispatch(resetActionState(''))
                break;
            case "loading":
                processing()
                break
            case "completed":
                completed()
                dispatch(resetActionState(''))
                const images = [...props.formik.values[props.field]]
                images.splice(deleteIndex, 1)
                props.formik.setFieldValue(props.field, images)
                break;
        }
    },[uploadState.statusAction])
    return (
        <div >
            <Card
                body={
                    <>
                        {props.formik.values[props.field]?.length > 0 ?
                            <div>
                                <TabView activeIndex={tabIndex} onTabChange={(e)=>{
                        
                                setTabIndex(e.index)
                                }}>
                                        <TabPanel header={"Xem ảnh nhanh hơn"} leftIcon="ri-signal-wifi-1-fill icon-on-list me-1" headerTemplate={goldTabHeaderTemplate}></TabPanel>
                                        <TabPanel header={"Xem ảnh rõ hơn (wifi mạnh)"} leftIcon="ri-signal-wifi-fill icon-on-list me-1" headerTemplate={goldTabHeaderTemplate}></TabPanel>
                                        
                                </TabView>
                                {tabIndex===0&&<><Galleria
                                    ref={galleria}
                                    value={props.formik.values[props.field]}
                                    numVisible={7}
                                    style={{ maxWidth: '850px' }}
                                    activeIndex={activeIndex} onItemChange={(e) => setActiveIndex(e.index)}
                                    circular
                                    fullScreen
                                    showItemNavigators
                                    showThumbnails={false}
                                    item={itemGalleryTemplate}
                                />
                                <DataView value={props.formik.values[props.field]} itemTemplate={gridItem} layout={'grid'} header={<></>} />
                                </>
                                }
                                {tabIndex===1&&<div className="row ps-2" style={{minHeight:250}}>
                                    <div className="col-sm-4">
                                        <NetworkImage url={s3Original+props.code+" - 1.png"}/>
                                    </div>
                                    <div className="col-sm-4">
                                        <NetworkImage url={s3Original+props.code+" - 2.png"}/>
                                    </div>
                                    <div className="col-sm-4">
                                        <NetworkImage url={s3Original+props.code+" - 3.png"}/>
                                    </div>
                                </div>
                                }
                            </div>
                            : <EmptyBox description={<>Chưa có hình</>} image={Assets.images.emptyBox1} disabled={false} />
                        }
                    </>}
                title={<><i className="ri-image-fill me-1"></i>Hình ảnh</>}
                tool={<>
                    {!props.disableInput && <ActionButton action={"MPI"} className={"me-2"} minimumEnable={true} label={"Ảnh"} onClick={handleAddImage} />}
                </>}
                isPadding={props.isPadding ?? true} className={props.className ?? ""} />
            
        </div>
    )
}