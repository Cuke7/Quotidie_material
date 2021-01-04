// Materials components
const topAppBarElement = document.querySelector(".mdc-top-app-bar");
mdc.topAppBar.MDCTopAppBar.attachTo(topAppBarElement);
mdc.ripple.MDCRipple.attachTo(document.querySelector("#button_link1"));
mdc.ripple.MDCRipple.attachTo(document.querySelector("#button_link2"));
mdc.list.MDCList.attachTo(document.querySelector(".mdc-list"));

// Boutons liens AELF
let buttons_link = [
  document.getElementById("button_link1"),
  document.getElementById("button_link2"),
];

let week_day = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

init();

function init() {
  // Numéro du jour de l'année
  let day = get_number_day();
  day = day + 32;
  console.log(day);

  // Objet qui contient la référence de lecture du jour
  let output = get_ref_object(day);

  // MAJ du texte d'intro
  document.getElementById("readings").innerHTML =
    " Références du jour : <b>" + data[day][1] + ".</b>";

  // Unmask les boutons liens en fonction du nombre de référence de lectures
  for (let i = 0; i < output.length; i++) {
    const ref = output[i];
    buttons_link[i].children[0].innerHTML = ref.book + " " + ref.chapter_start;
    buttons_link[i].style.display = "inline-block";
    buttons_link[i].parentElement.href =
      "https://www.aelf.org/bible/" + ref.book + "/" + ref.chapter_start;
    buttons_link[i].parentElement.href =
      "https://www.aelf.org/bible/" + ref.book + "/" + ref.chapter_start;
  }

  //Cherche le nom du jour actuel
  let sunday = day - (day % 7);
  let saturday = day + (6 - (day % 7));

  let temp = 0;

  for (i = sunday; i <= saturday; i++) {
    add_list_element(week_day[temp] + " " + data[i][2], data[i][1]);
    temp++;
    if (i == day) {
      document.querySelector(".mdc-list--two-line").lastChild.style.color =
        "green";
    }
  }
}

function get_ref_object(day_temp) {
  let day = day_temp;

  let reading_texts = data[day][1].split("&");
  let output = [];
  for (const reading_text of reading_texts) {
    let reading_text_trimed = reading_text.trim();
    let book = reading_text_trimed.split(" ")[0];

    let chapter_start = 1;
    let chapter_end = undefined;

    if (book != reading_text_trimed) {
      let chapters = reading_text_trimed.split(" ")[1];
      chapter_start = chapters.split("-")[0];
      if (chapters.split("-").length > 1) {
        chapter_end = chapters.split("-")[1];
      } else {
        chapter_end = chapter_start;
      }
    }

    output.push({
      book: book,
      chapter_start: chapter_start,
      "chapter.end": chapter_end,
    });
  }

  return output;
}

function get_number_day() {
  let now = new Date();
  let start = new Date(now.getFullYear(), 0, 0);
  let diff = now - start;
  let oneDay = 1000 * 60 * 60 * 24;
  let day = Math.floor(diff / oneDay);
  return day;
}

function add_list_element(text1, text2) {
  let li = document.createElement("li");
  li.classList.add("mdc-list-item");
  let span1 = document.createElement("span");
  span1.classList.add("mdc-list-item__ripple");
  let span2 = document.createElement("span");
  span2.classList.add("mdc-list-item__text");
  li.appendChild(span1);
  li.appendChild(span2);

  let span3 = document.createElement("span");
  span3.classList.add("mdc-list-item__primary-text");
  let span4 = document.createElement("span");
  span4.classList.add("mdc-list-item__secondary-text");

  span2.appendChild(span3);
  span2.appendChild(span4);

  span3.innerHTML = text1;
  span4.innerHTML = text2;

  document.querySelector(".mdc-list--two-line").appendChild(li);
}
