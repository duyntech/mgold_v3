import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import Card from "../../components/commons/Card"
import ItemCard from "../../components/commons/ItemCard"
import * as Alert from "../../utils/alert"
import { useEffect, useRef, useState } from "react"
import { ContentLoading, EmptyBox, EmptyHeight, StatusDropdown } from '../../components/commons'
import { ProfileModel } from "../../model/Profile.model"
import { selectItem, changeAction, fetchAll, setFilteredList } from "../../slices/profile/profile.slice"
import { actions, status } from "../../types"
import ActionButton from "../../components/action/ActionButton"
import Assets from "../../assets"
import { removeVietnameseTones } from "../../utils/util"
import { OverlayPanel } from "primereact/overlaypanel"
import { DropdownChangeEvent } from "primereact/dropdown"

export default function AllProfile(){
    const dispatch = useAppDispatch()
    const profileState = useAppSelector((state) => state.profile)
    const search = useAppSelector((state) => state.header.search)
    const filteredList=profileState.filteredList
    const navigate = useNavigate()
    const [status, setStatus] = useState<status>("ACTIVE");
    const op = useRef<any>(null);
    const handleActionClick=(item:ProfileModel, action:actions)=>{ 
        dispatch(changeAction(action));  
        switch (action) {
            case "INS":
                dispatch(selectItem(item))
                navigate("/user-add")
                break;
            case "VIE":
            case "UPD":
            case "DEL":
                dispatch(selectItem(item))
                navigate("/user-edit")
                break;
        }
    }
    const filterList=()=>{
        let filtered=profileState.profiles
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
        if (profileState.status === 'failed') {
            Alert.failed(profileState.error);
        } 
        else if (profileState.status==="completed"){
            filterList()
        }
    }, [profileState.status])
    useEffect(() => {
        if(search!==undefined&&search!==''){
            const filtered=profileState.profiles.filter(
                item=>(item?.phone??'').toLowerCase().includes(search.toLowerCase()) || 
                (item?.fullName??'').toLowerCase().includes(search.toLowerCase()) ||
                removeVietnameseTones((item?.fullName??'').toLowerCase()).includes(removeVietnameseTones(search.toLowerCase()))
            )
            dispatch(setFilteredList(filtered))
        }
        else{
            filterList()
        }
    }, [search,dispatch])
    useEffect(() => {
        dispatch(fetchAll({type:'EMPLOYEE'}))
    }, [])

    return (
        <>
            <Card 
                body={
                profileState.status === 'loading'?
                    <ContentLoading.ItemCardHolder contentRows={1} items={10} image={false} uniqueKey="profile-holder-item"/>:
                    <>
                    {filteredList.length>0?
                        <>{filteredList.map((item, index) => {
                            return <div className="pt-2" key={"user-item-" + index}>
                                <ItemCard
                                    uniqueKey={""}
                                    active={item.active}
                                    body={<>
                                        <div className="d-flex justify-content-between">
                                            <div className="d-flex">
                                                <div className={`fami-text-primary me-1 ${item.disabled ? 'disabled-text' : ''}`}><b>{item.username}</b></div>
                                                <div>{item.disabled ? <i className="ri-close-line my-error"></i> : <i className="ri-check-line my-success"></i>}</div>
                                            </div>
                                          
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <i className='ri-user-line fami-text-primary icon-on-list me-1' />
                                                {item.fullName}
                                            </div>
                                            <div className="col-sm-3">
                                                <i className='ri-phone-line fami-text-primary icon-on-list me-1' />
                                                {item.phone}
                                            </div>
                                            <div className="col-sm-3 text-truncate">
                                                <i className='ri-home-7-line fami-text-primary icon-on-list me-1' />
                                                {item.address}
                                            </div>
                                            <div className="col-sm-3">
                                                <i className='ri-secure-payment-fill fami-text-primary icon-on-list me-1' />
                                                {item.role.name}
                                            </div>
                                        </div>
                                    </>}
                                    onClick={() => dispatch(selectItem(item))}
                                    background={item.disabled ? 'disabled-element' : "active-item-card-background"} 
                                    onDoubleClick={()=>handleActionClick(item,"VIE")} 
                                    contextMenu={[]}
                                    />
                            </div>

                        })}
                    
                    </>
                    :<EmptyBox description={<>Chưa có dữ liệu</>} image={Assets.images.emptyBox1} disabled={false} />
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
                </>}
                title={<div style={{ cursor: "pointer" }} onClick={(e) => op.current.toggle(e)}><i className="ri-filter-2-fill"></i> Danh sách tài khoản</div>}
                tool={<div className="d-flex">
                    <ActionButton action={"INS"} className={""} onClick={() => handleActionClick(ProfileModel.initial(), "INS")} minimumEnable={true} label={"Thêm"}/>
                </div>}
                isPadding={true} className={""}/>
            <EmptyHeight height={48}/>
        </>
    )
}