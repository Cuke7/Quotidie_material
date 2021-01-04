// Materials components
const topAppBarElement = document.querySelector(".mdc-top-app-bar");
mdc.topAppBar.MDCTopAppBar.attachTo(topAppBarElement);
mdc.list.MDCList.attachTo(document.querySelector(".mdc-list"));

let week_day = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

let elem = null;

init();

scrollToSelection = function () {
  elem.scrollIntoView();
};

function init() {
  let day = get_number_day();
  day = day + 32;
  console.log(day);

  for (i = 0; i < data.length; i++) {
    add_list_element(week_day[i % 7] + " " + data[i][2], data[i][1]);
    if (i == day - 1) {
      elem = document.querySelector(".mdc-list--two-line").lastChild;
    }
    if (i == day) {
      document.querySelector(".mdc-list--two-line").lastChild.style.color =
        "green";
    }
    if (i % 7 == 6) {
      document
        .querySelector(".mdc-list--two-line")
        .appendChild(document.createElement("hr"));
      //document.querySelector(".mdc-list--two-line").lastChild.style.color = ("green");
    }
  }
  setTimeout(function () {
    scrollToSelection();
  }, 200);
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
