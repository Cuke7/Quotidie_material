"use strict";

// Material components
const topAppBarElement = document.querySelector(".mdc-top-app-bar");
mdc.topAppBar.MDCTopAppBar.attachTo(topAppBarElement);
const switchElement = document.querySelector(".mdc-switch");
mdc.switchControl.MDCSwitch.attachTo(switchElement);

// Notification key
const applicationServerPublicKey =
  "BNgw-Zyf0z8cX2-b45_L60or_52GbSy02Nw4bp_SAJt_M6e0Y_6W4E8u7XzDCcmkGRmkjDRL53acllyHqS7B0fs";

let isSubscribed = false;
let swRegistration = null;

const pushSwitch = document.getElementById("basic-switch");
var text_notif = document.getElementById("text_notif");

const shareButton = document.getElementById("butShare");

if ("serviceWorker" in navigator && "PushManager" in window) {
  console.log("Service Worker and Push are supported");

  navigator.serviceWorker
    .register("service-worker.js")
    .then(function (swReg) {
      console.log("Service Worker is registered", swReg);
      swRegistration = swReg;
    })
    .catch(function (error) {
      console.error("Service Worker Error", error);
    });
} else {
  console.warn("Push messaging is not supported");
}

function updateData() {
  // Get the evangile data from the cache.
  getEvangileFromCache().then((evangile) => {
    if (evangile) {
      console.log("Displaying evangile info from cache");
      document.getElementById("evangile_title").innerHTML =
        evangile.title.substring(11) + ".";
      document.getElementById("evangile_text").innerHTML = evangile.text;
      fix_evangile();
    }
  });

  // Get the evangile data from the network.
  getEvangileFromNetwork().then((evangile) => {
    console.log("Displaying evangile info from API");
    console.log(evangile);
    document.getElementById("evangile_title").innerHTML =
      evangile.title.substring(11) + ".";
    document.getElementById("evangile_text").innerHTML = evangile.text;
    fix_evangile();
  });

  // Get the saint data from the cache.
  getSaintFromCache().then((saint) => {
    if (saint) {
      console.log("Displaying saint info from cache");
      console.log(saint);
      let image = document.getElementById("saint_image");
      image.src = saint.image_url;
      let name = document.getElementById("saint_name");
      name.innerHTML = saint.title;
      let subtitle = document.getElementById("saint_subtitle");
      subtitle.innerHTML = saint.subtitle;
      let url = document.getElementById("saint_link");
      url.src = saint.url;
    }
  });

  // Get the saint data from the network.
  getSaintFromNetwork().then((saint) => {
    console.log("Displaying saint info from API");
    let image = document.getElementById("saint_image");
    image.style.backgroundImage = "url(" + saint.image_url + ")";
    let name = document.getElementById("saint_name");
    name.innerHTML = saint.title;
    let subtitle = document.getElementById("saint_subtitle");
    subtitle.innerHTML = saint.subtitle;
  });
}

function init() {
  updateData();
  init_auth();
}

init();

function getEvangileFromNetwork() {
  return fetch(`https://mytrambot-bordeaux.herokuapp.com/get_evangile/`)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .catch(() => {
      return null;
    });
}

function getSaintFromNetwork() {
  return fetch(`https://mytrambot-bordeaux.herokuapp.com/get_saint/`)
    .then((response) => {
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
  const url = `https://mytrambot-bordeaux.herokuapp.com/get_evangile/`;
  return caches
    .match(url)
    .then((response) => {
      if (response) {
        return response.json();
      }
      return null;
    })
    .catch((err) => {
      console.error("Error getting data from cache", err);
      return null;
    });
}

function getSaintFromCache() {
  if (!("caches" in window)) {
    return null;
  }
  const url = `https://mytrambot-bordeaux.herokuapp.com/get_evangile/get_saint/`;
  return caches
    .match(url)
    .then((response) => {
      if (response) {
        return response.json();
      }
      return null;
    })
    .catch((err) => {
      console.error("Error getting data from cache", err);
      return null;
    });
}

function fix_evangile() {
  let ps = document.getElementById("evangile_text").children;
  ps[2].innerHTML = ps[2].innerHTML + " :";
  if (ps[ps.length - 1].innerHTML == "&nbsp;") {
    ps[ps.length - 1].style.display = "none";
  }
  if (ps[ps.length - 2].innerHTML.includes("OU BIEN")) {
    ps[ps.length - 2].style.display = "none";
  }
  if (ps[ps.length - 1].innerHTML.includes("LECTURE BREVE")) {
    ps[ps.length - 1].style.display = "none";
    ps[ps.length - 2].style.display = "none";
  }
  let hr = document.createElement("hr");
  ps[2].before(hr);
}

shareButton.addEventListener("click", function () {
  if (navigator.share) {
    navigator
      .share({
        title: "Quotidie ✝️",
        text: "Lire l'évangile du jour",
        url: "https://quotidie-netlify.app/",
      })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
  }
});

function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function initializeUI() {
  pushSwitch.addEventListener("change", function () {
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription().then(function (subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      //console.log("User IS subscribed.");
    } else {
      //console.log("User is NOT subscribed.");
    }

    updateSwitch();
  });
}

function updateSwitch() {
  if (Notification.permission === "denied") {
    text_notif.innerHTML = "Notifications push refusées";
    pushSwitch.checked = false;
    updateSubscriptionOnServer(null, null);
    return;
  }

  if (isSubscribed) {
    //text_notif.innerHTML = 'Désactiver les notifications push';
    pushSwitch.checked = true;
    document
      .getElementsByClassName("mdc-switch")[0]
      .classList.add("mdc-switch--checked");
  } else {
    //text_notif.innerHTML = 'Autoriser les notifications push';
    pushSwitch.checked = false;
    document
      .getElementsByClassName("mdc-switch")[0]
      .classList.remove("mdc-switch--checked");
  }
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    })
    .then(function (subscription) {
      console.log("User is subscribed.");
      console.log(JSON.stringify(subscription));

      updateSubscriptionOnServer(subscription, null);

      isSubscribed = true;

      updateSwitch();
    })
    .catch(function (error) {
      console.error("Failed to subscribe the user: ", error);
      updateSwitch();
    });
}

function updateSubscriptionOnServer(subscription, uid) {
  // TODO: Send subscription to application server
  if (subscription) {
    const uid = subscription.endpoint.split("fcm/send/")[1];
    let user = firebase.auth().currentUser;
    firebase
      .database()
      .ref("PWA_users/" + user.displayName)
      .set(JSON.stringify(subscription));
  } else {
    let user = firebase.auth().currentUser;
    if (user) {
      firebase
        .database()
        .ref("PWA_users/" + user.displayName)
        .remove();
    }
  }
}

function unsubscribeUser() {
  let uid;
  if (swRegistration) {
    swRegistration.pushManager
      .getSubscription()
      .then(function (subscription) {
        if (subscription) {
          uid = subscription.endpoint.split("fcm/send/")[1];
          return subscription.unsubscribe();
        }
      })
      .catch(function (error) {
        console.log("Error unsubscribing", error);
      })
      .then(function () {
        updateSubscriptionOnServer(null, uid);

        //console.log("User is unsubscribed.");
        isSubscribed = false;

        updateSwitch();
      });
  }
}

function init_auth() {
  var ui = new firebaseui.auth.AuthUI(firebase.auth());

  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        //
        return false;
      },
      uiShown: function () {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById("loader").style.display = "none";
      },
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: "popup",
    signInSuccessUrl: "/chat.html",
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      //firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: "<your-tos-url>",
    // Privacy policy url.
    privacyPolicyUrl: "<your-privacy-policy-url>",
  };

  ui.start("#firebaseui-auth-container", uiConfig);
  firebase.auth().onAuthStateChanged(function (user) {
    //console.log(user);
    if (!user) {
      document.getElementById("firebaseui-auth-container").style.display =
        "block";
      document.getElementById("notif_ui").style.display = "none";
      unsubscribeUser();
      ui.start("#firebaseui-auth-container", uiConfig);
    } else {
      document.getElementById("firebaseui-auth-container").style.display =
        "none";
      document.getElementById("notif_ui").style.display = "block";
    }
  });
}
