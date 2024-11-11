import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Card from "../commons/Card";
import EmptyHeight from "../commons/EmptyHeight";
import ActionButton from "../action/ActionButton";
import FormAction from "../commons/FormAction";
import { TempPawnModel } from "../../model/TempPawn.model";
import { FormikErrors, useFormik } from 'formik';
import { addItem, changeAction, clearPatchState, deleteItem, editItem, editPawnTag, patchItemByCode, resetActionState, restoreItem, verifyItem } from "../../slices/pawn/temppawn.slice";
import { completed, failed, processing, warning, warningWithConfirm } from "../../utils/alert";
import { t } from "i18next";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { getFormErrorMessage, isFormFieldInvalid } from "../../utils/validate";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { tempPawnTypes } from "../../utils/constants/const";
import { NumericFormat } from "react-number-format";
import { dateToYMDFormat, findDistrictId, getProvinceData, getProvinceDistrictData, getWards, isValidAction, MAX_IMAGE_SIZE, readingNumber, removeVietnameseTones, scaleImage, toLocaleStringRefactor } from "../../utils/util";
import { useEffect, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { ProfileModel } from "../../model/Profile.model";
import { addItem as addCustomer,fetchAll,resetActionState as resetCustomerAction } from "../../slices/profile/profile.slice";
import { Image } from "primereact/image";
import {
    S3Client,
    PutObjectCommand
} from "@aws-sdk/client-s3";
import { DynamicDialog } from "../commons";
import { fetchCategories, setFetched } from "../../slices/category/category.slice";
import { MultiSelect } from "primereact/multiselect";
import { Spinner } from "react-bootstrap";
const s3KeyId=import.meta.env.VITE_APP_s3KeyId!
const s3SecrectKey=import.meta.env.VITE_APP_s3SecrectKey!
const s3Bucket=import.meta.env.VITE_APP_s3Bucket
const s3ImageLink=import.meta.env.VITE_APP_s3ImagesLink
const credentials={
    accessKeyId: s3KeyId,
    secretAccessKey: s3SecrectKey
}
const client = new S3Client({
     region: "ap-southeast-1",
     credentials:credentials
});
export default function TempPawn(){
    const dispatch=useAppDispatch()
    const pawnState=useAppSelector(state=>state.temppawn)
    const appState=useAppSelector(state=>state.app)
    const profileState=useAppSelector((state)=>state.profile)
    const categoryState = useAppSelector((state) => state.category)
    const limitedActions=useAppSelector((state) => state.sidebar.actions)
    const navigate = useNavigate()
    const location = useLocation()
    const locationPath=location.pathname
    const itemCode=locationPath.split("/")[2]
    const [qh, setQh] = useState<Array<any>>([])
    const [px, setPx] = useState<Array<any>>([])
    const [qhCus, setQhCus] = useState<Array<any>>([])
    const [pxCus, setPxCus] = useState<Array<any>>([])
    const [products, _setProducts] = useState<string[]>(appState.pawnProducts??[]);
    const [suggestProducts, setSuggestProducts] = useState<string[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [customers, setCustomers] = useState<ProfileModel[]>([]);
    const [customer, setCustomer] = useState<ProfileModel|undefined>(undefined);
    const [filteredCustomers, setFilteredCustomers] = useState<ProfileModel[]>([]);
    const [imageSrc, setImageSrc] = useState<string>('');
    const [fileAvtUpload, setfileAvtUpload] =useState<File | null>(null);
    const [visibleDialog, setVisibleDialog] = useState(false);
    const onChangeProvince = (province: string) => {
        formik.setFieldValue('province', province)
        formik.setFieldValue('district', '')
        formik.setFieldValue('ward', '')
        setPx([])
        for (const [key, value] of Object.entries(getProvinceDistrictData())) {
            if (key == province) {
                let d = new Array<any>()
                let k = value as Array<string>
                k.map((e: string) => d.push({ name: e }))
                setQh(d)
            }
        }
    }
    const onChangeDistrict = (district: string) => {
        formik.setFieldValue('district', district)
        formik.setFieldValue('ward', '')
        setPx(getWards(findDistrictId(formik.values.province, district)))
    }
    
    const onChangeCusProvince = (province: string) => {
        formikCustomer.setFieldValue('province', province)
        formikCustomer.setFieldValue('district', '')
        formikCustomer.setFieldValue('ward', '')
        setPxCus([])
        for (const [key, value] of Object.entries(getProvinceDistrictData())) {
            if (key == province) {
                let d = new Array<any>()
                let k = value as Array<string>
                k.map((e: string) => d.push({ name: e }))
                setQhCus(d)
            }
        }
    }
    const onChangeCusDistrict = (district: string) => {
        formikCustomer.setFieldValue('district', district)
        formikCustomer.setFieldValue('ward', '')
        setPxCus(getWards(findDistrictId(formikCustomer.values.province, district)))
    }
    const disableInput=!["INS","UPD"].includes(pawnState.action)
    

    const search = (event:any) => {
        setTimeout(() => {
            let _filtered;

            if (!event.query.trim().length) {
                _filtered = [...products];
            }
            else {
                _filtered = products.filter((p) => {
                    return p.toLowerCase().includes(event.query.toLowerCase())||removeVietnameseTones(p.toLowerCase()).includes(removeVietnameseTones(event.query.toLowerCase()));
                });
            }
            setSuggestProducts(_filtered);
        }, 250);
        
    }
    const searchCustomer = (event:any) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredCustomers;

            if (!event.query.trim().length) {
                _filteredCustomers = [...customers];
            }
            else {
                _filteredCustomers = customers.filter((customer) => {
                    return customer.filterName.toLowerCase().includes(event.query.toLowerCase())||removeVietnameseTones(customer.filterName.toLowerCase()).includes(removeVietnameseTones(event.query.toLowerCase()));
                });
            }
            setFilteredCustomers(_filteredCustomers.filter(e=>!e.disabled));
        }, 250);
    }
    const formik = useFormik<TempPawnModel>({
        initialValues: pawnState.item,
        validate: (data) => {
            const errors:FormikErrors<TempPawnModel> = {};
            if (!data.productType) {
                errors.productType = 'Vui lòng chọn loại sản phẩm';
            }
            if (!data.product) {
                errors.product = 'Vui lòng nhập sản phẩm cầm';
            }
            if (!data.customer) {
                errors.customer = 'Vui lòng nhập khách hàng';
            }
            return errors;
        },
        onSubmit: (data) => {
            let submitData={
                id:data.id,
                code:data.code===''?'#':data.code,
                date:dateToYMDFormat(data.date,"-",0),
                product:data.product,
                numberical_order:data.numbericalOrder!==''?data.numbericalOrder:null,
                product_type:data.productType,
                value:data.value,
                customer:data.customer,
                note:data.note!==''?data.note:null,
                personal_id:data.personalId!==''?data.personalId:null,
                phone:data.phone!==''?data.phone:null,
                province:data.province!==''?data.province:null,
                ward:data.ward!==''?data.ward:null,
                district:data.district!==''?data.district:null,
                address:data.address!==''?data.address:null,
                customer_id:data.customerId!==''?data.customerId:null,
                tags:data.tags,
                warehouse:data.warehouse!==''?data.warehouse:null
            }
            console.log(submitData)
            switch (pawnState.action) {
                case "INS":
                    dispatch(addItem(submitData));
                break
                case "UPD":
                    dispatch(editItem(submitData));
                break
                case "DEL":
                    dispatch(deleteItem(submitData));
                break
            }
        }
    });    
    const formikCustomer = useFormik<ProfileModel>({
        initialValues:ProfileModel.initial(),
        validate: (data) => {
            let errors:FormikErrors<ProfileModel>={};
            if (!data.fullName) {
                errors.fullName = 'Vui lòng nhập Họ và tên';
            }
            return errors;
        },
        onSubmit: (data) => {
            let cardImage=data.personalCardImage
            if(fileAvtUpload){
                const {name}=fileAvtUpload
                cardImage='cccd/'+name
            }
            let submitData={
                username:'',
                first_name:'',
                last_name:'',
                full_name:data.fullName.trim(),
                code:"",
                phone:data.phone,
                email:data.email,
                address:data.address,
                personal_card:data.personalCard,
                personal_card_image:cardImage,
                is_online:false,
                ip_address:'',
                province:data.province,
                district:data.district,
                ward:data.ward,
                type:"CUSTOMER"
            }
            dispatch(addCustomer(submitData));
        }
    });
    const handleCancel = () => {
        if(itemCode!==undefined){
            navigate("/tpawn")
        }
        else{
            navigate(-1);
        }
      }
    const handleRestore = () => {
        dispatch(restoreItem({id:pawnState.item.id}));
    }
    const handleDelete = () => {
        warningWithConfirm({
            title: "Xóa",
            text: "Bạn muốn xóa Phiếu cầm "+pawnState.item.code +" ?",
            confirmButtonText: "Đồng ý",
            confirm: ()=>{
                dispatch(deleteItem({id:pawnState.item.id}))
            }
        })
        
    }
    const handleVerify = (action:string) => {
        switch (action) {
            case "WAIT":
                if(formik.values.redeemDate){
                    if(formik.values.redeemDate<formik.values.date){
                        warning({title:"Ngày tất toán phải lớn hơn hoặc bằng ngày cầm!",onClose:()=>{}})
                    }
                    else{
                        warningWithConfirm({
                            title: t("pawn."+action),
                            text: "Bạn muốn "+t("pawn."+action)+" Phiếu cầm "+pawnState.item.code +" ?",
                            confirmButtonText: "Đồng ý",
                            confirm: ()=>{
                                dispatch(verifyItem({id:pawnState.item.id,action:action,date:dateToYMDFormat(formik.values.redeemDate!,"-",0)}))
                            }
                        })
                    }
                }
                else{
                    warning({title:"Vui lòng chọn ngày Tất toán",onClose:()=>{}})
                }
                break;
            case "UNLIQUID":
                if(formik.values.liquidDate){
                    if(formik.values.liquidDate<formik.values.date){
                        warning({title:"Ngày thanh lý phải lớn hơn hoặc bằng ngày cầm!",onClose:()=>{}})
                    }
                    else{
                        warningWithConfirm({
                            title: t("pawn."+action),
                            text: "Bạn muốn "+t("pawn."+action)+" Phiếu cầm "+pawnState.item.code +" ?",
                            confirmButtonText: "Đồng ý",
                            confirm: ()=>{
                                dispatch(verifyItem({id:pawnState.item.id,action:action,date:dateToYMDFormat(formik.values.liquidDate!,"-",0)}))
                            }
                        })
                    }
                    
                }
                else{
                    warning({title:"Vui lòng chọn ngày Thanh lý",onClose:()=>{}})
                }
                break;
        
            default:
                warningWithConfirm({
                    title: t("pawn."+action),
                    text: "Bạn muốn "+t("pawn."+action)+" Phiếu cầm "+pawnState.item.code +" ?",
                    confirmButtonText: "Đồng ý",
                    confirm: ()=>{
                        dispatch(verifyItem({id:pawnState.item.id,action:action}))
                    }
                })
                break;
        }
        
        
    }
    const triggerFileInput = () => {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        fileInput.value = '';
        fileInput.click();
    };
    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            //setdisabledUpload(false)
            setfileAvtUpload(file);
            if (!file.type.startsWith('image/')) {
                failed('Vui lòng chọn một tệp hình ảnh.');
                return;
            }
            const reader = new FileReader();
                reader.onload = (e: ProgressEvent<FileReader>) => {
                    setImageSrc(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            const fileSize = file.size;
            if (fileSize > MAX_IMAGE_SIZE) {
                const scaledImageSrc = await scaleImage(file);
                setfileAvtUpload(scaledImageSrc);
            } 
        }
    };
    const uploadFile= async (file:any)=>{
        const { name } = file;
        const command = new PutObjectCommand({
            Bucket: s3Bucket,
            Key: 'cccd/'+name,
            Body: file,
        });        
        try {
            await client.send(command);  
            setfileAvtUpload(null)      
            setImageSrc('')
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        switch (pawnState.statusPatch) {
            case 'failed':
                failed(pawnState.error);
                dispatch(clearPatchState(''));
                break;
            case 'completed':
                dispatch(clearPatchState(''))
                console.log(pawnState.item)
                formik.setValues(pawnState.item)
                break;
        }
    },[pawnState.statusPatch])
    useEffect(() => {
        switch (profileState.statusAction) {
            case 'failed':
                failed(profileState.error);
                dispatch(resetCustomerAction(''));
                break;
            case "loading":
                processing();
                break;
            case 'completed':
                completed();
                //dispatch(setCustomer(profileState.item))
                formik.setFieldValue("customerId", profileState.item.id);
                dispatch(resetCustomerAction(''));
                formikCustomer.resetForm()
                setVisibleDialog(false)
                if(fileAvtUpload){
                    uploadFile(fileAvtUpload)
                }
                dispatch(fetchAll({type:'CUSTOMER'}))
                break;
        }
    }, [profileState.statusAction])
    useEffect(() => {
        switch (profileState.status) {
            case "failed":
                failed(profileState.error);
                break;
            case "completed":
                setCustomers(profileState.profiles)
                break;
        }
    }, [profileState.status])
    useEffect(() => {
        dispatch(fetchAll({type:'CUSTOMER'}))
    },[])
    useEffect(() => {
        if(pawnState.action==="VIE"){
            for (const [key, value] of Object.entries(getProvinceDistrictData())) {
                if (key == pawnState.item.province) {
                    let d = new Array<any>()
                    let k = value as Array<string>
                    k.map((e: string) => d.push({ name: e }))
                    setQh(d)
                }
            }
            setPx(getWards(findDistrictId(pawnState.item.province, pawnState.item.district)))
        }
        
    }, [pawnState.item,pawnState.action])
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
                //dispatch(setReload(true))
                dispatch(resetActionState(''))
                handleCancel()
                break;
        }
    },[pawnState.statusAction])
    useEffect(() => {
        switch (categoryState.status) {
            case 'failed':
                failed(categoryState.error);
                break;
            case 'completed':
                setTags(categoryState.data.pawntags??[])
                setWarehouses(categoryState.data.pawnwarehouses??[])
                dispatch(setFetched(true))
                break;
        }
    }, [categoryState.status])
    useEffect(() => {
        if(!categoryState.fetched){
            dispatch(fetchCategories({categories:["pawntags","pawnwarehouses"]}))
        }
        if(itemCode&&categoryState.fetched){
            dispatch(patchItemByCode({code:itemCode}))
        }
    },[categoryState.fetched,itemCode])
    return <>
        <div className="row">
            <div className="col-md-2"></div>
            <div className="col-md-8">
                {itemCode&&(categoryState.status==="loading"||pawnState.statusPatch==="loading")?
                <div className="w-100 text-center"><Spinner/></div>
                :<Card 
                    body={<>
                        <div className="row mb-2">
                            <div className="form-group col-md-6">
                                <label htmlFor="username">Mã phiếu cầm</label>
                                <InputText
                                    minLength={6}
                                    disabled={true}
                                    value={formik.values.code===''?"#":formik.values.code}
                                    placeholder="Mã phiếu cầm"
                                    style={{ width: "100%", borderRadius: "10px",textTransform:'uppercase' }} 
                                    className="text-end"/>
                            </div>
                            <div className={`form-group col-md-${["WAIT","REDEEM","UNLIQUID","LIQUID","VERIFIED"].includes(formik.values.status)?"3":"6"}`}>
                                <label className="form-label">Ngày cầm<b className="text-danger">*</b></label>
                                <Calendar
                                    disabled={disableInput||!isValidAction(limitedActions, "MDA")}
                                    dateFormat="dd/mm/yy" 
                                    value={formik.values.date}
                                    onChange={(e) => {
                                        formik.setFieldValue('date', e.target.value);
                                    }}
                                    style={{width: "100%",borderRadius: "10px"}}
                                />
                            </div>
                            {["UNLIQUID","LIQUID","VERIFY"].includes(formik.values.status)&&<div className="form-group col-md-3">
                                <label className="form-label">Ngày thanh lý<b className="text-danger">*</b></label>
                                <Calendar
                                    disabled={["UNLIQUID","LIQUID"].includes(formik.values.status)||!isValidAction(limitedActions, "MDL")}
                                    dateFormat="dd/mm/yy" 
                                    value={formik.values.liquidDate}
                                    onChange={(e) => {
                                        formik.setFieldValue('liquidDate', e.target.value);
                                    }}
                                    style={{width: "100%",borderRadius: "10px"}}
                                />
                            </div>
                            }
                            {["WAIT","REDEEM","VERIFY"].includes(formik.values.status)&&<div className="form-group col-md-3">
                                <label className="form-label">Ngày tất toán<b className="text-danger">*</b></label>
                                <Calendar
                                    disabled={["WAIT","REDEEM"].includes(formik.values.status)||!isValidAction(limitedActions, "MDR")}
                                    dateFormat="dd/mm/yy" 
                                    value={formik.values.redeemDate}
                                    onChange={(e) => {
                                        formik.setFieldValue('redeemDate', e.target.value);
                                    }}
                                    style={{width: "100%",borderRadius: "10px"}}
                                />
                            </div>
                            }
                            <div className="form-group col-md-12">
                                <label className="form-label">Khách hàng</label>
                                <div className="p-inputgroup">
                                    <AutoComplete
                                        disabled={disableInput||profileState.status==="loading"||!isValidAction(limitedActions, "MCU")}
                                        field="filterName"
                                    
                                        value={customer}
                                        suggestions={filteredCustomers}
                                        completeMethod={searchCustomer}
                                        onChange={(e) => {
                                            formik.setFieldValue("customerId", e.value.id);
                                            setCustomer(e.value)
                                            //console.log(e.value)
                                            if(typeof e.value==="object"){
                                                warningWithConfirm({
                                                title: "Cập nhật thông tin",
                                                text: "Bạn có muốn áp dụng thông tin khách hàng đã chọn vào phiếu cầm ?",
                                                confirmButtonText: "Đồng ý",
                                                confirm: ()=>{
                                                    for (const [key, value] of Object.entries(getProvinceDistrictData())) {
                                                        if (key == e.value.province) {
                                                            let d = new Array<any>()
                                                            let k = value as Array<string>
                                                            k.map((e: string) => d.push({ name: e }))
                                                            setQh(d)
                                                            formik.setFieldValue("province", e.value.province);
                                                            formik.setFieldValue("district", e.value.district);
                                                        }
                                                    }
                                                    setPx(getWards(findDistrictId(e.value.province, e.value.district)))
                                                    formik.setFieldValue("ward", e.value.ward);
                                                    formik.setFieldValue("address", e.value.address);
                                                    formik.setFieldValue("customer", e.value.fullName);
                                                    formik.setFieldValue("phone", e.value.phone);
                                                    formik.setFieldValue("personalId", e.value.personalCard);
                                                }
                                            })
                                            }
                                            
                                        }}
                                        placeholder="Chọn khách hàng" />
                                    <Button disabled={disableInput ||!isValidAction(limitedActions, "MCU")} icon={profileState.status==="loading"?"ri-loader-2-line": "ri-add-line"} className="btn-primary unactive" onClick={() => setVisibleDialog(true)} />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="username">Tên khách hàng<b className="text-danger">*</b></label>
                                <InputText
                                    disabled={disableInput||!isValidAction(limitedActions, "MCN")}
                                    value={formik.values.customer}
                                    onChange={(e) => {
                                        formik.setFieldValue('customer', e.target.value);
                                        } }
                                    className={classNames({ 'p-invalid': isFormFieldInvalid('customer', formik) })}
                                    placeholder="Tên khách hàng"
                                    style={{ width: "100%", borderRadius: "10px",textTransform:'capitalize' }} />
                                {getFormErrorMessage("customer",formik)}
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="username">Số thứ tự</label>
                                <InputText
                                    disabled={disableInput||!isValidAction(limitedActions, "MOD")}
                                    value={formik.values.numbericalOrder}
                                    onChange={(e) => {
                                        formik.setFieldValue('numbericalOrder', e.target.value);
                                        } }
                                    placeholder="STT"
                                    style={{ width: "100%", borderRadius: "10px" }} />
                            </div>
                            <div className="form-group col-md-6">
                                <div>CCCD</div>
                                <InputText disabled={disableInput||!isValidAction(limitedActions, "MCI")} placeholder="Nhập CCCD" style={{ width: "100%" }} value={formik.values.personalId}
                                    onChange={(e) => {
                                        formik.setFieldValue('personalId', e.target.value);
                                    }} />
                            </div>
                            <div className="form-group col-md-6">
                                <div>Điện thoại</div>
                                <InputText disabled={disableInput||!isValidAction(limitedActions, "MPH")} placeholder="Nhập điện thoại" style={{ width: "100%" }} value={formik.values.phone}
                                    onChange={(e) => {
                                        formik.setFieldValue('phone', e.target.value);
                                    }} />
                            </div>
                            <div className="form-group col-md-6">
                                <div>Tỉnh/Thành phố</div>
                                <Dropdown disabled={disableInput ||!isValidAction(limitedActions, "MPV")} filter options={getProvinceData()} optionLabel="name" optionValue="name" placeholder="Chọn Tỉnh/Thành phố" value={formik.values.province}
                                    onChange={(e) => onChangeProvince(e.target.value)} style={{ width: '100%', padding: 0 }} />
                            </div>
                            <div className="form-group col-md-6">
                                <div>Quận/huyện</div>
                                <Dropdown disabled={disableInput||!isValidAction(limitedActions, "MDT")} filter options={qh} emptyMessage="Vui lòng chọn tỉnh/tp" optionLabel="name" optionValue="name" placeholder="" value={formik.values.district}
                                    onChange={(e) => onChangeDistrict(e.target.value)} style={{ width: '100%', padding: 0 }} />
                            </div>
                            <div className="form-group col-md-6">
                                <div>Phường/xã</div>
                                <Dropdown disabled={disableInput||!isValidAction(limitedActions, "MWD")} filter options={px} emptyMessage="Vui lòng chọn quận/huyện" optionLabel="name" optionValue="name" placeholder="" value={formik.values.ward} onChange={(e) => formik.setFieldValue('ward', e.target.value)} style={{ width: '100%', padding: 0 }} />
                            </div>
                            <div className="form-group col-md-6">
                                <div>Địa chỉ cụ thể</div>
                                <InputText disabled={disableInput||!isValidAction(limitedActions, "MAD")} placeholder="Nhập địa chỉ cụ thể" style={{ width: "100%" }} value={formik.values.address}
                                    onChange={(e) => {
                                        formik.setFieldValue('address', e.target.value);
                                    }} />
                            </div>
                            <div className="form-group col-md-6">
                                <label className="form-label">Loại sản phẩm<b className="text-danger">*</b></label>
                                <Dropdown
                                    filter
                                    value={formik.values.productType}
                                    options={tempPawnTypes}
                                    optionValue="code"
                                    optionLabel='name'
                                    disabled={disableInput||!isValidAction(limitedActions, "MPT")}
                                    placeholder="Chọn loại sản phẩm"
                                    onChange={(e) => {
                                        formik.setFieldValue("productType", e.target.value);
                                    }}
                                    className={classNames( {
                                                "p-invalid": isFormFieldInvalid("productType", formik),
                                    })}
                                    style={{ width: '100%' }} />
                                    {getFormErrorMessage("productType",formik)}
                            </div>
                            <div className="form-group col-md-6">
                                {isValidAction(limitedActions, "VTA")&&<>
                                    <label className="form-label">Thẻ</label>
                                    <MultiSelect 
                                        filter
                                        value={formik.values.tags} 
                                        onChange={(e) => {
                                            formik.setFieldValue("tags", e.target.value);
                                            if(isValidAction(limitedActions, "MTD")&&disableInput){
                                                warningWithConfirm({
                                                    title: "Cập nhập tag",
                                                    text: "Bạn muốn sửa tag cho Phiếu cầm "+pawnState.item.code +" ?",
                                                    confirmButtonText: "Đồng ý",
                                                    confirm: ()=>{
                                                        dispatch(editPawnTag({id:pawnState.item.id,tags:e.target.value}))
                                                    }
                                                })
                                                
                                            }
                                        }}
                                        options={tags}
                                        disabled={disableInput&&!isValidAction(limitedActions, "MTD")||!isValidAction(limitedActions, "MTG")}
                                        optionLabel="name" 
                                        optionValue="code"
                                        display="chip"
                                        maxSelectedLabels={3} 
                                        placeholder="Chọn các thẻ"
                                        style={{ width: '100%' ,borderRadius: 8}}
                                    />
                                </>}
                                
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="username">Sản phẩm cầm<b className="text-danger">*</b></label>
                                <AutoComplete 
                                    disabled={disableInput||!isValidAction(limitedActions, "MPN")}
                                    value={formik.values.product} 
                                    suggestions={suggestProducts} 
                                    completeMethod={search} 
                                    onChange={(e) => formik.setFieldValue('product', e.target.value)} 
                                    className={classNames({ 'p-invalid': isFormFieldInvalid('product', formik) })}
                                    placeholder="Sản phẩm cầm"
                                    style={{ width: "100%", borderRadius: "10px",textTransform:'capitalize' }}
                                    />
                                {getFormErrorMessage("product",formik)}
                            </div>
                            <div className="form-group col-md-6">
                                <label className="form-label">Lưu kho</label>
                                <Dropdown
                                    filter
                                    value={formik.values.warehouse}
                                    options={warehouses}
                                    optionValue="code"
                                    optionLabel='name'
                                    disabled={disableInput||!isValidAction(limitedActions, "MWH")}
                                    placeholder="Chọn kho"
                                    onChange={(e) => {
                                        formik.setFieldValue("warehouse", e.target.value);
                                    }}
                                    style={{ width: '100%' }} />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="username">Tiền vay<b className="text-danger">*</b></label>
                                <NumericFormat
                                    disabled={disableInput||!isValidAction(limitedActions, "MVA")}
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
                            <div className="form-group col-md-6">
                                <label htmlFor="username">Bằng chữ</label>
                                <div className="fw-bold fami-text-primary fs-6">{readingNumber(formik.values.value).trim().toUpperCase()} đồng.</div>
                                
                            </div>
                            
                            <div className="form-group col-md-12">
                                <label htmlFor="username">Ghi chú</label>
                                <InputText
                                    disabled={disableInput||!isValidAction(limitedActions, "MNO")}
                                    value={formik.values.note}
                                    onChange={(e) => {
                                        formik.setFieldValue('note', e.target.value);
                                        } }
                                    
                                    placeholder="Ghi chú"
                                    style={{ width: "100%", borderRadius: "10px",textTransform:'capitalize' }} />
                            </div>
                        </div>
                    </>} 
                    title={<>Phiếu cầm</>} 
                    tool={<></>} 
                    isPadding={true} 
                    className={""}
                />
                }
            </div>
            <div className="col-md-2"></div>
        </div>
        <EmptyHeight height={48}/>
        <div className='fixed-bottom'>
                <div className='d-flex justify-content-end'>
                    <button type='button' className='btn btn-outline-danger me-2' onClick={()=>handleCancel()}><i className='ri-close-line'></i> <span className="list-action-label">{t("action.close")}</span></button>
                    {pawnState.action==='VIE'?
                        pawnState.item.disabled?
                        <ActionButton action={"UND"} className={"me-2"} minimumEnable={true} label={"Phục hồi"} onClick={()=>handleRestore()}/>
                        :<>
                            {pawnState.item.status==="ACTIVE"&&<>
                            <ActionButton action={"UPD"} className={"me-2"} minimumEnable={true} label={"Sửa"} onClick={()=>dispatch(changeAction("UPD"))}/>
                            <ActionButton action={"UNV"} className={"me-2"} minimumEnable={true} label={"Chờ duyệt"} onClick={()=>handleVerify("UNVERIFY")}/>
                            <ActionButton action={"DEL"} className={"me-2"} minimumEnable={true} label={"Xóa"} onClick={()=>handleDelete()}/>
                            </>
                            }
                            {pawnState.item.status==="UNVERIFY"&&<>
                            <ActionButton action={"DVE"} className={"me-2"} minimumEnable={true} label={"Từ chối duyệt"} onClick={()=>handleVerify("DENY-VERIFY")}/>
                            <ActionButton action={"APP"} className={"me-2"} minimumEnable={true} label={"Duyệt"} onClick={()=>handleVerify("VERIFY")}/>
                            </>
                            }
                            {pawnState.item.status==="VERIFY"&&<>
                                <ActionButton action={"CVE"} className={"me-2"} minimumEnable={true} label={"Hủy duyệt"} onClick={()=>handleVerify("CANCEL-VERIFY")}/>
                                <ActionButton action={"WLQ"} className={"me-2"} minimumEnable={true} label={"Chờ thanh lý"} onClick={()=>handleVerify("UNLIQUID")}/>
                                <ActionButton action={"WAI"} className={"me-2"} minimumEnable={true} label={"Chờ tất toán"} onClick={()=>handleVerify("WAIT")}/>
                            </>
                            }
                            {pawnState.item.status==="UNLIQUID"&&<>
                                <ActionButton action={"DLQ"} className={"me-2"} minimumEnable={true} label={"Từ chối thanh lý"} onClick={()=>handleVerify("DENY-LIQUID")}/>
                                <ActionButton action={"LIQ"} className={"me-2"} minimumEnable={true} label={"Thanh lý"} onClick={()=>handleVerify("LIQUID")}/>
                            </>
                            }
                            {pawnState.item.status==="LIQUID"&&<>
                                <ActionButton action={"CLQ"} className={"me-2"} minimumEnable={true} label={"Hủy thanh lý"} onClick={()=>handleVerify("CANCEL-LIQUID")}/>
                            </>
                            }
                            {pawnState.item.status==="WAIT"&&<>
                                <ActionButton action={"DRE"} className={"me-2"} minimumEnable={true} label={"Từ chối tất toán"} onClick={()=>handleVerify("DENY-REDEEM")}/>
                                <ActionButton action={"RED"} className={"me-2"} minimumEnable={true} label={"Tất toán"} onClick={()=>handleVerify("REDEEM")}/>
                            </>
                            }
                            {pawnState.item.status==="REDEEM"&&<>
                            <ActionButton action={"CRE"} className={"me-2"} minimumEnable={true} label={"Hủy tất toán"} onClick={()=>handleVerify("CANCEL-REDEEM")}/>
                            </>
                            }
                        </>                    
                    :<></>}
                    <FormAction action={pawnState.action} onClick={()=>formik.handleSubmit()}/>
                </div>
        </div>
        <DynamicDialog 
                    visible={visibleDialog}
                    width={600}
                    position={"center"} 
                    title={<>Khách hàng mới</>} 
                    body={
                        <div className="py-2">
                            
                            <div className="form-group">
                                <label className='form-label' htmlFor="fullName">Họ và tên<b className="text-danger">*</b></label>
                                <InputText
                                    id="fullName"
                                    name="fullName" 
                                    value={formikCustomer.values.fullName}
                                    onChange={(e) => {
                                    formikCustomer.setFieldValue('fullName', e.target.value);
                                            }}
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('fullName',formikCustomer) })}
                                        style={{width:"100%",borderRadius:8}} 
                                    />
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className='form-label' htmlFor="phone">Điện thoại</label>
                                            <InputText
                                                id="phone" 
                                                name="phone"
                                                keyfilter="num"
                                                value={formikCustomer.values.phone.trim()}
                                                onChange={(e) => {
                                                    formikCustomer.setFieldValue('phone', e.target.value);
                                                    }}
                                                className={classNames({ 'p-invalid': isFormFieldInvalid('phone',formikCustomer) })}
                                                style={{width:"100%",borderRadius:8,height:42}} 
                                            />
                                        
                                        
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                            <label className='form-label' htmlFor="personal_card">CCCD</label>
                                            <div className="p-inputgroup flex-1">
                                                <InputText
                                                    id="personal_card" 
                                                    name="personal_card"
                                                    keyfilter="num"
                                                    value={formikCustomer.values.personalCard}
                                                    onChange={(e) => {
                                                        formikCustomer.setFieldValue('personalCard', e.target.value);
                                                        }}
                                                    className={classNames({ 'p-invalid': isFormFieldInvalid('personalCard',formikCustomer) })}
                                                    style={{width:"100%",borderTopLeftRadius:8,borderBottomLeftRadius:8}} 
                                                />
                                                <Button icon="ri-camera-line" className="p-button-primary" style={{borderTopRightRadius:8,borderBottomRightRadius:8}}  onClick={triggerFileInput}/>
                                                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleAvatarChange} accept="image/*" />
                                            </div>
                                           
                                    </div>
                                </div>
                            </div>
                            {imageSrc!==''&&<Image src={imageSrc} width="280" style={{position:"unset"}}/>}
                            {imageSrc===''&&formikCustomer.values.personalCardImage&&<Image src={s3ImageLink+formikCustomer.values.personalCardImage} width="280" style={{position:"unset"}}/>}
                            <div className="row">
                                <div className="form-group col-sm-6">
                                    <div>Tỉnh/Thành phố</div>
                                    <Dropdown disabled={disableInput} filter options={getProvinceData()} optionLabel="name" optionValue="name" placeholder="Chọn Tỉnh/Thành phố" value={formikCustomer.values.province}
                                        onChange={(e) => onChangeCusProvince(e.target.value)} style={{ width: '100%', padding: 0 }} />
                                </div>
                                <div className="form-group col-sm-6">
                                    <div>Quận/huyện</div>
                                    <Dropdown disabled={disableInput} filter options={qhCus} emptyMessage="Vui lòng chọn tỉnh/tp" optionLabel="name" optionValue="name" placeholder="" value={formikCustomer.values.district}
                                        onChange={(e) => onChangeCusDistrict(e.target.value)} style={{ width: '100%', padding: 0 }} />
                                </div>
                                <div className="form-group col-sm-6">
                                    <div>Phường/xã</div>
                                    <Dropdown disabled={disableInput} filter options={pxCus} emptyMessage="Vui lòng chọn quận/huyện" optionLabel="name" optionValue="name" placeholder="" value={formikCustomer.values.ward} onChange={(e) => formikCustomer.setFieldValue('ward', e.target.value)} style={{ width: '100%', padding: 0 }} />
                                </div>
                                <div className="form-group col-sm-6">
                                    <label className='form-label' htmlFor="address">Địa chỉ</label>
                                        <InputText
                                            id="address" 
                                            name="address"
                                            value={formikCustomer.values.address}
                                            onChange={(e) => {
                                                formikCustomer.setFieldValue('address', e.target.value);
                                                }}
                                            className={classNames({ 'p-invalid': isFormFieldInvalid('address',formikCustomer) })}
                                            style={{width:"100%",borderRadius:8}} 
                                        />
                                </div>
                            </div>
                        </div>
                    } 
                    footer={<><button type="button" className='btn btn-primary float-end' onClick={()=>formikCustomer.handleSubmit()}><i className="ri-add-line"></i>Thêm</button></>} 
                    draggable={false} 
                    resizeable={false} 
                    onClose={()=>setVisibleDialog(false)}
                />
    </>
}