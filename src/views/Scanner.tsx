//import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import { useState } from "react";
export default function Scanner(props:{scan:boolean}){
    //const [cameraId, setCameraId] = useState('')
    const [_scanning, setScanning] = useState(props.scan)
    
    // Html5Qrcode.getCameras().then(devices => {
    //     if (devices && devices.length) {
    //         console.log(devices)
    //         setCameraId(devices[0].id);
    //     }
    // }).catch(err => {
    //     // handle err
    // });
    // useEffect(()=>{
    //     const html5Qrcode=new Html5Qrcode("html5qr-code-full-region")
    //     if(cameraId!==''){
    //         html5Qrcode.start(
    //             cameraId,     // retreived in the previous step.
    //             {
    //               fps: 10,    // sets the framerate to 10 frame per second
    //               qrbox: 250  // sets only 250 X 250 region of viewfinder to
    //                           // scannable, rest shaded.
    //             },
    //             qrCodeMessage => {
    //               // do something when code is read. For example:
    //               console.log(`QR Code detected: ${qrCodeMessage}`);
    //             },
    //             () => {
                  
    //             })
    //           .catch(err => {
    //             // Start failed, handle it. For example,
    //             console.log(`Unable to start scanning, error: ${err}`);
    //           });
    //     }
    //     else{
    //         try {
    //             html5Qrcode.stop()
    //         } catch (error) {
                
    //         }
    //     }
    // },[scanning,cameraId])
    return (
        <><button type='button' className='btn btn-outline-danger me-2' onClick={()=>setScanning(false)}><i className='ri-close-line'></i> Stop</button></>
    )
}