//creation of carousels
//creration of a default image
function defImage(alt) {
    let image = document.createElement('img');
    image.src = "nofile.jpg";
    image.alt = alt;
    return image;
}

//creation of a HTML section corresponding with one category of films
function defSection(title, selector, arrow_left, arrow_right, categories) {
    let section = document.createElement('section');
    let h2 = document.createElement('h2');
    h2.innerText = title;
    let div = document.createElement('div');
    div.className = selector;
    let iLeft = document.createElement('i');
    iLeft.classList.add("fa", "fa-arrow-left", "fa-2x", "clickable");
    iLeft.id = arrow_left;
    let iRight = document.createElement('i');
    iRight.classList.add("fa", "fa-arrow-right", "fa-2x", "clickable");
    iRight.id = arrow_right;
    document.querySelector(".show_video").after(section);
    section.appendChild(h2);
    section.appendChild(div);
    div.appendChild(iLeft);
    for (let img =0;img<4;img++) {
        div.appendChild(defImage(categories[img]));
    }
    div.appendChild(iRight);
}

let topsCategory = ["top2", "top3", "top4", "top5"];
let firstCategory = ["cat1_1", "cat1_2", "cat1_3", "cat1_4"];
let secondCategory = ["cat2_1", "cat2_2", "cat2_3", "cat2_4"];
let thirdCategory = ["cat3_1", "cat3_2", "cat3_3", "cat3_4"];


defSection("Category 3", "cat3", "cat3_arrow_left", "cat3_arrow_right", thirdCategory);
defSection("Category 2", "cat2", "cat2_arrow_left", "cat2_arrow_right", secondCategory);
defSection("Category 1", "cat1", "cat1_arrow_left", "cat1_arrow_right", firstCategory);
defSection("Best noted movies", "tops", "top_arrow_left", "top_arrow_right", topsCategory);

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
document.querySelector(".show_video__extract img").id= value.results[0].id;
document.querySelector("#play_container h2").innerText = value.results[0].title;
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
	window.alert(`Error - cant get data for \n${genre} films\n ${error}`);
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
		for (let movie of value.results) {
			if (movies.length<nbOfMovies) {
				movies.push(movie);
			} else {
				let place=1;
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
		
	});
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
	document.querySelector(key).addEventListener("click", function() {
	value[2](value[1], value[0]);
});
}


//modal close evenement
document.querySelector("#close").addEventListener("click", function() {
	document.querySelector("#modal").style.visibility = "hidden";
});


//modal open evenement
// creating an array from all images for click management
let allImages = Array.from(document.getElementsByTagName('img'));
//logo JustStreamIt and Modal image are removed from array
allImages.shift();
allImages.shift();
for (let image of allImages) {
	image.addEventListener("click", function() {
	document.querySelector("#modal").style.visibility = "visible";
	fetch(`http://localhost:8000/api/v1/titles/${image.id}`)
	.then(function(res) {
		if (res.ok) {
			return res.json();
		}
	})
	.catch(function(error) {
		displayError(error, "selected");
	})
	.then(function(value) {
	document.querySelector("#modal img").src = value.image_url;
	document.querySelector("#title").innerText = value.title;
	document.querySelector("#genre").innerText = `Genre : ${value.genres}`;
	document.querySelector("#date").innerText = `Release date : ${value.date_published}`;
	document.querySelector("#rated").innerText = `Rated : ${value.rated}`;
	document.querySelector("#score").innerText = `Imdb Score: ${value.imdb_score}`;
	document.querySelector("#directors").innerText = `Director(s) : ${value.directors}`;
	document.querySelector("#duration").innerText = `Runtime : ${value.duration} minutes`;
	document.querySelector("#country").innerText = `Country of origin : ${value.countries}`;
	document.querySelector("#income").innerText = `Box office gross worldwide : ${value.worldwide_gross_income} $`;
	document.querySelector("#actors").innerHTML = `<ul> <span id='color_actor'>Actors : </span></ul>`;
	for (let actor of value.actors) {
		let li = document.createElement('li');
		li.innerHTML = actor;
		document.querySelector("#actors").appendChild(li);
	}
	document.querySelector("#summary").innerHTML = `<span id='color_summary'>Summary : </span>\n ${value.long_description}`;
	});
});}