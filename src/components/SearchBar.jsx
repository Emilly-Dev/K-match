function SearchBar({
    searchTerm,
    onSearchChange,
    selectedGenre,
    onGenreChange
}) {
    return (
        <div className="search-bar">
            <label htmlFor="drama-search">
                Buscar K-drama
            </label>

            <input
            id="drama-search" 
            type="search" 
            placeholder="Digite o título de um drama"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            />

            <label htmlFor="genre-filter">
                Filtrar por gênero
            </label>

            <select 
            id="genre-filter"
            className="genre-filter"
            value={selectedGenre}
            onChange={(event) => onGenreChange(event.target.value)}
            >
            <option value="Todos">Todos os gêneros</option>
            <option value="Romance">Romance</option>
            <option value="Comédia romântica">Comédia romântica</option>
            </select>

        </div>
    )
}

export default SearchBar