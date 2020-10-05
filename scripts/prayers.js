let searching_bar = document.getElementById('search_bar');
let shareButton = document.getElementById('butShare');

let result_card_elem = document.getElementById('result_card');
let prayer_card_elem = document.getElementById('prayer_card');

let search_results = [
	[document.getElementById('search_results1'),document.getElementById('search_results1_data')],
	[document.getElementById('search_results2'),document.getElementById('search_results2_data')],
	[document.getElementById('search_results3'),document.getElementById('search_results3_data')],
	[document.getElementById('search_results4'),document.getElementById('search_results4_data')],
	[document.getElementById('search_results5'),document.getElementById('search_results5_data')]
]

init();


function init() {
	searching_bar.addEventListener("keyup", function (val) {
		//result_card_elem.style.display = 'none';
		search_results.forEach((search_result, i) => {
			search_result[1].innerHTML = "";
			search_result[0].style.display = 'none';
		});

		let search_input = searching_bar.value;
		search_input = search_input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		search_input = search_input.toLowerCase();
		search_input = search_input.replace(/-/g, ' ');

		// If more that 2 letters in the search input
		if (search_input.length > 2) {
			// reset the score of each prayer
			for (var prayer of prayers) {
				prayer.score = 0;
			}
			for (var prayer of prayers) {
				let keywords = search_input.split(" ")
				for (var keyword of keywords) {
					// If the keyword has at least 2 letters
					if (keyword.length > 2) {
						if (search_in_title_prayer(keyword, prayer)) {
							prayer.score += 1;
						}
						prayer.score += count_in_text_prayer(keyword, prayer) / 5;
					}
				}
			}
			prayers_sorted = prayers.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
			update_search_results(prayers_sorted);
			//console.log(prayers_sorted)
		}
	})

	params = getUrlVars();
	//console.log(params.prayer);
	let selected_title;
	if (params.prayer != undefined) {
		selected_title = decodeURI(params.prayer)
		prayer_card_elem.style.display = 'block';
	} else {
		prayer_card_elem.style.display = 'none';
	}

	for (var prayer of prayers) {
		if (prayer.title == selected_title) {
			document.getElementById('prayer_text').innerHTML = prayer.text.replace(/^		/gm, '');
			document.getElementById('prayer_title').innerHTML = prayer.title;
		}
	}
}

function prayer_selected(name) {
	insertParam(name);
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		vars[key] = value;
	});
	return vars;
}

function insertParam(value) {
	key = encodeURI('prayer');

	var kvp = document.location.search.substr(1).split('&');

	var i = kvp.length; var x; while (i--) {
		x = kvp[i].split('=');

		if (x[0] == key) {
			x[1] = value;
			kvp[i] = x.join('=');
			break;
		}
	}

	if (i < 0) { kvp[kvp.length] = [key, value].join('='); }

	//this will reload the page, it's likely better to store this until finished
	document.location.search = kvp.join('&');
}


function update_search_results(prayers_sorted) {
	//result_card_elem.style.display = 'block';
	search_results.forEach((search_result, i) => {
		if (prayers_sorted[i].score > 0) {
			search_result[1].innerHTML = prayers_sorted[i].title;
			search_result[0].name = encodeURI(prayers_sorted[i].title);
			search_result[0].style.display = 'inherit';
		}
	});
}

function search_in_title_prayer(keyword, prayer) {
	title = prayer.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	title = title.toLowerCase();
	return title.includes(keyword)
}

function count_in_text_prayer(keyword, prayer) {
	text = prayer.text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	text = text.toLowerCase();
	var regex = new RegExp(keyword, 'g');
	return (text.match(regex) || []).length;
}

shareButton.addEventListener('click', function () {
	if (navigator.share) {
		let params = getUrlVars();
		if (decodeURI(params.prayer) == undefined) {
			params.prayer = "Prières sur Quotidie"
		};
		navigator.share({
			title: 'Quotidie ✝️',
			text: decodeURI(params.prayer) + '\n',
			url: window.location.href,
		})
			.then(() => console.log('Successful share'))
			.catch((error) => console.log('Error sharing', error));
	}
})


// Materials components
const chipSetEl = document.querySelector('.mdc-chip-set');
mdc.chips.MDCChip.attachTo(chipSetEl);
