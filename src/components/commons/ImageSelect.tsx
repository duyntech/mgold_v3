import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { fileToBase64,isValidAction } from "../../utils/util";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ComponentFormikProps } from "../../types";
import { resetState, uploadImage } from "../../slices/upload/upload.slice";
import { DynamicDialog } from ".";
import { completed, failed, processing } from "../../utils/alert";

interface ImagesProps extends ComponentFormikProps{
    index:number
    field:string
    bucket:string
    src:string
    onDelete:VoidFunction
    onClick:VoidFunction
    disabled:boolean
    capture:boolean
}
export default function ImageSelect(props:ImagesProps){
    const uploadState=useAppSelector(state=>state.upload)
    const dispatch=useAppDispatch()
    const fileRef = useRef<any>(null)
    const webcamRef = useRef<Webcam>(null);
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [obj, setObj] = useState<any>({})
    const [uploadedImages, setUploadedImages] = useState<any[]>([])
    const limitedActions=useAppSelector((state) => state.sidebar.actions)
    const handleFileSelect = (e: any) => {
        const t = { ...obj }
        if (e.target.files[0]) {
            t.file = e.target.files[0]
            t.imgSrc = null
        } else {
            
            t.file = null
        }
        setObj(t)
    }
    const capture = useCallback(() => {
        const t = { ...obj }
        t.file = null
        const imageSrc = webcamRef.current!.getScreenshot();
        t.imgSrc = imageSrc
        setObj(t)
        setVisibleDialog(false)
    }, [webcamRef]);

    const upload = async () => {
        if (!obj) { return }
        if (obj.file) {
            const f: File = obj.file
            const fArr = f.name.split('.')
            const ext = fArr[fArr.length - 1]
            const base64Image = await fileToBase64(f)
            const imageName=props.formik.values["code"]+"-"+(props.index+1)+'.'+ext
            
            let images = [...props.formik.values[props.field]]
            let imgArr:any[]=[]
            images[props.index]=props.bucket+'/'+imageName
            const createUser=localStorage.getItem("userId")
            const codeStore=localStorage.getItem("branch")
            setUploadedImages(images)
            for (let idx = 0; idx < images.length; idx++) {
                const element = images[idx];
                imgArr.push({
                type:"PRODUCT",
                object_id:props.formik.values["code"],
                image:element,
                create_user:createUser,
                code_store:codeStore
                })
            }
            const submitData = {
                imageData: base64Image,
                name:imageName,
                extension:ext,
                images:imgArr,
                bucket:props.bucket,
                code: props.formik.values["code"]
            }
            //console.log(submitData)
            dispatch(uploadImage(submitData))
            
        } else if (obj.imgSrc) {
            //setUploadStatus('loading')
        }
    }
    useEffect(()=>{
        switch (uploadState.status) {
            case "failed":
                failed(uploadState.error)
                dispatch(resetState(''))
                break;
            case "loading":
                processing()
                break;
            case "completed":
                completed()
                dispatch(resetState(''))
                setObj({file:null,imgSrc:null})
                break
        }
    },[uploadState.status])
    useEffect(()=>{
        if(uploadedImages.length>0){
            props.formik.setFieldValue(props.field,uploadedImages)
        }
    },[uploadedImages])
    return <>
        <div className="p-1 border-1 border-round">
            {!obj.file && !obj.imgSrc&&props.src.includes(props.bucket)&&<img className="w-100 shadow-2 border-round align-self-center"
                                src={props.src+"?v="+Math.random()}
                                alt={''} 
                                style={{ cursor: 'pointer' }} onClick={props.onClick}
                                />
}
            {(obj.file || obj.imgSrc) && <>
                <img className="w-100" src={obj.file !== null ? URL.createObjectURL(obj.file) : obj.imgSrc ?? ''} alt=""/>
                <div className="text-danger" style={{ fontSize: 12 }}>Vui lòng upload</div>
                </>
            }     
            <input style={{ display: "none" }} type="file" ref={fileRef} accept="image/*" onChange={e => handleFileSelect(e)} />
            <div className={`d-flex mt-1 justify-content-md-around ${props.disabled?"disabled-element":""}`} style={{pointerEvents:props.disabled?"none":"unset"}}>
                <i className="pi pi-images p-2" style={{ cursor: 'pointer', fontSize: '1.3em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: '#283673' }}
                                 onClick={() => { fileRef.current.click() }}></i>
                <i className={`pi pi-camera p-2 ${props.capture?"disabled-element":""}`} style={{ cursor: 'pointer', fontSize: '1.3em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: props.capture?'#283673':'grey' }}
                                 onClick={props.capture?() => {
                                     setVisibleDialog(true)
                                 }:()=>{}}></i>
                <i className="pi pi-cloud-upload p-2" style={{ cursor: 'pointer', fontSize: '1.3em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: '#283673' }}
                                 onClick={() => { upload() }}></i>
                {(!obj.file&&!obj.imgSrc)&&<i className={`pi ri-delete-bin-6-line text-danger p-2`} style={{ cursor: 'pointer', fontSize: '1.3em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: '#283673' }} onClick={isValidAction(limitedActions, "MPI")? props.onDelete:()=>{}}></i>}
                {(obj.file||obj.imgSrc)&&<i className="pi pi-times-circle text-danger p-2" style={{ cursor: 'pointer', fontSize: '1.3em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: '#283673' }} onClick={()=>setObj({file:null,imgSrc:null})}></i>}
            </div>
        </div>
        <DynamicDialog
                visible={visibleDialog}
                position={"center"}
                title={<>Chụp hình</>}
                body={
                    <div>
                        <Webcam
                            className="webcam"
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{
                                facingMode: 'environment',
                            }}
                            screenshotQuality={1}
                        />
                        <div className="btn-container">
                            <button onClick={capture}>Capture photo</button>
                        </div>
                    </div>
                }
                footer={<></>}
                draggable={false}
                resizeable={false}
                onClose={() => setVisibleDialog(false)}
            />
    </>
}