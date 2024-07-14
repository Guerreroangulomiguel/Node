const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const { error } = require('node:console')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:1234',
        'https://movies.com',
        'https://midu.dev'
      ]
  
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }
  
      if (!origin) {
        return callback(null, true)
      }
  
      return callback(new Error('Not allowed by CORS'))
    }
  }))

app.disable('x-powered-by')

app.get('/', (req, res) => {
    res.json({message: 'putos'})
})

// app.get('/movies', (req, res) => {
    
//     res.json(movies)
// })

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)

    res.status(404).json({message: 'Sorry porn movies are bloqued'})
})

app.get('/movies', (req, res) => {
    // res.header('Access-Control-Allow-Origin', '*')

    const { genre } = req.query
    
    if (genre) {
        const filteredMovie = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
            return res.json(filteredMovie)
    }
    res.json(movies)
})

app.post('/movies', (req, res) => {

    const result = validateMovie(req.body)

    if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }


      const newMovie = {
        id: crypto.randomUUID(), // uuid v4
        ...result.data
      }
    
    movies.push(newMovie)
    res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
    
    const result = validatePartialMovie(req.body)  
    if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }
    
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({message: "Enanos encuerados Anal no encontrado"})
    }

    const UpdateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    movies[movieIndex]= UpdateMovie

    return res.json(UpdateMovie)
})


app.delete('/movies/:id', (req, res) => {
    // res.header('Access-Control-Allow-Origin', '*')
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
  
    if (movieIndex === -1) {
      return res.status(404).json({ message: 'Movie not found' })
    }
  
    movies.splice(movieIndex, 1)
  
    return res.json({ message: 'Movie deleted' })
  })


const port = process.env.PORT ?? 1234

app.listen(port, () => {
    console.log(" ya ya a la chingada")
})