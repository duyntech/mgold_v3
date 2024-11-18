import Assets from '../../assets'
import Carousel from 'react-bootstrap/Carousel'
import { Link } from 'react-router-dom'
type Props = {
  children: JSX.Element
}
export default function AuthenContainer({ children }: Props) {
  return (
    <section className='sign-in-page'>
      <div className='container sign-in-page-bg p-0'>
        <div className='row no-gutters'>
          <div className='col-md-7 text-center'>
            <div className='sign-in-detail text-white'>
              <Link className='d-flex justify-content-center align-items-center' to='/'>
                <img src={Assets.images.logoWhite} height={50} className='my-img-fluid' alt='' />
                {/* <span className='ps-2'>
                  <h1 className='text-white'>famiSOFT</h1>
                </span> */}
              </Link>
              <Carousel controls={false} className='d-flex justify-content-center'>
                <Carousel.Item className='p-4'>
                  <img src={Assets.images.loginOne} className='img-fluid mb-3' alt='First slide' />
                  <h5 className='mb-3 text-white'>Sản phẩm đa dạng và đẳng cấp</h5>
                  {/* <p>“Khách hàng của chúng tôi xứng đáng nhận được những gì tốt nhất”</p> */}
                </Carousel.Item>
                <Carousel.Item className='p-4'>
                  <img src={Assets.images.loginTwo} className='img-fluid mb-3' alt='Second slide' />
                  <h5 className='mb-3 text-white'>Mua vàng trả góp</h5>
                  {/* <p>Nhanh chóng tiện lợi</p> */}
                </Carousel.Item>
                <Carousel.Item className='p-4'>
                  <img src={Assets.images.loginThree} className='img-fluid mb-3' alt='Third slide' />
                  <h5 className='mb-3 text-white'>Giao hàng toàn quốc</h5>
                  {/* <p>Giao hàng hoả tốc từ 1-3 ngày.</p> */}
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
          <div className='col-md-5 position-relative'>{children}</div>
        </div>
      </div >
    </section >
  )
}
