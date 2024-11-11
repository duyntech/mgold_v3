//import CountUp from 'react-countup';
import { CounterProps } from "../../types";

  export default function Counter(props: CounterProps) {
    return (
      <div className='iq-card iq-card-block iq-card-stretch iq-card-height'>
        <div className={`iq-card-body rpm-rounded iq-${props.backgroundColor}`}>
          <div className='d-flex align-items-center justify-content-between'>
            <div className={`rounded-circle iq-card-icon ${props.backgroundColor}`}>
              <i className={props.icon}></i>
            </div>
            {props.body}
          </div>
        </div>
      </div>
    )
  }
  