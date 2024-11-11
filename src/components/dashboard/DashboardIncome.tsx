import { useAppSelector } from "../../app/hooks";
import { dateDetail } from "../../utils/util";
import Income from "../commons/Income";

export default function DashboardIncome() {
  const reportState=useAppSelector(state=>state.report)
  const dateInfos=dateDetail(new Date())
  return (
    <div className='iq-card-body pb-0 mt-3'>
      <div className='row text-center'>
        <Income
          className={'col-sm-3 col-6'}
          value={reportState.revenues?reportState.revenues.year.date??0:0}
          currency={'đ'}
          title={<>Doanh thu hôm nay</>}
        />
        <Income
          className={'col-sm-3 col-6'}
          value={reportState.revenues?reportState.revenues.year.week??0:0}
          currency={'đ'}
          title={<>Doanh thu tuần <b>{dateInfos.week}</b></>}
        />
        <Income
          className={'col-sm-3 col-6'}
          value={reportState.revenues?reportState.revenues.year.month??0:0}
          currency={'đ'}
          title={<>Doanh thu tháng <b>{(dateInfos.month+1)}</b></>}
        />
        <Income
          className={'col-sm-3 col-6'}
          value={reportState.revenues?reportState.revenues.year.year??0:0}
          currency={'đ'}
          title={<>Doanh thu năm <b>{dateInfos.year}</b></>}
        />
      </div>
    </div>
  )
}
