import { useState } from 'react'
import './App.css'

function App() {

  const [searchTerm, setSearchTerm] = useState('')
  //create a state variable called "movies"
  //providing a method "setMovies" that is used to update the movies variable
  const [movies, setMovies] = useState([
    {
      id: 0,
      poster_path: "https://image.tmdb.org/t/p/w185/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
      title: "Avengers: Infinity War",
      overview: "The Avengers fight Thanos."
    },
    {
      id: 1,
      poster_path: "https://image.tmdb.org/t/p/w185/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
      title: "The Avengers",
      overview: "The Avengers fight Loki."
    }
  ])

  const accessToken = import.meta.env.VITE_API_TOKEN



//array.map: loop over array and converting
//            each object in the array into some JSX collection, creating a new array
  const moviesJSXCollection = movies.map(movie => {
    return (
      <div key={movie.id} style={{marginBottom: "5rem"}}>
      <img src={'https://image.tmdb.org/t/p/w200/'+movie.poster_path} alt="poster" />
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
      </div>
    )
  })
    //let searchTerm = 'nemo';
    const endpoint = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&include_adult=false&language=en-US&page=1`
  //create a function that handles the search
  const handleSearch = () => {
    //call the api
    fetch(endpoint, 
      {method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: accessToken
        }

      })
    .then(res => {
      return res.json()
    }) //if ok
    .then(data => {
      console.log(setMovies(data.results))
    })
    .catch(err => console.error(err))
    //get the data and stuff it in the state variable "movies"

    //handle any errors

  }

  //handler to capture user input
  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }


  return (
    <>
      <div className='app'>Movie API
        <div className='searchBar'>
          <input onChange={handleChange} type="text" id="inputField" placeholder="Enter a movie title" />
          <button onClick={handleSearch}>Search</button>
        </div>
        {moviesJSXCollection}
      </div>
    </>
  )
}

export default App
