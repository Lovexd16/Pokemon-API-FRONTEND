console.log("test");

let pokemonList = document.getElementById("pokemonList");
let promises = [];

for (let i = 1; i <= 151; i++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url)
    .then(res => res.json()));
};

Promise.all(promises).then(results => {
    let pokemon = results.map(data => ({
        pokemonName: data.name,
        pokemonId: data.id,
        pokemonImg: data.sprites['front_default'],
        type: data.types.map((type) => type.type.name).join(", ")
    }));
    printPokemonList(pokemon)
});

function printPokemonList(pokemon) {
    console.log(pokemon);

    pokemon.forEach(pokemonData => {
        let pokemonDiv = document.createElement("div");
        pokemonDiv.classList.add("pokemon");

        let pokemonName = document.createElement("h2");
        pokemonName.innerText = pokemonData.pokemonId + ". " +  pokemonData.pokemonName;

        let pokemonImg = document.createElement("img");
        pokemonImg.src = pokemonData.pokemonImg;

        let pokemonTypes = document.createElement("p");
        pokemonTypes.innerText = "Typer: " + pokemonData.type;
        
        pokemonDiv.append(pokemonName, pokemonImg, pokemonTypes);
        pokemonList.appendChild(pokemonDiv);
    });
    
};