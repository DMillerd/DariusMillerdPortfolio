import React from 'react'
import { FaTrash} from 'react-icons/fa'
import { useState } from 'react'

const Item = ({id, description = 'Retire', complete = false, onDelete, onToggleComplete}) => {         //functional components for default
    return (
        <li>
            <div className='list-item'>
                <span className='item-title'>{description}</span>
                <span
                className='item-status' 
                onClick={() => onToggleComplete(id)}
                style={{
                    cursor: 'pointer',
                    color: complete ? "green": "red"
                }}
                >
                    { complete ? "Completed" : "Not Completed"}
                </span>
                <button className='delete-button' onClick={() => onDelete(id)}><FaTrash /></button>
            </div>
        </li>
    )
}


//class components for default
// Item.defaultProps ={
//     description: "Retire"
// }

export default Item



//npm i react-icons