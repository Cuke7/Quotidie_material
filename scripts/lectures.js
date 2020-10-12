// Materials components
const topAppBarElement = document.querySelector(".mdc-top-app-bar");
mdc.topAppBar.MDCTopAppBar.attachTo(topAppBarElement);
mdc.ripple.MDCRipple.attachTo(document.querySelector('#button_link1'));
mdc.ripple.MDCRipple.attachTo(document.querySelector('#button_link2'));

let buttons_link = [
  document.getElementById('button_link1'),
  document.getElementById('button_link2'),
]

init();

function init(){
  let day = get_number_day()-1;
  //day =  Math.floor(365*Math.random());
  console.log(day);
  //day = 159;
  //day = 38;
  //document.getElementById('reference').innerHTML = "Référence du jour (" + data[day][2] + ")";
  let reading_texts = data[day][1].split('&');
  let output = [];
  for (const reading_text of reading_texts) {
    let reading_text_trimed = reading_text.trim();
    let book = reading_text_trimed.split(' ')[0];

    let chapter_start = 1;
    let chapter_end = undefined;

    if(book != reading_text_trimed){
      let chapters = reading_text_trimed.split(' ')[1];
      chapter_start = chapters.split('-')[0];
      if(chapters.split('-').length > 1){
        chapter_end = chapters.split('-')[1];
      }else{
        chapter_end = chapter_start;
      }
    }

    output.push({'book': book, 'chapter_start': chapter_start, 'chapter.end': chapter_end});

  }
  document.getElementById('readings').innerHTML = "Références du jour : " + data[day][1];
  console.log(output);

  for (let i = 0; i < output.length; i++) {
    const ref = output[i];
    buttons_link[i].children[0].innerHTML = ref.book + " " + ref.chapter_start;
    buttons_link[i].style.display = "inline-block";
    buttons_link[0].parentElement.href = "https://www.aelf.org/bible/"+ref.book + "/" + ref.chapter_start;
  }

  for (const ref of output) {
    console.log(ref);
    let button = document.createElement('button');
    
  }
}

function get_number_day(){
  let now = new Date();
  let start = new Date(now.getFullYear(), 0, 0);
  let diff = now - start;
  let oneDay = 1000 * 60 * 60 * 24;
  let day = Math.floor(diff / oneDay);
  return day;
}