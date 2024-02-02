console.log("test");

let pokemonList = document.getElementById("pokemonList");
let caughtPokemonList = document.getElementById("caughtPokemonList");

//Skapar en promises array där jag lägger alla pokemon jag hämtar med api:et
let promises = [];

//Lägger fetchen i en for loop för att bara få ut de första 151 pokemonen
for (let i = 1; i <= 151; i++) {
  promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then((res) => res.json()));
}

//När alla pokemon hämtats hanteras de tillsammans istället för en i taget
Promise.all(promises).then((results) => {
  let pokemon = results.map((data) => ({
    pokemonName: data.name,
    pokemonId: data.id,
    pokemonImg: data.sprites["front_default"],
    //Gör så typerna av pokemon visas tillsammans med kommatecken emellan dem
    type: data.types.map((type) => type.type.name).join(", "),
  }));
  printPokemonList(pokemon);
});

//Funktion för att printa listan av pokemon
function printPokemonList(pokemon) {
  console.log(pokemon);

  //En forEach för att skapa html element till varje pokemon
  pokemon.forEach((pokemonData) => {
    let pokemonDiv = document.createElement("div");

    //för att kunna hantera varje pokemon i css
    pokemonDiv.classList.add("pokemon");

    let pokemonName = document.createElement("h2");
    pokemonName.innerText = pokemonData.pokemonId + ". " + pokemonData.pokemonName;

    let pokemonImg = document.createElement("img");
    pokemonImg.classList.add("pokemonImg");
    pokemonImg.src = pokemonData.pokemonImg;

    let pokemonTypes = document.createElement("p");
    pokemonTypes.innerText = "Types: " + pokemonData.type;

    let catchBtn = document.createElement("button");
    catchBtn.classList.add("catchBtn");
    catchBtn.innerText = "Catch";

    let releaseBtn = document.createElement("button");
    releaseBtn.classList.add("releaseBtn");
    releaseBtn.innerText = "Release";

    lookForPokemon(pokemonData, catchBtn, releaseBtn);

    catchPokemon(pokemonData, catchBtn, releaseBtn);

    releasePokemon(pokemonData, catchBtn, releaseBtn);

    //Lägger elementen i en div, diven läggs sedan i pokemonList som jag har i min HTML
    pokemonDiv.append(pokemonName,pokemonImg,pokemonTypes,catchBtn,releaseBtn);
    pokemonList.appendChild(pokemonDiv);
  });
}

//function för att kolla om specifik pokemon finns i databasen. Detta för att visa korrekt knapp för varje pokemon
function lookForPokemon(pokemonData, catchBtn, releaseBtn) {
  fetch("http://localhost:8080/look-for-pokemon?pokemonId=" + pokemonData.pokemonId)
    .then((res) => res.json())
    .then((found) => {
      if (found) {
        //Ändra style på knapparna så en göms, en visas
        catchBtn.style.display = "none";
        releaseBtn.style.display = "block";

      } else {
        catchBtn.style.display = "block";
        releaseBtn.style.display = "none";
      }
    });
}

//Function för att fånga pokemon, spara i databasen
function catchPokemon(pokemonData, catchBtn, releaseBtn) {
  //När catch-knappen klickas har jag en fetch till en metod i mitt api som sparar pokemonen i databasen
  catchBtn.addEventListener("click", function () {
    fetch("http://localhost:8080/catch-pokemon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pokemonData),
    })
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        console.log(data);
        alert(data);

        //Kallar på getCaughtPokemon function för att uppdatera denna lista direkt
        getCaughtPokemon();

        //Ändrar vilken knapp som syns
        catchBtn.style.display = "none";
        releaseBtn.style.display = "block";
      });
  });
}

//Function för att släppa pokemon lös, ta bort från databasen
function releasePokemon(pokemonData, catchBtn, releaseBtn) {
  //När release knappen klickas har jag fetch till release-pokemon, som är en metod som tar bort pokemonen från databasen
  releaseBtn.addEventListener("click", function () {
    fetch("http://localhost:8080/release-pokemon", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pokemonData),
    })
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        console.log(data);
        alert(data);

        getCaughtPokemon();

        catchBtn.style.display = "block";
        releaseBtn.style.display = "none";
      });
  });
}

//Function för att hämta alla pokemon som är sparade i databasen
function getCaughtPokemon() {
  fetch("http://localhost:8080/get-caught-pokemon")
    .then((res) => res.json())
    .then((data) => {
      printCaughtPokemonList(data);
    });
}

//Function för att skriva ut fångade pokemon i en lista på sidan
function printCaughtPokemonList(pokemonCaughtList) {
  caughtPokemonList.innerHTML = "";

  if(pokemonCaughtList.length === 0) {
    let emptyList = document.createElement("p2");
    emptyList.classList.add("emptyList");
    emptyList.innerText = "Du har inga fångade pokemon!"

    caughtPokemonList.appendChild(emptyList);
  } else {

    pokemonCaughtList.forEach((pokemonData) => {
        let caughtPokemonListItem = document.createElement("li");
        caughtPokemonListItem.classList.add("caughtPokemonListItem");
        caughtPokemonListItem.innerText = `${pokemonData.pokemonName}`;
        caughtPokemonList.appendChild(caughtPokemonListItem);
      });
  }
}

//Gör så att listan av fångade pokemon laddas när sidan öppnas
window.onload = function () {
  getCaughtPokemon();
};
