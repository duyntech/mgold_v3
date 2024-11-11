
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Assets from "../../assets";
import { fetchAll } from "../../slices/goldtype/goldtype.slice";
import { failed } from "../../utils/alert";
import useWebSocket from "react-use-websocket"
import { baseWssUrl } from "../../utils/constants/const";
import { UserRepo } from "../../repository/UserRepository";
import { Toast } from 'primereact/toast';
import { GoldPriceLoading } from "../../components/commons/ContentLoading";
import { AuthService } from "../../services/Auth.service";
import { setLogined } from "../../slices/app.slice";

export default function GoldPrice(){
    const dispatch =useAppDispatch()
    const user_id=UserRepo.getUserId();
    const goldtypeState = useAppSelector((state)=>state.goldtype)
    const ref=useRef<any>(null)
    const toast = useRef<any>(null);

    const show = () => {
        toast.current.show({ severity: 'info', summary: 'Info', detail: 'Giá vàng đã thay đổi!' });
    };
    const [height, setHeight] = useState(0)
    const WS_URL = baseWssUrl+"?user_name=pricescreen&user_id="+user_id
    const { lastJsonMessage } = useWebSocket(
        WS_URL,
        {
        share: false,
        shouldReconnect: () => true,
        },
    )
    const handleLogout = () => {
        const authService = new AuthService();
        authService.logout(); 
        dispatch(setLogined(false))
        window.location.replace('/signin')
    }
    useEffect(()=>{
        switch (goldtypeState.status) {
            case "failed":
                failed(goldtypeState.error)
                break;
        }
    },[goldtypeState.status])
    useEffect(() => {
        dispatch(fetchAll({ store: "ROOT" }))
    }, [])
    useEffect(() => {
        setHeight(ref.current.clientHeight)
    })
    useEffect(()=>{
        console.log("lastJsonMessage",lastJsonMessage)
        if(lastJsonMessage){
            const service=(lastJsonMessage as any).service
            if(service==="price"){
                show()
                dispatch(fetchAll({ store: "ROOT" }))
            }
        }
    },[lastJsonMessage])
    return <>
        <div className="d-flex w-100 p-3">
            <Toast ref={toast} />
            <div className="position-relative">
                <img src={Assets.images.logo} height={height}/>
                <i className="ri-logout-circle-line position-absolute text-white fs-3" style={{left:12,top:6,cursor:"pointer"}} onClick={()=>handleLogout()}></i>
            </div>
            
            <div className="flex-grow-1 ps-3" ref={ref}>
                <div className="installment-procedure" style={{background:"#283673"}}>
                        1. Trả góp qua thẻ tín dụng
                </div>
                <div className="fs-5 ps-5 py-1 pt-3"><i className="ri-arrow-right-s-fill fami-text-primary me-2"></i>Hạn mức tối đa: Tùy thuộc vào Thẻ Tín Dụng.</div>
                <div className="fs-5 ps-5 py-1"><i className="ri-arrow-right-s-fill fami-text-primary me-2"></i>Thời hạn trả góp: 24, 18, 12, 9, 6, 3 tháng.</div>
                <div className="fs-5 ps-5 py-1 pb-3"><i className="ri-arrow-right-s-fill fami-text-primary me-2"></i>Cần chuẩn bị: Thẻ Tín Dụng(Credit).</div>
                <div className="installment-procedure bg-warning">
                        2. Trả góp qua hồ sơ ngân hàng
                </div>
                <div className="fs-5 ps-5 py-1 pt-3"><i className="ri-arrow-right-s-fill text-warning me-2"></i>Hạn mức tối đa: 20.000.000đ.</div>
                <div className="fs-5 ps-5 py-1"><i className="ri-arrow-right-s-fill text-warning me-2"></i>Thời hạn trả góp: 24, 20, 18, 15, 12, 9, 6 tháng.</div>
                <div className="fs-5 ps-5 py-1 pb-3"><i className="ri-arrow-right-s-fill text-warning me-2"></i>Cần chuẩn bị: Căn Cước Công Dân.</div>
            </div>
        </div>
        <div className="w-100 px-3">
            {goldtypeState.status==="loading"? 
            <GoldPriceLoading/>
            :<table className="w-100" style={{borderTopLeftRadius:12,borderTopRightRadius:12}}>
                <thead className="text-white fs-4 text-center" style={{background:"#283673",fontWeight:700}}>
                    <tr>
                        <th scope="col" style={{borderLeft:"1px solid #283673",borderRight:"1px solid white",padding:"8px 16px 8px 16px"}}>GIÁ VÀNG</th>
                        <th scope="col" style={{borderRight:"1px solid white",padding:"8px 16px 8px 16px"}}>CỦA HÀNG MUA</th>
                        <th scope="col" style={{borderRight:"1px solid #283673",padding:"8px 16px 8px 16px"}}>CỬA HÀNG BÁN</th>
                    </tr>
                </thead>
                <tbody>
                    {goldtypeState.list.filter(item=>item.screen).map((item,index)=>{
                    //console.log(datas)
                    return <tr key={"tr-"+index} className={`fs-4 fami-text-primary fw-bold text-center`}>
                                <td style={{borderLeft:"1px solid #283673",borderRight:"1px solid #283673",borderBottom:"1px solid #283673",padding:"6px"}}>{item.name}</td>
                                <td style={{borderRight:"1px solid #283673",borderBottom:"1px solid #283673",padding:"6px"}}>{item.buyPrice.toLocaleString('de-DE')}đ</td>
                                <td style={{borderRight:"1px solid #283673",borderBottom:"1px solid #283673",padding:"6px"}}>{item.sellPrice.toLocaleString('de-DE')}đ</td>
                            </tr>
                        })}
                </tbody>
            </table>
            }
        </div>
        
    </>
}