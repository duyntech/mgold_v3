import { Link } from 'react-router-dom'
import { LinkWithIconModel } from '../../model'
type DropdownToolbarProps = {
  toolId: string
  actions: LinkWithIconModel[]
}
export default function DropdownToolbar(props: DropdownToolbarProps) {
  return (
    <div className='iq-card-header-toolbar d-flex align-items-center'>
      <div className='dropdown'>
        <span className='dropdown-toggle text-primary' id={props.toolId} data-bs-toggle='dropdown'>
          <i className='ri-more-fill'></i>
        </span>
        <div className='dropdown-menu dropdown-menu-right' aria-labelledby={props.toolId}>
          {props.actions.map((action, index) => {
            return (
              <Link to={action.url} className='dropdown-item' key={`tool-${index}`}>
                <i className={`me-2 ${action.icon}`}></i>
                {action.name}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
