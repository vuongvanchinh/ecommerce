import React, { useRef, useEffect } from 'react'
import st from './Dropdown.module.css'
import {uuid} from '../../utils/uuid'


const Dropdown = (props) => {
    const toggle_el = useRef(null);
    const content_el = useRef(null);

    useEffect(() => {
        const check = (e) => {
            if (toggle_el && toggle_el.current && toggle_el.current.contains(e.target)) {
                // content_el.current.classList.toggle(st.active)
            } else if (toggle_el && toggle_el.current && !toggle_el.current.contains(e.target)
                && content_el && content_el.current && !content_el.current.contains(e.target)
            ) {
                content_el.current.classList.remove(st.active)
            }

        }

        document.addEventListener('mousedown', check)
        return () => {
            document.removeEventListener('mousedown', check)
        }
    }, [])

    const { renderBody, renderToggle, renderFooter, toggle_id} = props
    
    const onClick = () => {
       if(content_el && content_el.current ) {
            content_el.current.classList.remove(st.active)
       }
    }

    const openRemote = () => {
        if(content_el && content_el.current ) {
            content_el.current.classList.toggle(st.active)
           
        }
    }

    return (
        <div className={st.dropdown}>
            <button ref={ toggle_el} className={st.toggle}
                onClick={() => openRemote()}
                id={toggle_id}
            >
            {
                renderToggle? renderToggle():null
            }
            </button>
            <div ref={ content_el } className={st.content}>
                {
                    renderBody? (
                        <div className={st.body}>
                            {
                                renderBody()
                            }
                        </div>
                    ):null
                }
                {
                    renderFooter? (
                        <div className={st.footer} onClick={onClick()}>
                            {renderFooter()}
                        </div>
                    ):null    
                }
            </div>
        </div>

    )
}

Dropdown.defaultProps = {
    toggle_id: 'toggle'  + uuid(5)
}
export default Dropdown
