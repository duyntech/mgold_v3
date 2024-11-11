import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import EmptyHeight from "../../components/commons/EmptyHeight";
import Card from "../../components/commons/Card";
import { t } from "i18next";
import { completed, failed, processing } from "../../utils/alert";
import { clearFingerState, fetchFingers, registerFinger } from "../../slices/fingerprint/fingerprint.slice";
import { Button } from "primereact/button";
import { Spinner } from "react-bootstrap";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { baseWssUrl } from "../../utils/constants/const";
export default function Fingerprint() {
    const profileState = useAppSelector((state) => state.profile);
    const fingerState = useAppSelector((state: any) => state.finger)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const profile = profileState.item;
    const WS_URL = baseWssUrl + `?user_name=${profile.username}&user_id=${profile.id}` + 'profile'
    const WS_URL2 = baseWssUrl + `?user_name=${profile.username}&user_id=${profile.id}` + 'profile' + ' receive'
    const { sendJsonMessage, readyState } = useWebSocket(
        WS_URL,
        {
            share: false,
            shouldReconnect: () => true,
        },
    )
    const { lastJsonMessage } = useWebSocket(
        WS_URL2,
        {
            share: false,
            shouldReconnect: () => true,
        },
    )

    function requestRegister() {
        if (readyState === ReadyState.OPEN) {
            processing('Chờ xác nhận...')
            sendJsonMessage(
                {
                    "service": "reg_prints",
                    "action": "message",
                    "data": { "sender_id": "register_finger", "sender_name": "", "msg": `Người dùng ${profile.username} cần đăng ký vân tay` },
                }
            )
        }
    }

    const registerFingerprint = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        try {
            var res = await fetch('http://localhost:8080/read_fingerprint', { signal: controller.signal })
            var data = await res.json();
            if (data.code == 0) {
                dispatch(registerFinger({ employee: profile.id, prints: [...fingerState.fingers, data.data, data.data2] }))
            } else {
                //show error
                failed(data.data)
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                failed('Vui lòng mở server vân tay');
            } else {
                failed('Xảy ra lỗi');
            }
        } finally {
            clearTimeout(timeoutId);
        }
    }

    function loadFingerprint(id: string) {
        dispatch(fetchFingers({ employee: id }))
    }

    useEffect(() => {
        switch (fingerState.registerState.status) {
            case "completed":
                completed();
                loadFingerprint(profile.id);
                dispatch(clearFingerState());
                break;
            case "failed":
                failed('Đăng ký thất bại')
                dispatch(clearFingerState());
                break;
        }
    }, [fingerState.registerState])

    useEffect(() => {
        loadFingerprint(profile.id)
    }, [])

    const handleCancel = () => {
        navigate(-1)
    }

    useEffect(() => {
        if (lastJsonMessage) {
            const service = (lastJsonMessage as any).service
            if (service === "reg_prints_rep") {
                const data = (lastJsonMessage as any).data
                if (data.msg == 'OK') {
                    processing('Đặt ngón tay vào thiết bị quét...')
                    registerFingerprint()
                } else {
                    failed('Yêu cầu bị từ chối')
                }
            }
        }
    }, [lastJsonMessage])


    return (
        <Card
            body={<>
                <div className="row pt-1 col-lg-12">
                    <div className='form-group col-sm-12'>
                        {fingerState.fetchState.status == 'loading' ? <Spinner className="align-items-center mt-2" size="sm" /> :
                            <div className="d-flex flex-row mx-2 gap-3 py-2">
                                {fingerState.fingers.length == 0 ? <>Chưa đăng ký vân tay</> :
                                    fingerState.fingers.length && fingerState.fingers.filter((_: any, index: number) => index % 2 !== 0).map((e: any) => (
                                        <img src={`data:image/png;base64, ${e}`} width={60} height={80} />
                                    ))}
                            </div>
                        }

                    </div>
                    <Button icon="ri-qr-scan-2-line" loading={fingerState.registerState.status == 'loading'}
                        className={"btn-primary unactive col-sm-2 rounded mt-3 mx-3"} label="Đăng ký vân tay" onClick={() => requestRegister()} />
                </div>
                <EmptyHeight height={20} />
                <div className='fixed-bottom'>
                    <div className='d-flex justify-content-end'>
                        <button type='button' className='btn btn-outline-danger me-2' onClick={handleCancel}><i className='ri-close-line'></i> {t("action.close")}</button>
                    </div>
                </div>
            </>
            }
            title={<><i className="ri-fingerprint-line me-1"></i>DANH SÁCH VÂN TAY</>}
            tool={<></>}
            isPadding={true} className={""}
        />

    );
}