import { useState, useEffect } from 'react'
import './App.css'
import BucketList from './components/BucketList';

function App() {
  //To store the list of bucketItem
  const [listItems, setListItems] = useState([
    { id: 1, description: "Get good at electric guitar", isComplete: false },
    { id: 2, description: "Get a corgi", isComplete: false },
    { id: 3, }
  ]);

  //To store what the user has typed in to the input to add it to the list items when they click the button.
  const [newItem, setNewItem] = useState("")



  const baseURL = `http://localhost:3000/api/bucket`;

  //Use Effect takes two arguments, first is a callback function, second is a dependency array
  // 1. No array - runs on every render
  // 2. Empty array - runs once when mounted 
  // 3. [someState] - runs when that variable changes/updates

  //READ
  useEffect(() => {
    //write some code in here
    fetch(`${baseURL}`)
      .then(response => response.json())
      .then(data => {
        //Now that I have data what do I do with it????
        // Call the update state function and pass in our data coming from the backend
        setListItems(data)
      })
      .catch(error => console.error(error.mesage))
  }, [])


  // This function fires when the user clicks the button it triggers the onSubmit to the form from there we will add what the user typed in to our bucketListItems
  const handleAddItem = (e) => {
    e.preventDefault() //Prevent page refresh - so we don't lose the state of what the user typed in. 

    if (newItem.trim() !== "") {
      //CREATE 
      fetch(`${baseURL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ description: newItem })
      })
        .then(response => response.json())
        .then(data => {
          // console.log(data)
          //Take whats previously in state, and then add in our new item and update the state
          setListItems([...listItems, data]);
          setNewItem(""); //To clear the input after we've added the item the user typed out - to make it empty so they can type in a new goal
        })
        .catch(error => console.error(error.message))

    }

  }

  //Delete an item from the list
  const handleDelete = (id) => {
    fetch(`${baseURL}/${id}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(data => {
        console.log(data, "DELETE")
        //Filters out the item that was clicked on. If the id matches the id of the one clicked on
        setListItems(listItems.filter(item => item._id !== id))
      })
      .catch(error => console.error(error.message))
  }

  //Function to toggle an item complete from false to true vice versa
  const handleToggleComplete = (id) => {
    fetch(`${baseURL}/${id}`, {
      method: "PUT"
    })
      .then(response => response.json())
      .then(data => {
        //do something with it.
        setListItems(listItems.map(item => item._id === id ? { ...item, isComplete: !item.isComplete } : item))
      })
      .catch(error => console.error(error.message))
  }

  return (
    <>
      <div className="App">
        <h1>Bucket List App</h1>
        <form onSubmit={(e) => handleAddItem(e)}>
          <input
            type="text"
            className="item-input"
            autoComplete="off"
            placeholder="Add a new goal..."
            name="newItem"
            onChange={(e) => setNewItem(e.target.value)}
            value={newItem}
          />
          <input
            type="submit"
            value="Add Item"
            className="save-button"
          />
        </form>
        <BucketList list={listItems} onDelete={handleDelete} onToggleComplete={handleToggleComplete} />
      </div>
    </>
  )
}

export default App
