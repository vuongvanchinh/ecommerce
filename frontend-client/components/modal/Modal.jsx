import React, {useEffect, useRef} from 'react'
import st from './Modal.module.css'

const Modal = (props) => {

    let {show, variant, renderHeader, renderBody, renderFooter, onHide} = props;
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
            document.body.style.overflow ="auto"
        }
    }, [])

    useEffect(() => {
        if(show) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow ="auto"
        }
        console.log("show ", show)

    }, [show])

    if(!show) {
        return '';
    }
    return (
        <div className={st.modal_wraper} ref={modal_wraper}>
            <div className={`${st.modal} ${st[variant]}`} ref={modal}>
                
                { renderHeader ? (
                    <div className={st.header}>
                        {renderHeader()}
                    </div>
                ) : null}
                <div className={st.body}>
                    {renderBody? renderBody():null}
                </div>
               {
                   renderFooter? (
                    <div className={st.footer}>
                        { renderFooter()}
                    </div>
                   ):null
               }
            </div>
        </div>
    )
}
Modal.defaultProps = {
    onHide: () => {}
}
export default Modal
