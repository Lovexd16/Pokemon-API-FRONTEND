console.log("test");

let pokemonList = document.getElementById("pokemonList");

fetch("https://pokeapi.co/api/v2/pokemon?limit=30")
.then(res => res.json())
.then(data => {
    
    printPokemonList(data);

});

function printPokemonList(pokemons) {
    pokemons.results.forEach(pokemon => {
        console.log("pokemon", pokemon);

    let pokemonName = document.createElement("p");
    pokemonName.innerText = pokemon.name;
    pokemonList.appendChild(pokemonName);
    })
}