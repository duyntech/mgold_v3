import { OverlayPanel } from "primereact/overlaypanel";
import ActionButton from "../../components/action/ActionButton";
import { ContentLoading, DynamicDialog, EmptyBox, EmptyHeight, StatusDropdown } from "../../components/commons";
import { useEffect, useRef, useState } from "react";
import { MAX_IMAGE_SIZE, findDistrictId, getProvinceData, getProvinceDistrictData, getWards, isPhone, removeVietnameseTones, scaleImage } from "../../utils/util";
import { completed, failed, processing, warningWithConfirm } from "../../utils/alert";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ProfileModel } from "../../model/Profile.model";
import { FormikErrors, useFormik } from "formik";
import { actions, status } from "../../types";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { isFormFieldInvalid } from "../../utils/validate";
import Card from "../../components/commons/Card";
import ItemCard from "../../components/commons/ItemCard";
import Assets from "../../assets";
import { Paginator } from "primereact/paginator";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { changeAction, deleteItem, denyItem, editItem, fetchAll, resetActionState, restoreItem, selectItem, setFilteredList, setFiltersByKey, unverifyItem, verifyItem } from "../../slices/customer/customer.slice";
import FormAction from "../../components/commons/FormAction";
import { t } from "i18next";
import { addItem,resetActionState as resetProfileAction } from "../../slices/profile/profile.slice";
import MonneyFormat from "../../components/commons/MoneyFormat";
import { Button } from "primereact/button";
import {
    S3Client,
    PutObjectCommand
} from "@aws-sdk/client-s3";
import { Image } from "primereact/image";
import { patchItem, selectHistory, viewHistory } from "../../slices/history/history.slice";
import ActionIcon from "../../components/commons/ActionIcon";
import SummaryElementGrid from "../../components/commons/SummaryElementGrid";
import { TabPanel, TabView } from "primereact/tabview";
import { customerStatus } from "../../utils/constants/const";
// import { InputSwitch } from "primereact/inputswitch";
import { fetchCategories } from "../../slices/category/category.slice";
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
export default function AllCustomer(){
    const dispatch = useAppDispatch()
    const customerState = useAppSelector((state) => state.customer);
    const profileState = useAppSelector((state) => state.profile);
    const historyState = useAppSelector((state) => state.history);
    const categoryState = useAppSelector((state) => state.category)
    //console.log(historyState.histories)
    const search=useAppSelector((state)=>state.header.search);
    const [users, setUsers] = useState<any[]>([])
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [historyDialog, setHistoryDialog] = useState(false);
    const disableInput = !["INS", "UPD","UNV"].includes(customerState.action);
    const [activeIndex, setActiveIndex] = useState(customerState.filters.tab)
    const filteredList=customerState.filteredList.filter(item=>item.status===customerStatus[activeIndex]);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);
    const [totalPages, setTotalPages] = useState(Math.ceil(filteredList.length/rows));
    const isPhoneDevice=isPhone();
    const [status, setStatus] = useState<status>("ACTIVE");
    const op = useRef<any>(null);
    //const [denied, setDenied] = useState(false);
    const [imageSrc, setImageSrc] = useState<string>('');
    const [fileAvtUpload, setfileAvtUpload] =useState<File | null>(null);
    const [qh, setQh] = useState<Array<any>>([])
    const [px, setPx] = useState<Array<any>>([])
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
    const formik = useFormik<ProfileModel>({
        initialValues: ProfileModel.initial(),
        validate: (data) => {
            const errors:FormikErrors<ProfileModel> = {};
            if (!data.fullName&&data.status==="VERIFY") {
                errors.fullName = 'Vui lòng nhập Họ và tên';
            }
            return errors;
        },
        onSubmit: (data:ProfileModel) => {
            let cardImage=data.personalCardImage
            if(fileAvtUpload){
                const {name}=fileAvtUpload
                cardImage='cccd/'+name
            }
            const submitData={
                id:data.id,
                type:"CUSTOMER",
                full_name:data.fullName&&data.fullName.trim(),
                phone:data.phone,
                email:data.email,
                address:data.address,
                personal_card:data.personalCard,
                personal_card_image:cardImage,
                province:data.province,
                district:data.district,
                ward:data.ward
            }
            //console.log(submitData)
            switch (customerState.action) {
                case "INS":
                    dispatch(addItem(submitData));
                break
                case "UPD":
                    dispatch(editItem(submitData));
                    break
                case "VER":
                    const verifyData={
                        id:data.id,
                        full_name:data.customer.temp_full_name.trim(),
                        birthday:data.customer.temp_birthday,
                        phone:data.customer.temp_phone,
                        email:data.customer.temp_email,
                        address:data.customer.temp_address,
                        personal_card:data.customer.temp_personal_card,
                        personal_card_image:data.customer.temp_personal_card_image,
                        province:data.customer.temp_province,
                        district:data.customer.temp_district,
                        ward:data.customer.temp_ward,
                        denied:0
                    }
                    // if(denied){
                        warningWithConfirm({
                            title: "Duyệt",
                            text: "Bạn muốn Duyệt yêu cầu thay đổi thông tin?",
                            confirmButtonText: "Đồng ý",
                            confirm: ()=>{
                                dispatch(verifyItem(verifyData));
                            }
                        })
                    // }
                    // else{
                    //     dispatch(verifyItem(verifyData));
                    // }
                    
                break
                case "UNV":
                    dispatch(unverifyItem(submitData));
                break
                
                case "DEL":
                    warningWithConfirm({
                        title: "Xóa",
                        text: "Bạn muốn xóa khách hàng "+data.fullName +" ?",
                        confirmButtonText: "Đồng ý",
                        confirm: ()=>{
                            dispatch(deleteItem(submitData))
                        }
                    })
                break
            }
        }
    });
    const handleDenyClick=()=>{
        const deniedData={
            id:formik.values.id,
            full_name:formik.values.customer.temp_full_name.trim(),
            birthday:formik.values.customer.temp_birthday,
            phone:formik.values.customer.temp_phone,
            email:formik.values.customer.temp_email,
            address:formik.values.customer.temp_address,
            personal_card:formik.values.customer.temp_personal_card,
            personal_card_image:formik.values.customer.temp_personal_card_image,
            province:formik.values.customer.temp_province,
            district:formik.values.customer.temp_district,
            ward:formik.values.customer.temp_ward,
            denied:1
        }
            warningWithConfirm({
                title: "Từ chối",
                text: "Bạn muốn Từ chối yêu cầu thay đổi thông tin?",
                confirmButtonText: "Đồng ý",
                confirm: ()=>{
                    dispatch(denyItem(deniedData));
                }
            })
    }
    const onPageChange = (event:any) => {
        //console.log(event)
        setFirst(event.first);
        setRows(event.rows);
        setTotalPages(event.pageCount);
        setPage(event.page+1);
    };
    const handleActionClick=(item:ProfileModel, action:actions)=>{ 
        if(action==="DEL"){
            //console.log(item)
            warningWithConfirm({
                title: "Xóa",
                text: "Bạn muốn xóa khách hàng "+item.fullName +" ?",
                confirmButtonText: "Đồng ý",
                confirm: ()=>{
                    dispatch(deleteItem(item));
                }
            })
            
        }
        else{
            dispatch(changeAction(action));  
            setVisibleDialog(true);
            formik.setValues(item)
        }
    }
    const handleCancel = () => {
        setVisibleDialog(false);
        formik.resetForm();
    }
    const handleRestore = () => {
        dispatch(restoreItem(formik.values));
    }
    const goldTabHeaderTemplate = (options:any) => {
        return (
            <div onClick={options.onClick} className={options.className}>
                {options.leftIconElement}
                {options.titleElement}
            </div>
        );
    };
    const filterList=()=>{
        let filtered=customerState.list
        if(status!=="ALL"){
            filtered=filtered.filter(
                item=>item.disabled===(status==="DEACTIVE"))
        }
        dispatch(setFilteredList(filtered))
    }
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
    useEffect(()=>{
        if(visibleDialog&&customerState.action==="VIE"){
            for (const [key, value] of Object.entries(getProvinceDistrictData())) {
                if (key == formik.values.province) {
                    let d = new Array<any>()
                    let k = value as Array<string>
                    k.map((e: string) => d.push({ name: e }))
                    setQh(d)
                }
            }
            setPx(getWards(findDistrictId(formik.values.province, formik.values.district)))
        }
    },[visibleDialog,customerState.action])
    useEffect(() => {
        filterList()
    }, [status])
    useEffect(() => {
        switch (profileState.statusAction) {
            case 'failed':
                failed(profileState.error);
                dispatch(resetProfileAction(''));
                break;
            case "loading":
                processing();
                break;
            case 'completed':
                completed();
                dispatch(resetProfileAction(''));
                handleCancel()
                formik.setValues(profileState.item)
                dispatch(fetchAll({}))
                break;
        }
    }, [profileState.statusAction])
    useEffect(() => {
        switch (customerState.statusAction) {
            case 'failed':
                failed(customerState.error);
                dispatch(resetActionState(''));
                break;
            case "loading":
                processing();
                break;
            case 'completed':
                completed();
                dispatch(resetActionState(''));
                handleCancel()
                formik.setValues(customerState.item)
                dispatch(fetchAll({}))
                if(fileAvtUpload){
                    uploadFile(fileAvtUpload)
                }
                break;
        }
    }, [customerState.statusAction])
    useEffect(() => {
        if (customerState.status === 'failed') {
            failed(customerState.error);
        }
        if(customerState.status==="completed"){
            filterList()
            setTotalPages(Math.ceil(filteredList.length/rows))
        
        }
    }, [customerState.status])
    useEffect(() => {
        if(search!==undefined&&search!==''){
            let filtered=customerState.list.filter(
                item=>item.phone!==null&&item.phone.toLowerCase().includes(search.toLowerCase()) || 
                item.fullName!==null&&item.fullName.toLowerCase().includes(search.toLowerCase()) ||
                item.fullName!==null&&removeVietnameseTones(item.fullName.toLowerCase()).includes(removeVietnameseTones(search.toLowerCase()))
            )
            if(status!=="ALL"){
                filtered=filtered.filter(
                    item=>item.disabled===(status==="DEACTIVE"))
            }
            dispatch(setFilteredList(filtered))
        }
        else{
            filterList()
        }
    }, [search,dispatch])
    useEffect(() => {
        switch (categoryState.status) {
            case 'failed':
                failed(categoryState.error)
                break;
            case 'completed':
                setUsers(categoryState.data.users??[])
                dispatch(fetchAll({}))
                break;
        }
    }, [categoryState.status])
    useEffect(() => {
        
        dispatch(fetchCategories({ categories: ['users']}))
    }, [])
    return<>
        <DynamicDialog
            width={600} 
            visible={historyDialog} 
            position={undefined} 
            title={<div><i className="ri-history-line"></i> Nhật ký thay đổi</div>} 
            body={<div className="pb-2">
                {
                        historyState.statusAction === 'loading'?
                        <ContentLoading.ItemCardHolder contentRows={1} items={10} image={false} uniqueKey="histories-holder-item"/>:
                        <>
                        {historyState.histories.length>0?
                        <>{
                            historyState.histories.map((item,index)=>{
                                const diffElementList:any=[]
                                if(item.more){
                                    item.differents.map((e)=>{
                                        let oldValue=e.oldValue
                                        let newValue=e.newValue
                                        if(typeof oldValue === 'number' && oldValue !== null){
                                            oldValue=Number(oldValue).toLocaleString('de-DE')
                                        }
                                        if(typeof newValue === 'number' && oldValue !== null){
                                            newValue=Number(newValue).toLocaleString('de-DE')
                                        }
                                        diffElementList.push({
                                            col_1:<b>{t(e.key)}</b>,
                                            col_2:<div >{oldValue}</div>,
                                            col_3:<div >{newValue}</div>,
                                            sum:false
                                        })
                                    })
                                }
                                return <div className="pt-2" key={"history-item-" + index}>
                                <ItemCard 
                                    uniqueKey={""} 
                                    active={item.active} 
                                    body={<>
                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex">
                                                    <ActionIcon action={item.action} className={"fami-text-primary me-1"}/>
                                                    <div className={`fami-text-primary me-1`}><b>{t('action.'+item.action)}</b></div>
                                                </div>
                                                {item.action==="UPD"?<i className={`${item.more?"ri-eye-off-line":"ri-eye-line"} fami-text-primary`} onClick={()=>dispatch(viewHistory(item))}></i>:<></>}
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div><i className="ri-timer-flash-line fami-text-primary icon-on-list"></i> {item.datetime}</div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div><i className="ri-user-add-line fami-text-primary icon-on-list"></i> {item.creator}</div>
                                                </div>
                                            </div>
                                            {item.more?
                                            <>
                                                <div className="p-2"></div>
                                                <div style={{background:"white"}}>
                                                <SummaryElementGrid 
                                                    title={<div className="fami-text-primary"><b>Nội dung thay đổi</b></div>} 
                                                    cols={3} items={diffElementList} 
                                                    classNames={{
                                                    col_1: "w-20 overflow-auto",
                                                    col_2: "w-40 text-break",
                                                    col_3: "w-40 text-break text-danger"
                                                    }}
                                                />
                                                </div>
                                            </>
                                            :<></>}
                                        </>} 
                                    background={"active-item-card-background"}
                                    onClick={()=>dispatch(selectHistory(item))} 
                                    onDoubleClick={item.action==="UPD"?()=>dispatch(viewHistory(item)):()=>{}}
                                    contextMenu={[]}
                                    />
                            </div>
                            })
                        }</>
                        :<EmptyBox description={<>Chưa có thông tin</>} image={Assets.images.emptyBox1} disabled={false} />
                        }
                        </>
                    }
            </div>} 
            footer={<></>} 
            draggable={false} 
            resizeable={false} 
            onClose={()=>setHistoryDialog(false)}/>
        <DynamicDialog 
                    visible={visibleDialog}
                    width={600}
                    position={"center"} 
                    title={<>Khách hàng</>} 
                    body={
                        <div className="py-2">
                            <div className="form-group">
                                <label className='form-label' htmlFor="fullName">Họ và tên<b className="text-danger">*</b></label>
                                <InputText
                                    disabled={disableInput}
                                    id="fullName"
                                    name="fullName" 
                                    value={formik.values.fullName}
                                    onChange={(e) => {
                                    formik.setFieldValue('fullName', e.target.value);
                                            }}
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('fullName',formik) })}
                                        style={{width:"100%",borderRadius:8}} 
                                    />
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label className='form-label' htmlFor="phone">Điện thoại</label>
                                        <InputText
                                            disabled={disableInput}
                                            id="phone" 
                                            name="phone"
                                            keyfilter="num"
                                            value={formik.values.phone}
                                            onChange={(e) => {
                                                formik.setFieldValue('phone', e.target.value);
                                                }}
                                            className={classNames({ 'p-invalid': isFormFieldInvalid('phone',formik) })}
                                            style={{width:"100%",borderRadius:8}} 
                                        />
                                    
                                    
                                </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label className='form-label' htmlFor="personal_card">CCCD</label>
                                        <div className="p-inputgroup flex-1">
                                            <InputText
                                                disabled={disableInput}
                                                id="personal_card" 
                                                name="personal_card"
                                                keyfilter="num"
                                                value={formik.values.personalCard}
                                                onChange={(e) => {
                                                    formik.setFieldValue('personalCard', e.target.value);
                                                    }}
                                                className={classNames({ 'p-invalid': isFormFieldInvalid('personalCard',formik) })}
                                                style={{width:"100%",borderTopLeftRadius:8,borderBottomLeftRadius:8}} 
                                            />
                                            <Button disabled={disableInput} icon="ri-camera-line" className="p-button-primary" style={{borderTopRightRadius:8,borderBottomRightRadius:8}}  onClick={triggerFileInput}/>
                                            <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleAvatarChange} accept="image/*" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {imageSrc!==''&&<Image src={imageSrc} width="280" style={{position:"unset"}}/>}
                            {imageSrc===''&&formik.values.personalCardImage&&<Image src={s3ImageLink+formik.values.personalCardImage} width="280" style={{position:"unset"}}/>}
                            <div className="row">
                                <div className="form-group col-sm-6">
                                    <div>Tỉnh/Thành phố</div>
                                    <Dropdown disabled={disableInput} filter options={getProvinceData()} optionLabel="name" optionValue="name" placeholder="Chọn Tỉnh/Thành phố" value={formik.values.province}
                                        onChange={(e) => onChangeProvince(e.target.value)} style={{ width: '100%', padding: 0 }} />
                                </div>
                                <div className="form-group col-sm-6">
                                    <div>Quận/huyện</div>
                                    <Dropdown disabled={disableInput} filter options={qh} emptyMessage="Vui lòng chọn tỉnh/tp" optionLabel="name" optionValue="name" placeholder="" value={formik.values.district}
                                        onChange={(e) => onChangeDistrict(e.target.value)} style={{ width: '100%', padding: 0 }} />
                                </div>
                                <div className="form-group col-sm-6">
                                    <div>Phường/xã</div>
                                    <Dropdown disabled={disableInput} filter options={px} emptyMessage="Vui lòng chọn quận/huyện" optionLabel="name" optionValue="name" placeholder="" value={formik.values.ward} onChange={(e) => formik.setFieldValue('ward', e.target.value)} style={{ width: '100%', padding: 0 }} />
                                </div>
                                <div className="form-group col-sm-6">
                                    <label className='form-label' htmlFor="address">Địa chỉ</label>
                                    <InputText
                                        disabled={disableInput}
                                        id="address" 
                                        name="address"
                                        value={formik.values.address}
                                        onChange={(e) => {
                                            formik.setFieldValue('address', e.target.value);
                                            }}
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('address',formik) })}
                                        style={{width:"100%",borderRadius:8}} 
                                    />
                                </div>

                                {formik.values.status==="UNVERIFY"&&<Card body={<div className="row">
                                    {formik.values.fullName!==formik.values.customer.temp_full_name&&<div className="col-sm-6"> Họ và tên: <b className="text-danger">{formik.values.customer.temp_full_name}</b></div>}
                                    {formik.values.phone!==formik.values.customer.temp_phone&&<div className="col-sm-6"> Số điện thoại: <b className="text-danger">{formik.values.customer.temp_phone}</b></div>}
                                    {formik.values.email!==formik.values.customer.temp_email&&<div className="col-sm-6"> Email: <b className="text-danger">{formik.values.customer.temp_email}</b></div>}
                                    {formik.values.birthDate!==formik.values.customer.temp_personal_card&&<div className="col-sm-6"> Ngày sinh: <b className="text-danger">{formik.values.customer.temp_birthday}</b></div>}
                                    {formik.values.personalCard!==formik.values.customer.temp_personal_card&&<div className="col-sm-6"> CCCD: <b className="text-danger">{formik.values.customer.temp_personal_card}</b></div>}
                                    {formik.values.province!==formik.values.customer.temp_province&&<div className="col-sm-6"> Tỉnh/Thành phố: <b className="text-danger">{formik.values.customer.temp_province}</b></div>}
                                    {formik.values.district!==formik.values.customer.temp_district&&<div className="col-sm-6"> Quận/huyện: <b className="text-danger">{formik.values.customer.temp_district}</b></div>}
                                    {formik.values.ward!==formik.values.customer.temp_ward&&<div className="col-sm-6"> Phường/Xã: <b className="text-danger">{formik.values.customer.temp_ward}</b></div>}
                                    {formik.values.address!==formik.values.customer.temp_address&&<div className="col-sm-6"> Địa chỉ: <b className="text-danger">{formik.values.customer.temp_address}</b></div>}
                                    </div>} 
                                    title={<>Thông tin cần duyệt</>} 
                                    tool={<></>} 
                                    isPadding={false} 
                                    className={""}/>
                                }
                            </div>
                        </div>
                    } 
                    footer={
                        <>
                        <button type='button' className='btn btn-outline-danger' onClick={()=>handleCancel()}><i className='ri-close-line'></i> <span className="list-action-label">{t("action.close")}</span></button>
                        {customerState.action==='VIE'?
                            formik.values.disabled?
                            <ActionButton action={"UND"} className={""} minimumEnable={false} label={"Phục hồi"} onClick={()=>handleRestore()}/>
                            :
                            <>
                                {formik.values.status==="VERIFY"&&<>
                                    <ActionButton action={"UNV"} className={""} minimumEnable={false} label={"Sửa"} onClick={()=>dispatch(changeAction("UNV"))}/>
                                    <ActionButton action={"DEL"} className={""} minimumEnable={false} label={"Xóa"} onClick={()=>handleActionClick(formik.values,"DEL")}/>
                                    </>
                                }
                                
                            </>
                        :<></>}
                        {formik.values.status==="UNVERIFY"&&<>
                            <ActionButton action={"DVE"} className={""} minimumEnable={false} label={"Từ chối"} onClick={()=>handleDenyClick()}/>
                            </>
                        }
                        <FormAction action={customerState.action} onClick={formik.handleSubmit}/>
                        </>
                    }  
                    draggable={false} 
                    resizeable={false} 
                    onClose={()=>setVisibleDialog(false)}
                />

            <Card 
                body={
                customerState.status === 'loading'||categoryState.status==='loading'?
                    <ContentLoading.ItemCardHolder contentRows={1} items={10} image={false} uniqueKey="goldgroup-holder-item"/>:
                <>
                <TabView activeIndex={activeIndex} onTabChange={(e)=>{
                        dispatch(setFiltersByKey({key:"tab",value:e.index}))
                        setActiveIndex(e.index)
                }}>
                        <TabPanel header={"Đã duyệt"+` (${customerState.filteredList.filter(item=>item.status==='VERIFY'&&!item.disabled).length})`} leftIcon="ri-verified-badge-line icon-on-list me-1" headerTemplate={goldTabHeaderTemplate}>  
                        </TabPanel>
                        <TabPanel header={"Chờ duyệt"+` (${customerState.filteredList.filter(item=>item.status==='UNVERIFY'&&!item.disabled).length})`} leftIcon="ri-questionnaire-line icon-on-list me-1" headerTemplate={goldTabHeaderTemplate}>
                        </TabPanel>
                </TabView>
                    {
                    filteredList.length>0?
                        filteredList.map((item, index)=>{
                            if (index >= first && index < (first + rows))
                                {
                                const updatedUser=item.customer.updatedAccount?users.find(e=>e._id===item.customer.updatedAccount):undefined
                                return <div className="pt-2" key={"tag-item" + index}>
                                <ItemCard 
                                        uniqueKey={""}
                                        active={item.active}
                                        body={<>
                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex">
                                                    <div className={`fami-text-primary me-1 ${item.disabled ? 'disabled-text' : ''}`}><b>{item.fullName}</b></div>
                                                    <div>{item.disabled ? <i className="ri-close-line my-error"></i> : <i className="ri-check-line my-success"></i>}</div>
                                                    {item.status==="UNVERIFY"&&<div className="px-2 text-danger">(Người yêu cầu: {updatedUser?<><b>{updatedUser.type==="CUSTOMER"?"Khách hàng ":"Nhân viên "}</b> {updatedUser.full_name}</>:''})</div>}
                                                </div>
                                                <div className="ps-3" style={{cursor:"pointer"}} onClick={()=>{
                                                    const request={
                                                        transaction:"ACCOUNT",
                                                        id:item.id
                                                    }
                                                    dispatch(selectItem(item))
                                                    dispatch(patchItem(request))
                                                    setHistoryDialog(true)
                                                }}><i className="ri-history-line fs-6 fami-text-primary"></i></div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <div><i className="ri-phone-line fami-text-primary icon-on-list"></i> {item.phone}</div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div><i className="ri-home-line fami-text-primary icon-on-list"></i>{item.address&&item.address!==""?item.address:""} {item.ward&&item.ward!==""?", "+item.ward:""} {item.district&&item.district!==""?", "+item.district:""} {item.province&&item.province!==""?", "+item.province:""} </div>
                                                </div>
                                                <div className="col-sm-3">
                                                    <div><i className="ri-id-card-line fami-text-primary icon-on-list"></i> {item.personalCard}</div>
                                                </div>
                                            </div>
                                        </>}
                                        background={item.disabled ? 'disabled-element' : "active-item-card-background"}
                                        onClick={() => dispatch(selectItem(item.id))}
                                        onDoubleClick={()=>handleActionClick(item,item.status==="VERIFY"?"VIE":"VER")} 
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
                                </div>
                                <EmptyHeight height={30} />
                    </OverlayPanel>
                    
                </>
                }
                title={<div style={{ cursor: "pointer" }} onClick={(e) => op.current.toggle(e)}><i className="ri-filter-2-fill"></i> Danh sách khách hàng</div>}
                tool={
                <div className="d-flex">
                    <ActionButton action={"INS"} className={""} onClick={() => handleActionClick(ProfileModel.initial(), "INS")} minimumEnable={true} label={"Thêm"}/>
                </div>
                }
                isPadding={true} 
                className={""} 
            />
            <EmptyHeight height={48}/>
            <div className='fixed-bottom'>
                <div className="row">
                    <div className="col-md-10"></div>
                    <div className="col-md-2">
                        <div className="d-flex">
                            <div className="me-2 align-self-end">Tổng khách:</div>
                            <b><MonneyFormat value={filteredList.length} positiveColor={"fami-text-primary fw-bold"} unit={""} decimal={false}/></b>
                            
                        </div>
                    </div>
                </div>
            </div>
    </>
}