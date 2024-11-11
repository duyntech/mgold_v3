type CardProps = {
  body: JSX.Element
  title: JSX.Element
  tool?: JSX.Element
  isPadding: boolean
  className?: string
}
export default function Card(props: CardProps) {
  return (
    <div className={`iq-card iq-card-block iq-card-stretch iq-card-height ${props.className}`}>
      <div className='iq-card-header d-flex justify-content-between'>
        <div className='iq-header-title'>
          <div className='card-title fs-5'><div className="fami-text-primary ">{props.title}</div></div>
        </div>
        {props.tool}
      </div>
      <div className={props.isPadding ? 'p-2 pt-0' : ''}>{props.body}</div>
    </div>
  )
}
