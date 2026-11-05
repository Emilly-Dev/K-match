import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import DramaCard from './components/DramaCard'
import { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar'

function App() {
  // 1- Estados
  const [dramas, setDramas] = useState([])
  const [loading, setLoading] = useState(true)
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

  // Buscar dados da API 
  useEffect(() => {
    async function carregarDramas() {
      try {
        setLoading(true)

        const response = await fetch('/api/dramas')
        const data = await response.json()

        const listaDeFilmes = data.results || data

        // Mapeia o padrão do TMDB para as propriedades que o seu <DramaCard /> já usa
        const dramasFormatados = listaDeFilmes.map((item) => ({
          id: item.id,
          title: item.name || item.title, // Séries usam 'name', filmes usam 'title'
          year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : (item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'),
          genre: 'Coreano', // Padrão inicial simplificado
          rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
          poster: item.poster_path ? `https://tmdb.org{item.poster_path}` : 'https://placehold.co'
        }))

        setDramas(dramasFormatados)
      } catch (error) {
        console.error("Erro ao buscar doramas da API:", error)
      } finally {
        setLoading(false)
      }
    }

    carregarDramas()
  }, [])

  useEffect(() => {
    localStorage.setItem(
      'k-match-favorites',
      JSON.stringify(favoriteIds)
    )
  }, [favoriteIds])
  
  // 2 - Função para adicionar e remover favoritos
  function toggleFavorite(dramaId) {
    setFavoriteIds((currentIds) => {
      if (currentIds.includes(dramaId)) {
        return currentIds.filter((id) => id !== dramaId)
      }
      return [...currentIds, dramaId]
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
        <label htmlFor="sort-drama">Ordenar por:</label>
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

        {loading ? (
          <p style={{ textAlign: 'center', color: '#fff' }}>Carregando K-dramas dinâmicos do TMDB...</p>
        ) : (
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
        )}
      </section>

      {/* Lista */}
      <section className="drama-section">
        <h2>Minha lista</h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#fff' }}>Carregando lista...</p>
        ) : favoriteDramas.length === 0 ? (
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
