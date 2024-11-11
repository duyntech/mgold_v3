import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Counter from "../commons/Counter";
import { clearStatisticStatus, retailStatistics } from "../../slices/report/report.slice";
import { failed } from "../../utils/alert";
import CountUp from 'react-countup';

export default function DashboardCounter() {
    const dispatch = useAppDispatch()
    const reportState=useAppSelector(state=>state.report)
    useEffect(()=>{
      if (reportState.statisticStatus) {
       switch (reportState.statisticStatus.status) {
        case "failed":
          failed(reportState.statisticStatus.error)
          dispatch(clearStatisticStatus())
          break;
       }
      }
    },[reportState.statisticStatus])
    useEffect(()=>{
      dispatch(retailStatistics())
    },[])
    return (
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-md-6 col-lg-3'>
            <Counter
              icon={'ri-user-fill'}
              body={<div className='text-end'>
                <h2 className='mb-0'>
                  <span className='counter'><CountUp end={reportState.statistics.customer} duration={3}/></span>
                </h2>
                <h5 className=''>Khách hàng</h5>
              </div>}
              backgroundColor={'bg-primary'}
            />
          </div>
          <div className='col-md-6 col-lg-3'>
            <Counter
              icon={'ri-archive-drawer-line'}
              body={<div className='text-end'>
                <h2 className='mb-0'>
                  <span className='counter'><CountUp end={reportState.statistics.product} duration={3}/></span>
                </h2>
                <h5 className=''>Hàng tồn kho</h5>
              </div>}
              backgroundColor={'bg-warning'}
            />
          </div>
          <div className='col-md-6 col-lg-3'>
            <Counter
              icon={'ri-global-fill'}
              body={<div className='text-end'>
                <h2 className='mb-0'>
                  <span className='counter'><CountUp end={reportState.statistics.online} duration={3}/></span>
                </h2>
                <h5 className=''>Hàng online</h5>
              </div>}
              backgroundColor={'bg-danger'}
            />
          </div>
          <div className='col-md-6 col-lg-3'>
            <Counter
              icon={'ri-money-dollar-circle-line'}
              body={<div className='text-end'>
                <h2 className='mb-0'>
                  <span className='counter'><CountUp end={reportState.statistics.retail+reportState.statistics.web} duration={3}/></span>
                </h2>
                <h5 className=''>Đơn hàng</h5>
              </div>}
              backgroundColor={'bg-info'}
            />
          </div>
        </div>
      </div>
    )
  }