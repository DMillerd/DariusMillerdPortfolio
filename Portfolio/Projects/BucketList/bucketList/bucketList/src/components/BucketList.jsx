import React from 'react'
import Item from './Item'
import { useState } from 'react'

const BucketList = ({list, onDelete, onToggleComplete}) => {

if(!list || list.length == 0) {
    return <p>No Bucket List Items Yet!</p>
}


const renderListItems = list.map(item => {
    return <Item key={item.id} {...item}  onDelete={onDelete} onToggleComplete={onToggleComplete}/>
})


    return (
        <div className='item-content'>
            <ol>
                {renderListItems}
            </ol>
        </div>
    )
}

export default BucketList