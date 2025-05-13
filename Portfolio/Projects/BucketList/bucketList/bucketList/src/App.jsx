import { useState } from 'react'

import './App.css'
import BucketList from './components/BucketList'


function App() {
  //to store the list of bucket item

  const [listItems, setListItems] = useState([
    { id: 1, description: "1 list", complete: false},
    {id: 2, description: "2 list", complete: false},
    {id: 3, }
  ]);

  //To store what the user has typed in to the input to add it to the list item when they click the button
  const [newItem, setNewItem] = useState("");


  //This function fires when the user clicks the buttonm triggers onSubmit, add what user typed in bucketListItems
  const handleAddItem = (e) => {
    e.preventDefault()

    if(newItem.trim() !== ''){
      setListItems([...listItems, { id: Date.now(), description: newItem, complete: false}])
      setNewItem('')
    }


  }
  
//delete item
const handleDelete = (id) => {
  //filters out the item that was clicked on if the id matches the id of clicked id
  setListItems(listItems.filter(item => item.id !== id))
}

//toggle complete

const handleToggleComplete = (id) => {
  setListItems(listItems.map(item => item.id === id ? {...item, complete: !item.complete} : item))      //works on one line due, would need return for multiple lines

}

  return (
    <>
      <div className='App'>
        <h1>Bucketlist App</h1>
        <form onSubmit={(e) => handleAddItem(e)}>
          <input 
            type="text" 
            className='item-input' 
            autoComplete='off' 
            placeholder='Add a new goal...' 
            name='newItem' 
            onChange={(e) => setNewItem(e.target.value)} 
            value={newItem}/>
          <input type="submit" className='save-button' value='Add Item' />
        </form>
        <BucketList list={listItems} onDelete={handleDelete} onToggleComplete={handleToggleComplete}/>
      </div>
    </>

  )
}

export default App
