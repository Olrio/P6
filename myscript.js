//a function was created which, if needed, enables to reuse collected data
function getBestFilm() {
	fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score,-votes")
.then(function(res) {
	if (res.ok) {
		return res.json();
	}
})
.catch(function(error) {
	displayError(error, "best");
})
//get title and image for the best film
.then(function(value) {
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
	displayError(error, "Top 1 summary");
})
.then(function(data) {
document.querySelector("#play_container p").innerText = data.long_description;
return value.results[0];
});
});
}


//display where and why occured an error
function displayError(error, genre) {
	console.log(error);
	window.alert(`Erreur - impossible de récupérer les informations demandées pour \n${genre} films\n ${error}`);
}


//an async function is needed to prevent an infinite while loop
//
async function getFilms(genre, movies, nbOfMovies, div, start, end) {
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
		if (genre==""){
			genre="tops";
		}
		displayError(error, genre);
	})
	.then(function(value) {
		for (movie of value.results) {		
			if (movies.length<nbOfMovies) {
				movies.push(movie)
			} else {
				place=1;
				if (genre) {
					document.querySelector(div).parentElement.firstElementChild.innerText = genre;
				}	
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
let cat1Movies = [];
let cat2Movies = [];
let cat3Movies = [];
let nbTopMovies = 7;
let nbCat1Movies = 7;
let nbCat2Movies = 7;
let nbCat3Movies = 7;
let cat1 = "horror";
let cat2 = "animation";
let cat3 = "western";

//get data for the best noted film
getBestFilm();
// we add +1 to nbTopMovies since the best film shouldn't be in carousel
getFilms("", topMovies, nbTopMovies+1, ".tops",1,5);
getFilms(cat1, cat1Movies, nbCat1Movies, ".cat1",0,4);
getFilms(cat2, cat2Movies, nbCat2Movies, ".cat2",0,4);
getFilms(cat3, cat3Movies, nbCat3Movies, ".cat3",0,4);



//functions to manage left and right translations in carousels

function leftTranslation(category, selector) {
	let lastMovie = category.pop();
	category.unshift(lastMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(selector).children[movie+1].src = `${category[movie].image_url}`;
		document.querySelector(selector).children[movie+1].id = `${category[movie].id}`;
}
}

function rightTranslation(category, selector) {
	let firstMovie = category.shift();
	category.push(firstMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(selector).children[movie+1].src = `${category[movie].image_url}`;
		document.querySelector(selector).children[movie+1].id = `${category[movie].id}`;
}
}


//The carousel collection stores element, selector, data 
//and translation-orientation for the carousel

const carousel = new Map();
carousel.set("#top_arrow_left", [".tops", topMovies, leftTranslation]);
carousel.set("#top_arrow_right", [".tops", topMovies, rightTranslation]);
carousel.set("#cat1_arrow_left", [".cat1", cat1Movies, leftTranslation]);
carousel.set("#cat1_arrow_right", [".cat1", cat1Movies, rightTranslation]);
carousel.set("#cat2_arrow_left", [".cat2", cat2Movies, leftTranslation]);
carousel.set("#cat2_arrow_right", [".cat2", cat2Movies, rightTranslation]);
carousel.set("#cat3_arrow_left", [".cat3", cat3Movies, leftTranslation]);
carousel.set("#cat3_arrow_right", [".cat3", cat3Movies, rightTranslation]);

for (let [key, value] of carousel) {
	document.querySelector(key).addEventListener("click", function(e) {
	value[2](value[1], value[0]);
})
}


//modal close evenement
document.querySelector("#close").addEventListener("click", function() {
	document.querySelector("#modal").style.visibility = "hidden";
})


//modal open evenement
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
		displayError(error);
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
	document.querySelector("#actors").innerHTML = `<ul> <span id='color_actor'>Acteurs : </span></ul>`;
	for (let actor of value.actors) {
		let li = document.createElement('li');
		li.innerHTML = actor;
		document.querySelector("#actors").appendChild(li);
	}
	document.querySelector("#summary").innerHTML = `<span id='color_summary'>Résumé : </span>\n ${value.long_description}`;
	})
})};