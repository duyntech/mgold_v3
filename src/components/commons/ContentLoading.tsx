import ContentLoader from "react-content-loader"
import ItemCard from "./ItemCard"
import { ItemCardHolderProps, LoadingProps, TreeNodeHolderProps } from "../../types"
import { Skeleton } from 'primereact/skeleton';
export const GoldPriceLoading=()=>{
    return (
        <ItemCard uniqueKey={""} 
            active={false} 
            body={
                <>
                <div className="row">
                    <div className="col-sm-4 p-3"><Skeleton width="100%" height="2rem"></Skeleton></div>
                    <div className="col-sm-4 p-3"><Skeleton width="100%" height="2rem"></Skeleton></div>
                    <div className="col-sm-4 p-3"><Skeleton width="100%" height="2rem"></Skeleton></div>
                </div>
                <div className="row">
                    <div className="col-sm-4 p-3"><Skeleton width="100%" height="1.5rem"></Skeleton></div>
                    <div className="col-sm-4 p-3"><Skeleton width="100%" height="1.5rem"></Skeleton></div>
                    <div className="col-sm-4 p-3"><Skeleton width="100%" height="1.5rem"></Skeleton></div>
                </div>
                <div className="row">
                    <div className="col-sm-4 p-3"><Skeleton width="100%" height="1.5rem"></Skeleton></div>
                    <div className="col-sm-4 p-3"><Skeleton width="100%" height="1.5rem"></Skeleton></div>
                    <div className="col-sm-4 p-3"><Skeleton width="100%" height="1.5rem"></Skeleton></div>
                </div>
                <div className="row">
                    <div className="col-sm-4 p-3"><Skeleton width="100%" height="1.5rem"></Skeleton></div>
                    <div className="col-sm-4 p-3"><Skeleton width="100%" height="1.5rem"></Skeleton></div>
                    <div className="col-sm-4 p-3"><Skeleton width="100%" height="1.5rem"></Skeleton></div>
                </div>
                </>
                } 
            background={"bg-white"} 
            onClick={()=>{}} 
            onDoubleClick={()=>{}} 
            contextMenu={[]}/>
    )
}
export const InputLoading=()=>{
    return (
        <Skeleton width="100%" height="2rem" className="my-1"></Skeleton>
    )
}
export const ImageListHolder=()=>{
    const HolderItems=()=>{
        let items=[]
        for (let index = 0; index < 12; index++) {
            items.push(
                <div className="col-sm-3 col-md-6 col-lg-3 p-2" key={"image-holder-item"+index}>
                <div className="p-4 border-1 surface-border surface-card border-round position-relative">
                    <div className="flex flex-column align-items-center gap-3 py-1">
                        <Skeleton width="85%" height="10rem" className="mb-3 ms-3 me-3"></Skeleton>
                        {/* <Skeleton width="7.5rem" height="3" className="mb-3"></Skeleton> */}
                        
                    </div>
                    <Skeleton size="1.5rem" className="position-absolute top-0 end-0 m-1"></Skeleton>
                    
                </div>
            </div>
            ) 
            
        }
        return <div className="row">{items.map((item,_index)=>{
            return item
        })}</div>
    }
    return (
        <HolderItems/>
    )
}
export const TreeNodeHolder=(props:TreeNodeHolderProps)=>{
    const HolderItems=()=>{
        let items=[]
        for (let index = 0; index < props.items; index++) {
            items.push(
            <div className="py-2 px-3" key={"tree-holdeer-item-"+index}>
                <div className="d-flex">
                    <Skeleton size="1.5rem" className="mb-3 me-3"></Skeleton>
                    <Skeleton width="7.5rem" height="1.5" className="mb-3"></Skeleton>
                </div>
                <div className="d-flex ms-3">
                    <div className="ms-2"></div>
                    <Skeleton size="1.5rem" className="mb-3 ms-3 me-3"></Skeleton>
                    <Skeleton width="11rem" height="1.5" className="mb-3"></Skeleton>
                </div>
                <div className="d-flex ms-3">
                    <div className="ms-2"></div>
                    <Skeleton size="1.5rem" className="mb-3 ms-3 me-3"></Skeleton>
                    <Skeleton width="11rem" height="1.5" className="mb-3"></Skeleton>
                </div>
            </div>) 
            
        }
        return <>{items.map((item,_index)=>{
            return item
        })}</>
    }
    return (
        <HolderItems/>
    )
}
export const ItemCardHolder=(props:ItemCardHolderProps)=>{
    const HolderItems=()=>{
        let items=[]
        for (let index = 0; index < props.items; index++) {
            items.push(
            <div className="pt-2" key={props.uniqueKey+"-"+index}>
            <ItemCard 
                        uniqueKey={""}
                        active={false}
                        body={<>
                            <Skeleton width="7.5rem" className="mb-2"></Skeleton>
                            {props.image ?
                                <div className="row">
                                    <div className="col-sm-3">
                                        <div className="d-flex">
                                            <Skeleton size="3rem" className="mb-2"></Skeleton>
                                            <div className="ms-2">
                                                <Skeleton width="7.5rem" className="mb-2"></Skeleton>
                                                <Skeleton width="7.5rem" className="mb-2"></Skeleton>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        {props.contentRows > 1 ?
                                            <>
                                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                            </> :
                                            <Skeleton width="100%" className="mb-2"></Skeleton>}

                                    </div>
                                    <div className="col-sm-3">
                                        {props.contentRows > 1 ?
                                            <>
                                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                            </> :
                                            <Skeleton width="100%" className="mb-2"></Skeleton>}
                                    </div>
                                    <div className="col-sm-3">
                                        {props.contentRows > 1 ?
                                            <>
                                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                            </> :
                                            <Skeleton width="100%" className="mb-2"></Skeleton>}
                                    </div>
                                </div>
                                : <div className="row">
                                    <div className="col-sm-3">
                                        {props.contentRows > 1 ?
                                            <>
                                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                            </> :
                                            <Skeleton width="100%" className="mb-2"></Skeleton>}
                                    </div>
                                    <div className="col-sm-3">
                                        {props.contentRows > 1 ?
                                            <>
                                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                            </> :
                                            <Skeleton width="100%" className="mb-2"></Skeleton>}
                                    </div>
                                    <div className="col-sm-3">
                                        {props.contentRows > 1 ?
                                            <>
                                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                            </> :
                                            <Skeleton width="100%" className="mb-2"></Skeleton>}
                                    </div>
                                    <div className="col-sm-3">
                                        {props.contentRows > 1 ?
                                            <>
                                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                            </> :
                                            <Skeleton width="100%" className="mb-2"></Skeleton>}
                                    </div>
                                </div>}

                        </>}
                        background={""}
                        onClick={() => { } } onDoubleClick={()=>{}} contextMenu={[]}            />
            </div>) 
            
        }
        return <>{items.map((item,_index)=>{
            return item
        })}</>
    }
    return (
        <HolderItems/>
    )
}
export const TableHolder=(props:LoadingProps)=> {
    return (
    <ContentLoader 
        speed={3}
        width={"100%"}
        height={props.height}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
    >
        <rect x="27" y="139" rx="4" ry="4" width="20" height="20" />
        <rect x="67" y="140" rx="10" ry="10" width="85" height="19" />
        <rect x="188" y="141" rx="10" ry="10" width="169" height="19" />
        <rect x="402" y="140" rx="10" ry="10" width="85" height="19" />
        <rect x="523" y="141" rx="10" ry="10" width="169" height="19" />
        <rect x="731" y="139" rx="10" ry="10" width="85" height="19" />
        <rect x="852" y="138" rx="10" ry="10" width="85" height="19" />
        <rect x="1424" y="137" rx="10" ry="10" width="68" height="19" />
        <rect x="26" y="196" rx="4" ry="4" width="20" height="20" />
        <rect x="66" y="197" rx="10" ry="10" width="85" height="19" />
        <rect x="187" y="198" rx="10" ry="10" width="169" height="19" />
        <rect x="401" y="197" rx="10" ry="10" width="85" height="19" />
        <rect x="522" y="198" rx="10" ry="10" width="169" height="19" />
        <rect x="730" y="196" rx="10" ry="10" width="85" height="19" />
        <rect x="851" y="195" rx="10" ry="10" width="85" height="19" />
        <circle cx="1456" cy="203" r="12" />
        <rect x="26" y="258" rx="4" ry="4" width="20" height="20" />
        <rect x="66" y="259" rx="10" ry="10" width="85" height="19" />
        <rect x="187" y="260" rx="10" ry="10" width="169" height="19" />
        <rect x="401" y="259" rx="10" ry="10" width="85" height="19" />
        <rect x="522" y="260" rx="10" ry="10" width="169" height="19" />
        <rect x="730" y="258" rx="10" ry="10" width="85" height="19" />
        <rect x="851" y="257" rx="10" ry="10" width="85" height="19" />
        <circle cx="1456" cy="265" r="12" />
        <rect x="26" y="316" rx="4" ry="4" width="20" height="20" />
        <rect x="66" y="317" rx="10" ry="10" width="85" height="19" />
        <rect x="187" y="318" rx="10" ry="10" width="169" height="19" />
        <rect x="401" y="317" rx="10" ry="10" width="85" height="19" />
        <rect x="522" y="318" rx="10" ry="10" width="169" height="19" />
        <rect x="730" y="316" rx="10" ry="10" width="85" height="19" />
        <rect x="851" y="315" rx="10" ry="10" width="85" height="19" />
        <circle cx="1456" cy="323" r="12" />
        <rect x="26" y="379" rx="4" ry="4" width="20" height="20" />
        <rect x="66" y="380" rx="10" ry="10" width="85" height="19" />
        <rect x="187" y="381" rx="10" ry="10" width="169" height="19" />
        <rect x="401" y="380" rx="10" ry="10" width="85" height="19" />
        <rect x="522" y="381" rx="10" ry="10" width="169" height="19" />
        <rect x="730" y="379" rx="10" ry="10" width="85" height="19" />
        <rect x="851" y="378" rx="10" ry="10" width="85" height="19" />
        <circle cx="1456" cy="386" r="12" />
        <rect x="978" y="138" rx="10" ry="10" width="169" height="19" />
        <rect x="977" y="195" rx="10" ry="10" width="169" height="19" />
        <rect x="977" y="257" rx="10" ry="10" width="169" height="19" />
        <rect x="977" y="315" rx="10" ry="10" width="169" height="19" />
        <rect x="977" y="378" rx="10" ry="10" width="169" height="19" />
        <rect x="1183" y="139" rx="10" ry="10" width="85" height="19" />
        <rect x="1182" y="196" rx="10" ry="10" width="85" height="19" />
        <rect x="1182" y="258" rx="10" ry="10" width="85" height="19" />
        <rect x="1182" y="316" rx="10" ry="10" width="85" height="19" />
        <rect x="1182" y="379" rx="10" ry="10" width="85" height="19" />
        <rect x="1305" y="137" rx="10" ry="10" width="85" height="19" />
        <rect x="1304" y="194" rx="10" ry="10" width="85" height="19" />
        <rect x="1304" y="256" rx="10" ry="10" width="85" height="19" />
        <rect x="1304" y="314" rx="10" ry="10" width="85" height="19" />
        <rect x="1304" y="377" rx="10" ry="10" width="85" height="19" />
        <circle cx="37" cy="96" r="11" />
        <rect x="26" y="23" rx="5" ry="5" width="153" height="30" />
        <circle cx="1316" cy="88" r="11" />
        <rect x="1337" y="94" rx="0" ry="0" width="134" height="3" />
        <circle cx="77" cy="96" r="11" />
    </ContentLoader>
    )
}

export const ChecklistHolder=(props:LoadingProps)=> {
    return (
    <ContentLoader 
        speed={3}
        width={"100%"}
        height={props.height}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
    >
        <rect x="3" y="5" rx="4" ry="4" width="20" height="20" />
        <rect x="35" y="5" rx="4" ry="4" width="200" height="20" />
        <rect x="35" y="40" rx="4" ry="4" width="20" height="20" />
        <rect x="70" y="40" rx="4" ry="4" width="200" height="20" />

        <rect x="3" y="75" rx="4" ry="4" width="20" height="20" />
        <rect x="35" y="75" rx="4" ry="4" width="200" height="20" />
        <rect x="35" y="110" rx="4" ry="4" width="20" height="20" />
        <rect x="70" y="110" rx="4" ry="4" width="200" height="20" />

        <rect x="3" y="145" rx="4" ry="4" width="20" height="20" />
        <rect x="35" y="145" rx="4" ry="4" width="200" height="20" />
        <rect x="35" y="180" rx="4" ry="4" width="20" height="20" />
        <rect x="70" y="180" rx="4" ry="4" width="200" height="20" />

        <rect x="3" y="215" rx="4" ry="4" width="20" height="20" />
        <rect x="35" y="215" rx="4" ry="4" width="200" height="20" />
        <rect x="35" y="250" rx="4" ry="4" width="20" height="20" />
        <rect x="70" y="250" rx="4" ry="4" width="200" height="20" />
        
        <rect x="3" y="285" rx="4" ry="4" width="20" height="20" />
        <rect x="35" y="285" rx="4" ry="4" width="200" height="20" />
        <rect x="35" y="320" rx="4" ry="4" width="20" height="20" />
        <rect x="70" y="320" rx="4" ry="4" width="200" height="20" />

        <rect x="3" y="355" rx="4" ry="4" width="20" height="20" />
        <rect x="35" y="355" rx="4" ry="4" width="200" height="20" />
        <rect x="35" y="390" rx="4" ry="4" width="20" height="20" />
        <rect x="70" y="390" rx="4" ry="4" width="200" height="20" />

        <rect x="3" y="425" rx="4" ry="4" width="20" height="20" />
        <rect x="35" y="425" rx="4" ry="4" width="200" height="20" />
        <rect x="35" y="460" rx="4" ry="4" width="20" height="20" />
        <rect x="70" y="460" rx="4" ry="4" width="200" height="20" />
    </ContentLoader>
    )
}
export const ProfileCardHolder=()=> {
    return (
    <ContentLoader 
        speed={3}
        width={"100%"}
        height={420}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
    >
        <circle cx="50%" cy="55" r="40" />
        <rect x="20%" y="105" rx="4" ry="4" width="60%" height="24" />
        <rect x="30%" y="137" rx="4" ry="4" width="40%" height="20" />
        <rect x="20%" y="165" rx="4" ry="4" width="60%" height="16" />

        <rect x="7%" y="200" rx="4" ry="4" width="84%" height="20" />
        <rect x="7%" y="230" rx="4" ry="4" width="84%" height="20" />
        <rect x="7%" y="260" rx="4" ry="4" width="84%" height="20" />
        <rect x="7%" y="290" rx="4" ry="4" width="84%" height="20" />

        <rect x="23%" y="330" rx="5" ry="5" width="30" height="30" />
        <rect x="37%" y="330" rx="5" ry="5" width="30" height="30" />
        <rect x="51%" y="330" rx="5" ry="5" width="30" height="30" />
        <rect x="65%" y="330" rx="5" ry="5" width="30" height="30" />
        <rect x="30%" y="370" rx="4" ry="4" width="40%" height="35" />
        
    </ContentLoader>
    )
}