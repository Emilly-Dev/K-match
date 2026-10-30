import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import DramaCard from './components/DramaCard'
import {useEffect, useState} from 'react'
import SearchBar from './components/SearchBar'

const dramas = [
  {
    id: 1,
    title: 'Pousando no Amor',
    year: 2019,
    genre: 'Romance',
    rating: 9.0,
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYru70PhfyxImxuQ67GjPKP6NGHCz5JcZKi7UCN-ycJw&s'
  },
  {
    id: 2,
    title: 'Pretendente Surpresa',
    year: 2022,
    genre: 'Comédia romântica',
    rating: 8.3,
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmMurd_sOrohPlMFqipzzDARB5yUxCz2B6KbyG3wqjNg&s=10'
  },
  {
    id: 3,
    title: 'Vinte e Cinco, Vinte e Um',
    year: 2022,
    genre: 'Romance',
    rating: 8.6,
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjXqLoKUdQttafskZQoXF2XECzPhbCvDIR5kgG88xwbA&s=10'
  },
  {
    id: 4,
    title: '100 Dias de Mentira',
    year: 2026,
    genre: 'Romance',
    rating: 9.5,
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-JL13G7l4SclkwWmPImQUbnpgQfXs9Zqbzplhbum_KA&s=10'
  },
]


function App() {
  // 1- Estados
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('Todos')
  const [favoriteIds, setFavoriteIds] = useState(() => {
     try {
    const savedFavorites = localStorage.getItem('k-match-favorites')

    return savedFavorites ? JSON.parse(savedFavorites) : []
  } catch {
    return []
  }
})
  const [sortBy, setSortBy] = useState('rating')

  useEffect(() => {
    localStorage.setItem(
      'k-match-favorites',
      JSON.stringify(favoriteIds)
    )
  }, [favoriteIds])
  
  //  2 Função para adicionar e remover favoritos
  function toggleFavorite(dramaId) {
    setFavoriteIds((currentIds) => {
      if (currentIds.includes(dramaId)) {
        return currentIds.filter((id) => id !== dramaId)
      }

      return [...currentIds, dramaId];
    })
  }

  // 3 - Filtro do catálogo
  const filteredDramas = dramas.filter((drama) => {
  const matchesTitle = drama.title
    .toLowerCase()
    .includes(searchTerm.trim().toLowerCase())

  const matchesGenre = 
    selectedGenre === 'Todos' || drama.genre === selectedGenre

    return matchesTitle && matchesGenre
  })

  .sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating
    }
    if (sortBy === 'newest') {
      return b.year - a.year 
    }
    if (sortBy === 'oldest') {
      return a.year - b.year
    }
    return 0
  })

  // 4 - Lista de favoritos
const favoriteDramas = dramas.filter((drama) =>
  favoriteIds.includes(drama.id)
)

  return (
    <main>
      <Header />
      <Hero />
      <SearchBar
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      selectedGenre={selectedGenre}
      onGenreChange={setSelectedGenre}
      />

      <div className="sort-control">
        <label htmlFor="sort-dramas">Ordenar por:</label>

        <select 
          id="sort-drama"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="rating">Melhor avaliação</option>
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigos</option>
        </select>
      </div>

      <section className="drama-section" id="catalago">
        <h2>K-dramas para descobrir</h2>

        <div className="drama-grid">
          {filteredDramas.map((drama) => (
            <DramaCard 
            key={drama.id} 
            drama={drama}
            isFavorite={favoriteIds.includes(drama.id)}
            onToggleFavorite={toggleFavorite}
            />
          ))}

          {filteredDramas.length === 0 && (
            <p>Nenhum K-drama encontrado.</p>
          )}

        </div>
      </section>

{/* Lista */}
      <section className="drama-section">
        <h2>Minha lista</h2>

        {favoriteDramas.length === 0 ? (
          <p>Você ainda não favoritou nenhum K-drama.</p>
        ) : (
          <div className="drama-grid">
            {favoriteDramas.map((drama) => (
              <DramaCard
              key={drama.id}
              drama={drama}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
