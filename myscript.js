/*jslint es6 */

async function getBestFilm() {
	await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score,-votes")
.then(await function(res) {
	if (res.ok) {
		return res.json();
	}
})
.catch( await function(error) {
	console.log("Error : ", error)
})
//get image for the best film
.then( await function(value) {
//get data for film N°1
document.querySelector(".show_video__extract img").src= value.results[0].image_url;
document.querySelector(".show_video__extract img").id= value.results[0].id
document.querySelector("#play_container h1").innerText = value.results[0].title
//get summary for the best film. Need a new request with fetch
fetch(value.results[0].url)
.then(function(res) {
	if (res.ok) {
		return res.json();
	}
})
.catch(function(error) {
	console.log("Erreur :", error);
})
.then(function(data) {
document.querySelector("#play_container p").innerText = data.long_description;
return value.results[0];
});
});

}




async function newGetFilms(genre, movies, nbOfMovies, div, start, end) {
	let page = 1;
	let status = 1;
	while (status == 1) {
		await fetch(`http://localhost:8000/api/v1/titles/?genre=${genre}&sort_by=-imdb_score,-votes&page=${page}`)
	.then(function(res) {
		if (res.ok) {
			return res.json();
		}
	})
	.catch(function(error) {
		console.log("Erreur :", error);
	})
	.then(await function(value) {
		for (movie of value.results) {		
			if (movies.length<nbOfMovies) {
				movies.push(movie)
			} else {
				place=1;
				for (let movie=start;movie<end;movie++) {
			document.querySelector(div).children[place].src = movies[movie].image_url;
			document.querySelector(div).children[place].id = movies[movie].id;
			place++;
		}
				status=0;
			}		
		}
		
	})
	page++;
	}
	if (movies==topMovies) {
		movies.shift();
	}
	return movies;
}

//get a given number of top films 
let topMovies = [];
let actionMovies = [];
let comedyMovies = [];
let westernMovies = [];
let nbTopMovies = 11;
let nbActionMovies = 18;
let nbComedyMovies = 22;
let nbWesternMovies = 17;

let bestFilm = getBestFilm();
// we add +1 to nbTopMovies since the best film shouldn't be in carousel
newGetFilms("", topMovies, nbTopMovies+1, ".tops",1,5);
newGetFilms("action", actionMovies, nbActionMovies, ".cat_1",0,4);
newGetFilms("comedy", comedyMovies, nbComedyMovies, ".cat_2",0,4);
newGetFilms("western", westernMovies, nbWesternMovies, ".cat_3",0,4);



//management of top films carousel

document.querySelector("#top_arrow_left").addEventListener("click", function(e) {
	let lastMovie = topMovies.pop();
	topMovies.unshift(lastMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".tops").children[movie+1].src = `${topMovies[movie].image_url}`;
		document.querySelector(".tops").children[movie+1].id = `${topMovies[movie].id}`;

	}

})

document.querySelector("#top_arrow_right").addEventListener("click", function(e) {
	let firstMovie = topMovies.shift();
	topMovies.push(firstMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".tops").children[movie+1].src = `${topMovies[movie].image_url}`;
		document.querySelector(".tops").children[movie+1].id = `${topMovies[movie].id}`;

	}

})

//management of cat1 films carousel

document.querySelector("#cat1_arrow_left").addEventListener("click", function(e) {
	let lastMovie = actionMovies.pop();
	actionMovies.unshift(lastMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".cat_1").children[movie+1].src = `${actionMovies[movie].image_url}`;
		document.querySelector(".cat_1").children[movie+1].id = `${actionMovies[movie].id}`;

	}

})

document.querySelector("#cat1_arrow_right").addEventListener("click", function(e) {
	let firstMovie = actionMovies.shift();
	actionMovies.push(firstMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".cat_1").children[movie+1].src = `${actionMovies[movie].image_url}`;
		document.querySelector(".cat_1").children[movie+1].id = `${actionMovies[movie].id}`;

	}

})

//management of cat2 films carousel

document.querySelector("#cat2_arrow_left").addEventListener("click", function(e) {
	let lastMovie = comedyMovies.pop();
	comedyMovies.unshift(lastMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".cat_2").children[movie+1].src = `${comedyMovies[movie].image_url}`;
		document.querySelector(".cat_2").children[movie+1].id = `${comedyMovies[movie].id}`;

	}

})

document.querySelector("#cat2_arrow_right").addEventListener("click", function(e) {
	let firstMovie = comedyMovies.shift();
	comedyMovies.push(firstMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".cat_2").children[movie+1].src = `${comedyMovies[movie].image_url}`;
		document.querySelector(".cat_2").children[movie+1].id = `${comedyMovies[movie].id}`;

	}

})

//management of cat3 films carousel

document.querySelector("#cat3_arrow_left").addEventListener("click", function(e) {
	let lastMovie = westernMovies.pop();
	westernMovies.unshift(lastMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".cat_3").children[movie+1].src = `${westernMovies[movie].image_url}`;
		document.querySelector(".cat_3").children[movie+1].id = `${westernMovies[movie].id}`;

	}

})

document.querySelector("#cat3_arrow_right").addEventListener("click", function(e) {
	let firstMovie = westernMovies.shift();
	westernMovies.push(firstMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".cat_3").children[movie+1].src = `${westernMovies[movie].image_url}`;
		document.querySelector(".cat_3").children[movie+1].id = `${westernMovies[movie].id}`;

	}

})

document.querySelector("#close").addEventListener("click", function() {
	document.querySelector("#modal").style.visibility = "hidden";
})


// creating an array from all images for click management
let allImages = Array.from(document.getElementsByTagName('img'));
//logo JustStreamIt is remmoved from array
allImages.shift();
for (let image of allImages) {
	image.addEventListener("click", function(e) {
	document.querySelector("#modal").style.visibility = "visible";
	fetch(`http://localhost:8000/api/v1/titles/${image.id}`)
	.then(function(res) {
		if (res.ok) {
			return res.json();
		}
	})
	.catch(function(error) {
		console.log("error :", error)
	})
	.then(function(value) {
	document.querySelector("#modal img").src = value.image_url;
	document.querySelector("#title").innerText = value.title;
	document.querySelector("#genre").innerText = `Genre : ${value.genres}`;
	document.querySelector("#date").innerText = `Date de sortie : ${value.date_published}`;
	document.querySelector("#rated").innerText = `Classification : ${value.rated}`;
	document.querySelector("#score").innerText = `Score Imdb : ${value.imdb_score}`;
	document.querySelector("#directors").innerText = `Réalisateur(s) : ${value.directors}`;
	document.querySelector("#duration").innerText = `Durée : ${value.duration} minutes`;
	document.querySelector("#country").innerText = `Pays d'origine : ${value.countries}`;
	document.querySelector("#income").innerText = `Recettes : ${value.worldwide_gross_income} $`;
	document.querySelector("#actors").innerHTML = `<ul> Acteurs : </ul>`;
	for (let actor of value.actors) {
		let li = document.createElement('li');
		li.innerHTML = actor;
		document.querySelector("#actors").appendChild(li);
	}
	document.querySelector("#summary").innerText = `Résumé : \n ${value.long_description}`;
	})
})};