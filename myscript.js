/*jslint es6 */


//get 5 films with filtered conditions
function getFilms(filter) {
	let movies = fetch(`http://localhost:8000/api/v1/titles/${filter}`)
	.then(function(res) {
		if (res.ok) {
			return res.json();
		}
	})
	.catch(function(error) {
		console.log("Erreur :", error);
	})
	return movies
}


//create array of 7 films
function categoryFilms(category5, data, div, startFilm, endFilm) {
	for (let movie=startFilm;movie<5;movie++) {
		category5.then(function(value) {
			data.push(value.results[movie])
		})
	}
	category5.then(function(value) {
		fetch(value.next)
		.then(function(res) {
			if (res.ok) {
				return res.json();
			}
		})
		.catch(function(error) {
			console.log("error : ", error);
		})
		.then(function(value) {
			for (let movie2=0;movie2<(endFilm-5);movie2++) {
				data.push(value.results[movie2]);
			}
		})
		for (let movie=0;movie<4;movie++) {
			document.querySelector(div).children[movie+1].src = data[movie].image_url;
			document.querySelector(div).children[movie+1].id = data[movie].id;
		}
	})
	return data;
}


//get top films
let top5 = getFilms("?sort_by=-imdb_score,-votes");
let top7Movies = categoryFilms(top5, [], ".tops", 1, 8);


//get action films
let action5 = getFilms("?genre=action&sort_by=-imdb_score,-votes");
let action7Movies = categoryFilms(action5, [], ".cat_1", 0, 7);

//get comedy films
let comedy5 = getFilms("?genre=comedy&sort_by=-imdb_score,-votes");
let comedy7Movies = categoryFilms(comedy5, [], ".cat_2", 0, 7);

//get western films
let western5 = getFilms("?genre=western&sort_by=-imdb_score,-votes");
let western7Movies = categoryFilms(western5, [], ".cat_3", 0, 7);



//get image for the best film
top5.then(function(value) {
//get image for film N°1
document.querySelector(".show_video__extract img").src= value.results[0].image_url;
document.querySelector(".show_video__extract img").id= value.results[0].id
});

//get title for the best film
title_top1 = top5.then(function(value) {
document.querySelector("#play_container h1").innerText = value.results[0].title
});

//get summary for the best film. Need a new request with fetch
url_description_top1 = top5.then(function(value) {
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
});
});



//management of top films carousel

document.querySelector("#top_arrow_left").addEventListener("click", function(e) {
	let lastMovie = top7Movies.pop();
	top7Movies.unshift(lastMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".tops").children[movie+1].src = `${top7Movies[movie].image_url}`;
		document.querySelector(".tops").children[movie+1].id = `${top7Movies[movie].id}`;

	}

})

document.querySelector("#top_arrow_right").addEventListener("click", function(e) {
	let firstMovie = top7Movies.shift();
	top7Movies.push(firstMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".tops").children[movie+1].src = `${top7Movies[movie].image_url}`;
		document.querySelector(".tops").children[movie+1].id = `${top7Movies[movie].id}`;

	}

})

//management of cat1 films carousel

document.querySelector("#cat1_arrow_left").addEventListener("click", function(e) {
	let lastMovie = action7Movies.pop();
	action7Movies.unshift(lastMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".cat_1").children[movie+1].src = `${action7Movies[movie].image_url}`;
		document.querySelector(".cat_1").children[movie+1].id = `${action7Movies[movie].id}`;

	}

})

document.querySelector("#cat1_arrow_right").addEventListener("click", function(e) {
	let firstMovie = action7Movies.shift();
	action7Movies.push(firstMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".cat_1").children[movie+1].src = `${action7Movies[movie].image_url}`;
		document.querySelector(".cat_1").children[movie+1].id = `${action7Movies[movie].id}`;

	}

})

//management of cat2 films carousel

document.querySelector("#cat2_arrow_left").addEventListener("click", function(e) {
	let lastMovie = comedy7Movies.pop();
	comedy7Movies.unshift(lastMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".cat_2").children[movie+1].src = `${comedy7Movies[movie].image_url}`;
		document.querySelector(".cat_2").children[movie+1].id = `${comedy7Movies[movie].id}`;

	}

})

document.querySelector("#cat2_arrow_right").addEventListener("click", function(e) {
	let firstMovie = comedy7Movies.shift();
	comedy7Movies.push(firstMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".cat_2").children[movie+1].src = `${comedy7Movies[movie].image_url}`;
		document.querySelector(".cat_2").children[movie+1].id = `${comedy7Movies[movie].id}`;

	}

})

//management of cat3 films carousel

document.querySelector("#cat3_arrow_left").addEventListener("click", function(e) {
	let lastMovie = western7Movies.pop();
	western7Movies.unshift(lastMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".cat_3").children[movie+1].src = `${western7Movies[movie].image_url}`;
		document.querySelector(".cat_3").children[movie+1].id = `${western7Movies[movie].id}`;

	}

})

document.querySelector("#cat3_arrow_right").addEventListener("click", function(e) {
	let firstMovie = western7Movies.shift();
	western7Movies.push(firstMovie);
	for (let movie=0; movie<4; movie++) {
		document.querySelector(".cat_3").children[movie+1].src = `${western7Movies[movie].image_url}`;
		document.querySelector(".cat_3").children[movie+1].id = `${western7Movies[movie].id}`;

	}

})

document.querySelector("#close_modal").addEventListener("click", function() {
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
	document.querySelector("#actors").innerText = `Acteurs : ${value.actors}`;
	document.querySelector("#summary").innerText = `Résumé : ${value.long_description}`;
	})
})};


