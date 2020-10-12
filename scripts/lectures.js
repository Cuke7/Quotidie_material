// Materials components
const topAppBarElement = document.querySelector(".mdc-top-app-bar");
mdc.topAppBar.MDCTopAppBar.attachTo(topAppBarElement);

init();

function init(){
  let day = get_number_day();
  day =  Math.floor(365*Math.random());
  //console.log(day);
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


  // Adjust iframe height
  var rect = document.getElementById('iframe').getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);

}

function get_number_day(){
  let now = new Date();
  let start = new Date(now.getFullYear(), 0, 0);
  let diff = now - start;
  let oneDay = 1000 * 60 * 60 * 24;
  let day = Math.floor(diff / oneDay);
  return day;
}