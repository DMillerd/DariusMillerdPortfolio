import { useState, useEffect } from 'react'

import './App.css'
import BucketList from './components/BucketList'


function App() {
  //to store the list of bucket item

  const [listItems, setListItems] = useState([
    { id: 1, description: "1 list", isComplete: false},
    {id: 2, description: "2 list", isComplete: false},
    {id: 3, }
  ]);

  //To store what the user has typed in to the input to add it to the list item when they click the button
  //const baseURL = `https://kug7zvjbk9.execute-api.us-east-1.amazonaws.com/api/bucket`;
    //my baseURL without usernames

  const baseURL = `https://h1ky76n6wb.execute-api.us-east-1.amazonaws.com/api/bucket`;
    //class baseURL with usernames

  //useEffect takes 2 args, first is callback function, second is dependancy array(optional)
    //1: no array - runs on every render
    //2: empty array - runs once when mounted
    //3: [someState] - runs when that variable changes/updates




//READ
  useEffect(() => {
    fetch(`${baseURL}?username=darius`) //remove username for my baseURL
    .then(response => response.json())
    .then(data => {
      //call the update state function and pass in data from backend
      setListItems(data)
    })
    .catch(error => console.error(error.message))
  }, [])  //empty array in order to only run once when mounted



  //To store what the user has typed in to the input to add it to the list items when they click the button
  const [newItem, setNewItem] = useState("");
  //This function fires when the user clicks the buttonm triggers onSubmit, add what user typed in bucketListItems
  const handleAddItem = (e) => {
    e.preventDefault()

    if(newItem.trim() !== ''){

//CREATE
      fetch(`${baseURL}?username=darius`, {   //remove username for my baseURL
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ description: newItem})   //stringify in order to send correctly to our server
        }
      )
      .then(response => response.json())
      .then(data => {
        console.log(data)
        //Take what is previously in state, then adds in new item and update the state
        setListItems([...listItems, data])
          //setListItems resets the array of objects to include the newItem
        setNewItem('')  //clears input


      })
      .catch(error => console.error(error.message))



    }
  }
  
//delete item
const handleDelete = (id) => {
//DELETE
  fetch(`${baseURL}/${id}`, {
    method: "DELETE"
  })
  .then(response => response.json())
  .then(data => {
    console.log(data, "DELETE")

    //filters out the item that was clicked on if the id matches the id of clicked id
    setListItems(listItems.filter(item => item.id !== id))


  })
  .catch(error => console.error(error.message))




}

//toggle complete

const handleToggleComplete = (id) => {

//PUT
  fetch(`${baseURL}/${id}`, {
    method: "PUT"
  })
  .then(response => response.json())
  .then(data => {
    //console.log(data)
    setListItems(listItems.map(item => item.id === id ? {...item, isComplete: !item.isComplete} : item))      //works on one line due, would need return for multiple lines
    
  })
  .catch(error => console.error(error.message))



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
