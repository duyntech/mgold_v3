type NavbarTogglerTarget = {
  menuId: string
}
export default function NavbarToggler(target: NavbarTogglerTarget) {
  return (
    <button
      className='navbar-toggler'
      type='button'
      data-bs-toggle='collapse'
      data-bs-target={`#${target.menuId}`}
      aria-controls={target.menuId}
      aria-expanded='false'
      aria-label='Toggle navigation'
    >
      <i className='ri-menu-3-line'></i>
    </button>
  )
}
