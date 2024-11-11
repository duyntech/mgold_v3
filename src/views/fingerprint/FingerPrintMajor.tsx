
import { useEffect } from "react";

import {warningWithConfirm } from "../../utils/alert";
import { baseWssUrl } from "../../utils/constants/const";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { UserRepo } from "../../repository/UserRepository";

export default function FingerPrintMajor() {

    const WS_URL = baseWssUrl + "?user_name=&user_id=" + UserRepo.getUserId() + 'prints'
    const WS_URL2 = baseWssUrl + "?user_name=&user_id=" + UserRepo.getUserId() + 'prints' + ' send'
    const { lastJsonMessage } = useWebSocket(
        WS_URL,
        {
            share: false,
            shouldReconnect: () => true,
        },
    )

    const { sendJsonMessage, readyState } = useWebSocket(
        WS_URL2,
        {
            share: false,
            shouldReconnect: () => true,
        },
    )
    // const doJob = async () => {
    //     processing()
    //     var res = await fetch('http://localhost:8080/read_fingerprint')
    //     var data = await res.json();
    //     if (data.code == 0) {
    //         if (task == Task.register) {
    //             dispatch(registerFinger({ employee: selectedUserId, prints: [...fingerState.fingers, data.data, data.data2] }))
    //         } else if (task == Task.verify) {
    //             res = await fetch('http://localhost:8080/verify_fingerprint', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Accept': 'application/json',
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     fingers: fingerState.fingers.filter((_: any, index: number) => index % 2 === 0),
    //                 })
    //             })
    //             var data = await res.json();
    //             if (data.code == 0) {
    //                 if (data.data == 'MATCH') {
    //                     completed()
    //                     dispatch(clearFingerState());
    //                 } else {
    //                     failed('Vân tay không khớp')
    //                     dispatch(clearFingerState());
    //                 }
    //             } else {
    //                 //show error
    //                 failed(data.data)
    //             }
    //         }
    //     } else {
    //         //show error
    //         failed(data.data)
    //     }
    // }

    useEffect(() => {
        if (lastJsonMessage) {
            const service = (lastJsonMessage as any).service
            if (service === "reg_prints") {
                const data = (lastJsonMessage as any).data
                warningWithConfirm({
                    title: "Xác nhận",
                    text: data.msg,
                    confirmButtonText: "Đồng ý",
                    confirm: () => {
                        if (readyState === ReadyState.OPEN) {
                            sendJsonMessage(
                                {
                                    "service": "reg_prints_rep",
                                    "action": "message",
                                    "data": { "sender_id": "register_finger", "sender_name": "", "msg": `OK` },
                                }
                            )
                        }
                    },
                    cancel: () => {
                        if (readyState === ReadyState.OPEN) {
                            sendJsonMessage(
                                {
                                    "service": "reg_prints_rep",
                                    "action": "message",
                                    "data": { "sender_id": "register_finger", "sender_name": "", "msg": `REJECT` },
                                }
                            )
                        }
                    }
                })
            }
        }
    }, [lastJsonMessage])

    return (<>
    </>)
}