import Assets from '../../assets';
export default function PageLoading() {
  return (
    <div className='position-relative' style={{width:"100vw",height:"100vh"}}>
      <img src={Assets.images.logoLoading} className='position-absolute top-50 start-50 translate-middle' style={{width:288}}  alt="Loading..."/>
    </div>
  )
}
