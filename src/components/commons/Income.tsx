import { IncomeProps } from "../../types";
import { roundNumber } from "../../utils/util";
import MonneyFormat from "./MoneyFormat";

  export default function Income(props: IncomeProps) {
    return (
      <div className={props.className}>
        <h4 className='margin-0'>
        <div><i className={`${props.icon?props.icon:'ri-money-dollar-circle-line'} fami-text-primary icon-on-list`}></i>  <MonneyFormat value={props.rounded?roundNumber(props.value):props.value} positiveColor={"fami-text-primary"} unit={props.currency} decimal={false} /></div>
        </h4>
        <p className='text-muted'>{props.title}</p>
      </div>
    )
  }
  