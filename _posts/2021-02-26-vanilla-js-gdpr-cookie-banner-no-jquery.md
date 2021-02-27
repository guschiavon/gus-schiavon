---
layout: post
title: 'Vanilla JS GDPR Cookie Banner [No jQuery!]'
preview_image: /assets/images/js-cookie-banner.jpg
subtitle: A Vanilla JS solution for GDPR compliance
short_description: >-
  A free GDPR banner & cookie script using Vanilla JavaScript for quick
  implementation.
categories:
  - javascript
tags:
  - Code Snippets
  - JavaScript
  - GDPR
---

Creating a Vanilla JavaScript (no jQuery), GDPR-compliant cookie banner was a great opportunity to put my JS skills to practice; thanks to [Andrew Mead's 'The Modern JavaScript Bootcamp](https://www.udemy.com/course/modern-javascript/){: target="_blank" rel="noopener noreferrer"}' on Udemy, my knowledge of this incredible language and its capabilities has increase exponentially.

### TL;DR

The complete GDPR cookie banner & script can be found on [this pen](https://codepen.io/gschiavon/pen/wvoWZwB){: target="_blank" rel="noopener noreferrer"}. Adaptation might be needed to suit your design and data protection. The preferences are session-unique, meaning the cookie preferences are stored in the `sessionStorage` of the client and erased once the tab is closed.

### Overview

Creating a GDPR-compliant vanilla JavaScript cookie banner requires a few things according to the GDPR European Union legislation:

1. Cookies (any of them) can only be set by user consent; they cannot be previously checked or active prior to user giving consent.
2. Cookie preferences must always be requested to the user, on each page visited
3. Cookies can only be stored for the duration of the session.

### The HTML

The cookie banner HTML structure is pretty straight forward: a fixed banner (or pop-up, whichever you prefer) with some information about cookies and a couple of choices for the user. I've opted to add a paragraph and a couple of buttons for accessibility:

```

{% raw %}
<section id="cookies-banner" class="cookies-banner bg-dark px-lg">
  <h4>We use cookies in this page</h4>
  <p class="editable txt-small">Explain here what are cookies and all</p>
  <button id="cookie-consent" class="btn txt-small" tabindex="1">
    Accept All Cookies
  </button>
  <button id="cookie-preferences" class="btn-outline--light txt-small" tabindex="1">
    Settings    
  </button>
  <div id="cookie-preferences--menu" class="hide">
    <p class="txt-small">Choose which cookies you want to allow and click "Save & Close" to save your preferences</p>
    <p class="txt-bold txt-small">Allow cookies:</p>
    <input type="checkbox" name="Strictly Necessary" id="strictly-necessary" checked>
    <label for="strictly-necessary" class="txt-small">Strictly Necessary</label>
    <input type="checkbox" name="Analytics" id="analytics">
    <label for="analytics" class="txt-small">Analytics</label>
    <input type="checkbox" name="Marketing" id="marketing">
    <label for="analytics" class="txt-small">Marketing</label>
  </div>
</section>
<button id="cookie-prefs" class="cookie-prefs flex-center" aria-label="open cookie preferences">
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6d/Windows_Settings_app_icon.png" alt="">
</button>
<div id="scripts"></div>
{% endraw %}
```

### The CSS

Pretty straight forward styles for this, just so we can see it work. Notice the utility class `hide`:

```
{% raw %}
body {
  font-family: Arial, sans-serif;
}
.overview {
  width: 80%;
  height: 50vh;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cookies-banner {
  position: fixed;
  bottom:0;
  left: 0;
  width: 100%;
  height: auto;
 
}
.btn,
  [class*=btn-outline] {
    padding: 0.5rem;
  }
.btn-outline {
  color         : whitesmoke;
  border-color  : inherit;
}
.cookie-prefs {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  background-color: $light-color;
  box-shadow: 0 3px 5px rgba(103, 103, 103, 0.605);
  height: 45px;
  width: 45px;
  border-radius: 50%;
  transform: rotate(-90deg);
  z-index: -1;
}
button img {
  width: 24px;
}
.hide {
  display: none;
}

.px-lg {
  padding: 2rem;
}

.bg-dark {
  background-color: #888;
}
{% endraw %}
```

### The JavaScript

Here's where the fun begins: we will use Vanilla JavaScript (no jQuery) to perform the following:

* Set cookies according to user preferences
* Allow users to review their cookie preferences and update the scripts accordingly at any point
* Remember user preferences during the session to prevent annoying cookie banner pop-ups (warning: NOT 100% GDPR-EU COMPLIANT\!)

The preferences are session-unique, meaning the cookie preferences are stored in the `sessionStorage` of the client and erased once the tab is closed. I've opted for sessionStorage as it is merely a client-side function.

#### Variables

First, we need to establish the variables:

```
{% raw %}
// Cookie banner
// Variables & Constants
const cookiePrefs = document.getElementById("cookie-preferences");
const toggleCookiePrefs = document.getElementById("cookie-prefs");
const cookieBanner = document.getElementById("cookies-banner");
const cookieChoices = document.getElementById("cookie-preferences--menu");
const cookieConsent = document.getElementById("cookie-consent");
const scripts = document.getElementById("scripts");
const strictConsent = document.getElementById("strictly-necessary");
const analyticsConsent = document.getElementById("analytics");
const marketingConsent = document.getElementById("marketing");
let savedPrefs = sessionStorage.getItem("consents");

// function to create DOM element

const cookies = [
  {
    type: "strictly-necessary",
    path: [],
  },
  {
    type: "analytics",
    path: [],
  },
  {
    type: "marketing",
    path: [],
  },
];

// Set cookies that have the same data-cookie-type than data-consent-type
const checkboxes = cookieChoices.querySelectorAll("input");

// For banner preferences
let clicks = 0;
{% endraw %}
```

Here we have established a few variables to be called at a later stage. The `cookies` variable is the array where we will define our cookies; should you have more than 3 **types** of cookies, you should update this array with a new object, and also create a **new variable** (or constant) named `yourNewTypeConsent`, where `yourNewType` is the type of cookie you want to set up. You'll also need to **add a new checkbox on the HTML**.

The `path` key presents an array where you should set your scripts `src` attribute value, **as a string**, and separated by comma.

#### Callback Functions

Now we will create callback functions to be executed later in the logic. Here they are:

```

{% raw %}
// **** Callback functions ****

/* create element */
const createEl = function (p, t) {
  const el = document.createElement("script");
  const att = document.createAttribute("data-cookie-type");
  const src = document.createAttribute("src");
  src.value = p;
  att.value = t;
  el.setAttributeNode(att);
  el.setAttributeNode(src);
  return scripts.appendChild(el);
};

/* Set cookies according to preferences with the cookies array */
function setCookie(arr, type) {
  arr.forEach(function (obj) {
    if (obj.type === type) {
      let paths = obj.path;
      paths.forEach(function (path) {
        createEl(path, type);
      });
    };
  });
};

/* check preferences */
function checkPrefs(checkbox) {
  if (checkbox.checked) {
    let type = checkbox.dataset.consentType;
    let index = consents.indexOf(type);
    if (index === -1) {
      consents.push(type);
      sessionStorage.clear();
      sessionStorage.setItem("consents", consents);
    }
  } else if (!checkbox.checked) {
    let type = checkbox.dataset.consentType;
    let index = consents.indexOf(type);
    if (index !== -1) {
      consents.splice(index, 1);
      sessionStorage.clear();
      sessionStorage.setItem("consents", consents);
    }
  }
}

{% endraw %}
```

Let's go one-by-one:

1\. Create element

This function will manipulate the DOM and inject a `<script>` tag inside a container (`<div id="scripts">`) with their respective attributes passed on (`src` and `data-cookie-type`).

2\. Set Cookies

This function will check how many iterations of the `createEl()` function; for example, if the cookie type `marketing` has 3 `paths`, then it will create an element with the path and inject in the DOM.

3\. Check Preferences

This callback checks the user preferences and updates the sessionStorage according to the user's choices. It will:

\- check which of the checkboxes have been ticked<br>\- clear the session storage before setting the preferences<br>\- set the preferences on sessionStorage

### Adding the logic

Now let's add the JavaScript logic behind setting the cookies:

```
{%raw%}
// displays the cookie banner on click
toggleCookiesPrefs.addEventListener('click', function () {
  cookieBanner.classList.remove('hide')
})

// We create an empty array to store the preferences, as strings 
let consents = []

// Creates an array from the scripts that are currently in the DOM
let activeScripts = scripts.children;

// Preferences

// Remember session preferences
if (savedPrefs) {  
  cookieBanner.classList.add('hide')
  let preferences = sessionStorage.getItem("consents").split(",");
  preferences.forEach(function (type) {
    setCookie(cookies, type);
  });
} else if (!savedPrefs) {  
  cookieBanner.classList.remove('hide')
}

// Logic
cookiePrefs.addEventListener("click", function () {
  // increases the clicks by 1 when clicked
  clicks++;
  // checks if the clicks are odd
  isOdd = (clicks) => {clicks % 2 == 1}
  // If clicks are odd, then update button text content and display the cookie choices
  if (isOdd(clicks)) {
    this.textContent = "Save and Close";
    cookieChoices.classList.remove("hide");
    // When clicking on the "Save & Close" button, clear the container innerHTML, check which checkboxes are checked and then set the cookies inside the container, reset the click count
    this.addEventListener("click", function () {
      scripts.innerHTML = ''
      // Checks the consent status and updates the sessionStorage
      checkboxes.forEach(function (checkbox) {
        checkPrefs(checkbox)       
      });
      // checks which cookies are being allowed and then sets the script inside the 'id="scripts"' tag
      let preferences = sessionStorage.getItem('consents').split(',')
      preferences.forEach(function(type){
        setCookie(cookies, type)
      })
      // zeros the clicks
      let clicks = 0
    });
  } else if ((clicks === 0)) {
    this.textContent = "Configure";
  } else {
    this.textContent = "Configure";
    cookieBanner.classList.add("hide");
    cookieChoices.classList.add("hide");
  }
});

// Consent to all cookies
cookieConsent.addEventListener("click", function () {
  let consents = []
  scripts.innerHTML = "";
  cookies.forEach(function (cookie) {
    const cPaths = cookie.path;
    const cType = cookie.type;
    for (let i = 0; i < cPaths.length; i++) {
      createEl(cPaths[i], cType);
    }
    consents.push(cType);
  });
  sessionStorage.setItem('consents', consents);
  cookieBanner.classList.add('hide');
});

{%endraw%}
```

Note that we clear the consents array and the `innerHTML` of the `<scripts id="scripts">` tag whenever new preferences are passed; this way we ensure only the allowed cookies are set.

### Fully GDPR-compliant

If you want to make it fully GDPR compliant, then remove the conditional logic which checks for `savedPrefs`; this way the cookie banner will pop up in every single page despite the user's choices.

What do you think? Would you do it any differently? How can I improve this? You can check [this pen](https://codepen.io/gschiavon/pen/wvoWZwB){: target="_blank" rel="noopener noreferrer"} for the full working example.