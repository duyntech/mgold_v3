type SidebarTogglerItf = {
  className: string
}
export default function SidebarToggler(props: SidebarTogglerItf) {
  return (
    <div className={props.className}>
      <div className='main-circle'>
        <i className='ri-more-fill'></i>
      </div>
      <div className='hover-circle'>
        <i className='ri-more-2-fill'></i>
      </div>
    </div>
  )
}
