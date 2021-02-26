---
layout: post
title: 'Vanilla JS GDPR Cookie Banner [No jQuery!]'
preview_image:
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

The complete GDPR cookie banner & script can be found on [this pen](https://codepen.io/gschiavon/pen/wvoWZwB){: target="_blank" rel="noopener noreferrer"}. Adaptation might be needed to suit your design and data protection.

### Overview

Creating a GDPR-compliant vanilla JavaScript cookie banner requires a few things according to the GDPR European Union legislation:

1. Cookies (any of them) can only be set by user consent; they cannot be previously checked or active prior to user giving consent.
2. Cookie preferences must always be requested to the user, on each page visited
3. Cookies can only be stored for the duration of the session.

### The HTML

The cookie banner HTML structure is pretty straight forward: a fixed banner (or pop-up, whichever you prefer) with some information about cookies and a couple of choices for the user. I've opted to add a paragraph and a couple of buttons for accessibility:

```

{% raw %}
<section class="overview">
  <h1>Set Session Cookie Preferences</h1>
  <p>A GDPR-EU compliant, Vanilla JS solution to add cookies according to user preferences.</p>
  <ol>
   <li>Cookie preferences are stored in the sessionStorage of the client; you can access this information under the Application tab of the Dev Tools.</li>
  <li>Open Dev Tools and find the '#scripts' tag to see the script in action.</li>
    <li>Style it to your liking...</li>
  </ol>
</section>
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
* Remember user preferences during the session to prevent annoying cookie banner pop-ups (warning: NOT 100% GDPR COMPLIANT\!)

#### Variables

First, we need to establish the variables:

```
{% raw %}
// Cookie banner
// Variables & Constants
const cookiePrefs = document.getElementById("cookie-preferences");
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
