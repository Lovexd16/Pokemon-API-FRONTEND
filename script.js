console.log("test");

let pokemonList = document.getElementById("pokemonList");

//Skapar en promises array där jag lägger alla pokemon jag hämtar med api:et
let promises = [];

//Lägger fetchen i en for loop för att bara få ut de första 151 pokemonen
for (let i = 1; i <= 151; i++) {
    promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
    .then(res => res.json()));
};

//När alla pokemon hämtats hanteras de tillsammans istället för en i taget
Promise.all(promises).then(results => {
    let pokemon = results.map(data => ({
        pokemonName: data.name,
        pokemonId: data.id,
        pokemonImg: data.sprites['front_default'],
        //Gör så typerna av pokemon visas tillsammans med kommatecken emellan dem
        type: data.types.map((type) => type.type.name).join(", ")
    }));
    printPokemonList(pokemon)
});

//Funktion för att printa listan av pokemon
function printPokemonList(pokemon) {
    console.log(pokemon);

    //En forEach för att skapa html element till varje pokemon
    pokemon.forEach(pokemonData => {
        let pokemonDiv = document.createElement("div");

        //för att kunna hantera varje pokemon i css
        pokemonDiv.classList.add("pokemon");

        let pokemonName = document.createElement("h2");
        pokemonName.innerText = pokemonData.pokemonId + ". " +  pokemonData.pokemonName;

        let pokemonImg = document.createElement("img");
        pokemonImg.src = pokemonData.pokemonImg;

        let pokemonTypes = document.createElement("p");
        pokemonTypes.innerText = "Types: " + pokemonData.type;

        let catchBtn = document.createElement("button")
        catchBtn.innerText = "Catch";

        let releaseBtn = document.createElement("button")
        releaseBtn.innerText = "Release";

        //Fetch till en metod i mitt api där jag kollar om en pokemon finns i databasen eller inte för att visa rätt knapp
        fetch("http://localhost:8080/look-for-pokemon?pokemonId=" + pokemonData.pokemonId)
        .then(res => res.json())
        .then(found => {
            if(found) {
                catchBtn.style.display = "none";
                releaseBtn.style.display = "block";
            } else {
                catchBtn.style.display = "block";
                releaseBtn.style.display = "none";
            }
        })

        //När catch-knappen klickas har jag en fetch till en metod i mitt api som sparar pokemonen i databasen
        catchBtn.addEventListener("click", function() {
            fetch("http://localhost:8080/catch-pokemon", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pokemonData),
            })
            .then(res => {
                return res.text();
            })
            .then(data => {
                console.log(data);
                alert(data); 

                //Ändrar vilken knapp som syns dirent här, annars behövde jag uppdatera sidan för att knappen skulle ändras
                catchBtn.style.display = "none";
                releaseBtn.style.display = "block";
            })
        });

        //När release knappen klickas har jag fetch till release-pokemon, som är en metod som tar bort pokemonen från databasen
        releaseBtn.addEventListener("click", function() {
            fetch("http://localhost:8080/release-pokemon", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pokemonData)
            })
            .then(res => {
                return res.text();
            })
            .then(data => {
                console.log(data);
                alert(data);

                catchBtn.style.display = "block";
                releaseBtn.style.display = "none";
            })
        });
        
        //Lägger elementen i en div, diven läggs sedan i pokemonList som jag har i min HTML
        pokemonDiv.append(pokemonName, pokemonImg, pokemonTypes, catchBtn, releaseBtn);
        pokemonList.appendChild(pokemonDiv);
    });
    
};