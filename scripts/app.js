"use strict";

if ("serviceWorker" in navigator) {
  console.log("Service Worker is supported");

  navigator.serviceWorker
    .register("service-worker.js")
    .then(function (swReg) {
      console.log("Service Worker is registered", swReg);
    })
    .catch(function (error) {
      console.error("Service Worker Error", error);
    });
}



function updateData() {

  // Get the evangile data from the cache.
  getEvangileFromCache().then(evangile => {
    console.log('Displaying evangile info from cache')
    if (evangile) {
      document.getElementById('evangile_title').innerHTML = evangile.title.substring(11) + '.';
      document.getElementById('evangile_text').innerHTML = evangile.text;
      fix_evangile()
    }
  });

  // Get the evangile data from the network.
  getEvangileFromNetwork().then(evangile => {
    console.log('Displaying evangile info from API')
    document.getElementById('evangile_title').innerHTML = evangile.title.substring(11) + '.';
    document.getElementById('evangile_text').innerHTML = evangile.text;
    //console.log(evangile)
    fix_evangile()
  });

  // Get the saint data from the cache.
  getSaintFromCache().then(saint => {
    if (saint) {
      console.log('Displaying saint info from cache')
      let image = document.getElementById('saint_image');
      image.src = saint.image_url;
      let name = document.getElementById('saint_name');
      name.innerHTML = saint.title;
      let subtitle = document.getElementById('saint_subtitle');
      subtitle.innerHTML = saint.subtitle;
      let url = document.getElementById('saint_link');
      url.src = saint.url;
    }
  });

  // Get the saint data from the network.
  getSaintFromNetwork().then(saint => {
    console.log('Displaying saint info from API')
    let image = document.getElementById('saint_image');
    image.style.backgroundImage = "url(" + saint.image_url + ")";
    let name = document.getElementById('saint_name');
    name.innerHTML = saint.title;
    let subtitle = document.getElementById('saint_subtitle');
    subtitle.innerHTML = saint.subtitle;
    //let url = document.getElementById('saint_link');
    //url.href = saint.url;
  });
}

function init() {
  updateData();
}

init();

function getEvangileFromNetwork() {
  return fetch(`https://quotidie-pwa.herokuapp.com/get_evangile`)
    .then((response) => {
      return response.json();
    })
    .catch(() => {
      return null;
    });
}

function getSaintFromNetwork() {
  return fetch(`https://quotidie-pwa.herokuapp.com/get_saint`)
    .then(response => {
      return response.json();
    })
    .catch(() => {
      return null;
    });
}

function getEvangileFromCache() {
  if (!("caches" in window)) {
    return null;
  }
  const url = `${window.location.origin}/get_evangile/`;
  return caches
    .match(url)
    .then(response => {
      if (response) {
        return response.json();
      }
      return null;
    })
    .catch(err => {
      console.error("Error getting data from cache", err);
      return null;
    });
}

function getSaintFromCache() {
  if (!("caches" in window)) {
    return null;
  }
  const url = `${window.location.origin}/get_saint/`;
  return caches
    .match(url)
    .then(response => {
      if (response) {
        return response.json();
      }
      return null;
    })
    .catch(err => {
      console.error("Error getting data from cache", err);
      return null;
    });
}

function fix_evangile() {
  let ps = document.getElementById('evangile_text').children;
  ps[2].innerHTML = ps[2].innerHTML + " :";
  if (ps[ps.length - 1].innerHTML == "&nbsp;") {
    ps[ps.length - 1].style.display = 'none';
  }
  if (ps[ps.length - 2].innerHTML.includes('OU BIEN')) {
    ps[ps.length - 2].style.display = 'none';
  }
  if (ps[ps.length - 1].innerHTML.includes('LECTURE BREVE')) {
    ps[ps.length - 1].style.display = 'none';
    ps[ps.length - 2].style.display = 'none';
  }
  let hr = document.createElement('hr');
  ps[2].before(hr);
}
