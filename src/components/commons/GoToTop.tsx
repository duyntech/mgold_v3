import { useEffect, useState } from "react"

export default function GoToTop(){
    const [ showGoTop, setShowGoTop ] = useState( false )
    const handleVisibleButton = () => {
        setShowGoTop( window.scrollY > 50 )
    }
    const handleScrollUp = () => {
        window.scrollTo( { left: 0, top: 0, behavior: 'smooth' } )
    }
    useEffect( () => {
        window.addEventListener( 'scroll', handleVisibleButton )
    }, [] )
    return (
        <div style={{display:showGoTop?"block": "none"}} className='go-top-show' onClick={ handleScrollUp }>
            <h2 className="mb-0 pt-1"><i className="ri-arrow-up-s-line" ></i></h2>
        </div>
    )
}