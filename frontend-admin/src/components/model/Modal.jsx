import React, {useRef, useEffect} from 'react'
import './modal.css'

const Model = (props) => {
    let {variant} = props;
    const {renderHeader, renderFooter, onHide, show } = props;
    const modal = useRef(null)
    const modal_wraper = useRef(null)

    useEffect(() => {
        const clickOutSide = (e) => {
            if(modal.current && modal_wraper.current) {
                if(!modal.current.contains(e.target)) {
                    onHide()
                }
            }
        }
        document.addEventListener('mousedown', clickOutSide)
        
        return () => {
            document.removeEventListener('mousedown', clickOutSide)
        }
    }, [])

    useEffect(() => {
        if(show) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow ="auto"
        }

    }, [show])

    if(!show) {
        return null;
    }


    return (
        <div className="modal_wraper" ref={modal_wraper}>
            <div className={`modal modal_${variant}`} ref={modal}>
                {
                    renderHeader ? (
                        <div className="modal_header">
                            { renderHeader()}
                        </div>
                    ):null
                }
                <div className="modal_body">
                    { props.children }
                </div>
                {
                    renderFooter? (
                        <div className="modal_footer">
                            { renderFooter() }
                        </div>
                    ):null
                }
            </div>
        </div>
    )
}

Model.defaultProps = {
    show:false,
    onHide: () => {},
    variant: "medium"
}

export default Model
