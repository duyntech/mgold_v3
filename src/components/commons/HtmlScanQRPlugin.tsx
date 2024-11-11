// //import { Html5QrcodeScanner } from "html5-qrcode";
// import { useEffect } from 'react';
const qrcodeRegionId = "html5qr-code-full-region";
export default function Html5QrcodePlugin(_props:any){
    // const createConfig=(props:any)=> {
    //     var config:any = {};
    //     if (props.fps) {
    //     config.fps = props.fps;
    //     }
    //     if (props.qrbox) {
    //     config.qrbox = props.qrbox;
    //     }
    //     if (props.aspectRatio) {
    //     config.aspectRatio = props.aspectRatio;
    //     }
    //     if (props.disableFlip !== undefined) {
    //     config.disableFlip = props.disableFlip;
    //     }
    //     return config;
    // }
    // useEffect(()=>{
        
    //     var config = createConfig(props);
    //     var verbose = props.verbose === true;
    //     let html5QrcodeScanner = new Html5QrcodeScanner(
    //         qrcodeRegionId, config, verbose);
    //     html5QrcodeScanner.render(
    //         props.qrCodeSuccessCallback,
    //         props.qrCodeErrorCallback);
    // },[])
    return(
        <div style={{width:"100%"}}>

            <div className="col-md-12" id={qrcodeRegionId} />
           
        </div>
    )
};