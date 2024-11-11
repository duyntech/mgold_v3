import { useState } from "react";
import Assets from "../../assets";
import { Image as PrimeImage } from 'primereact/image';
import { getImageNetwork } from "../../utils/util";
type NetworkImageProps={
    url:string
}
export default function NetworkImage(props:NetworkImageProps){
    const [loadedImage, setLoadedImage] = useState(false)
    const imageOnLoad = (event:any) => {
        if (event.currentTarget.className !== "error") {
          //event.currentTarget.className = "success";
          setLoadedImage(true)
        }
      };
      const imageOnError = (event:any) => {
        event.currentTarget.src = Assets.images.loadingImage
        event.currentTarget.className = "error";
      };
    //console.log(props.url)
    return <>
        <PrimeImage preview onLoad={imageOnLoad} onError={imageOnError} loading="lazy" height="250" src={getImageNetwork(props.url)} alt="" style={{ cursor: "pointer",verticalAlign:"unset",objectFit: "contain" }} />
        {!loadedImage&&<PrimeImage style={{objectFit: "contain",verticalAlign:"unset"}} src={Assets.images.loadingImage} alt=""height={'250'}/>}
    </>
}