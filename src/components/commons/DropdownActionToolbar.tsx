import { DropdownActionItemModel, DropdownActionModel } from '../../model'
import { actionIcons } from '../../utils/constants/const'
type DropdownActionToolbarProps = {
    toolId: string
    actions: DropdownActionItemModel[]
}
export default function DropdownActionToolbar(props: DropdownActionToolbarProps) {
  return (
    <div className='iq-card-header-toolbar d-flex align-items-center'>
      <div className='dropdown'>
        <span className='dropdown-toggle text-primary' id={props.toolId} data-bs-toggle='dropdown'>
          <i className='ri-more-fill'></i>
        </span>
        <div className='dropdown-menu dropdown-menu-right' aria-labelledby={props.toolId}>
          {props.actions.map((action, index) => {
            return (
              <div className='dropdown-item' key={`tool-${index}`} onClick={()=>action.onClick()}>
                <i className={`me-2 ${action.icon}`}></i>
                {action.name}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
type DropdownActionProps = {
  toolId: string
  actions: DropdownActionModel[]
}
export function DropdownAction(props: DropdownActionProps) {
return (
  <div className='iq-card-header-toolbar d-flex align-items-center'>
    <div className='dropdown'>
      <span className='dropdown-toggle text-primary' id={props.toolId} data-bs-toggle='dropdown'>
        <i className='ri-more-fill'></i>
      </span>
      <div className='dropdown-menu dropdown-menu-right' aria-labelledby={props.toolId}>
        {props.actions.map((item, index) => {
          return (
            <div className='dropdown-item' key={props.toolId+"-"+index} onClick={item.onClick}>
              <i className={`me-2 ${actionIcons[item.action]}`}></i>
              {item.name}
            </div>
          )
        })}
      </div>
    </div>
  </div>
)
}
