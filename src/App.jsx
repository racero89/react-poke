import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchTerm === "") {
      setPokemon(null);
      setError(null);
      return;
    }

    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
        );
        if (!response.ok) {
          throw new Error("Pokémon no encontrado");
        }
        const data = await response.json();
        setPokemon({
          name: data.name,
          image: data.sprites.front_default,
          types: data.types.map((t) => t.type.name).join(", "),
          id: data.id,
        });
      } catch (err) {
        setPokemon(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [searchTerm]);

  return (
    <div className="App">
      <h1>Buscador de Pokémon</h1>
      <input
        type="text"
        placeholder="Escribe el nombre del Pokémon"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}

      {pokemon && (
        <div className="pokemon-card">
          <h2>
            {pokemon.name} (#{pokemon.id})
          </h2>
          <img src={pokemon.image} alt={pokemon.name} />
          <p>Tipos: {pokemon.types}</p>
        </div>
      )}

      {!loading && !pokemon && !error && <p>Escribe para buscar un Pokémon</p>}
    </div>
  );
}

export default App;
