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

\`\`\`<br>{% raw %}<br>&lt;section id="cookies-banner" class="cookies-banner bg-dark px-lg"&gt;<br>&nbsp; &lt;h4&gt;We use cookies in this page&lt;/h4&gt;<br>&nbsp; &lt;p class="editable txt-small"&gt;Explain here what are cookies and all&lt;/p&gt;<br>&nbsp; &lt;button id="cookie-consent" class="btn txt-small" tabindex="1"&gt;<br>&nbsp; &nbsp; Accept All Cookies<br>&nbsp; &lt;/button&gt;<br>&nbsp; &lt;button id="cookie-preferences" class="btn-outline–light txt-small" tabindex="1"&gt;<br>&nbsp; &nbsp; Settings &nbsp; &nbsp;<br>&nbsp; &lt;/button&gt;<br>&nbsp; &lt;div id="cookie-preferences–menu" class="hide"&gt;<br>&nbsp; &nbsp; &lt;p class="txt-small"&gt;Choose which cookies you want to allow and click "Save & Close" to save your preferences&lt;/p&gt;<br>&nbsp; &nbsp; &lt;p class="txt-bold txt-small"&gt;Allow cookies:&lt;/p&gt;<br>&nbsp; &nbsp; &lt;input type="checkbox" name="Strictly Necessary" id="strictly-necessary" checked&gt;<br>&nbsp; &nbsp; &lt;label for="strictly-necessary" class="txt-small"&gt;Strictly Necessary&lt;/label&gt;<br>&nbsp; &nbsp; &lt;input type="checkbox" name="Analytics" id="analytics"&gt;<br>&nbsp; &nbsp; &lt;label for="analytics" class="txt-small"&gt;Analytics&lt;/label&gt;<br>&nbsp; &nbsp; &lt;input type="checkbox" name="Marketing" id="marketing"&gt;<br>&nbsp; &nbsp; &lt;label for="analytics" class="txt-small"&gt;Marketing&lt;/label&gt;<br>&nbsp; &lt;/div&gt;<br>&lt;/section&gt;<br>&lt;button id="cookie-prefs" class="cookie-prefs flex-center" aria-label="open cookie preferences"&gt;<br>&nbsp; &lt;img src="https://upload.wikimedia.org/wikipedia/commons/6/6d/Windows\_Settings\_app\_icon.png" alt=""&gt;<br>&lt;/button&gt;<br>&lt;div id="scripts"&gt;&lt;/div&gt;<br>{% endraw %}<br>\`\`\`

### The CSS

Pretty straight forward styles for this, just so we can see it work. Notice the utility class \`hide\`:

\`\`\`<br>{% raw %}

body \{<br>&nbsp; font-family: Arial, sans-serif;<br>\}<br>.cookies-banner \{<br>&nbsp; position: fixed;<br>&nbsp; bottom:0;<br>&nbsp; left: 0;<br>&nbsp; width: 100%;<br>&nbsp; height: auto;<br>&nbsp;<br>\}<br>.btn,<br>&nbsp; \[class\*=btn-outline\] \{<br>&nbsp; &nbsp; padding: 0.5rem;<br>&nbsp; \}<br>.btn-outline \{<br>&nbsp; color &nbsp; &nbsp; &nbsp; &nbsp; : whitesmoke;<br>&nbsp; border-color &nbsp;: inherit;<br>\}<br>.cookie-prefs \{<br>&nbsp; position: fixed;<br>&nbsp; bottom: 1.5rem;<br>&nbsp; left: 1.5rem;<br>&nbsp; background-color: $light-color;<br>&nbsp; box-shadow: 0 3px 5px rgba(103, 103, 103, 0.605);<br>&nbsp; height: 45px;<br>&nbsp; width: 45px;<br>&nbsp; border-radius: 50%;<br>&nbsp; transform: rotate(-90deg);<br>&nbsp; z-index: -1;<br>\}<br>button img \{<br>&nbsp; width: 24px;<br>\}<br>.hide \{<br>&nbsp; display: none;<br>\}

.px-lg \{<br>&nbsp; padding: 2rem;<br>\}

.bg-dark \{<br>&nbsp; background-color: \#888;<br>\}<br>{% endraw %}<br>\`\`\`

### The JavaScript

Here's where the fun begins: we will use Vanilla JavaScript (no jQuery) to perform the following:

* Set cookies according to user preferences
* Allow users to review their cookie preferences and update the scripts accordingly at any point
* Remember user preferences during the session to prevent annoying cookie banner pop-ups (warning: NOT 100% GDPR COMPLIANT\!)

#### Variables

First, we need to establish the variables:

\`\`\`<br>{% raw %}<br>&nbsp;

*// Cookie banner*

*// Variables & Constants*

const cookiePrefs = document.getElementById("cookie-preferences");

const cookieBanner = document.getElementById("cookies-banner");

const cookieChoices = document.getElementById("cookie-preferences–menu");

const cookieConsent = document.getElementById("cookie-consent");

const scripts = document.getElementById("scripts");

const strictConsent = document.getElementById("strictly-necessary");

const analyticsConsent = document.getElementById("analytics");

const marketingConsent = document.getElementById("marketing");

let savedPrefs = sessionStorage.getItem("consents");

const cookies = \[

\{

type: "strictly-necessary",

path: \[\],

\},

\{

type: "analytics",

path: \[\],

\},

\{

type: "marketing",

path: \[\],

\},

\];

// Set cookies that have the same data-cookie-type than data-consent-type<br>const checkboxes = cookieChoices.querySelectorAll("input");

// For banner preferences<br>let clicks = 0;

{% endraw %}<br>\`\`\`

Here we have established a few variables to be called at a later stage. The \`cookies\` variable is the array where we will define our cookies; should you have more than 3 **types** of cookies, you should update this array with a new object, and also create a **new variable** (or constant) named \`yourNewTypeConsent', where \`yourNewType\` is the type of cookie you want to set up. You'll also need to **add a new checkbox on the HTML**.

The \`path\` key presents an array where you should set your scripts \`src\` attribute value, **as a string**, and separated by comma.

#### Callback Functions

Now we will create callback functions to be executed later in the logic. Here they are:

\`\`\`<br>{%raw%}

// \*\*\*\* Callback functions \*\*\*\*

// Create element<br><br>const createEl = function (p, t) \{<br>&nbsp; const el = document.createElement("script");<br>&nbsp; const att = document.createAttribute("data-cookie-type");<br>&nbsp; const src = document.createAttribute("src");<br>&nbsp; src.value = p;<br>&nbsp; att.value = t;<br>&nbsp; el.setAttributeNode(att);<br>&nbsp; el.setAttributeNode(src);<br>&nbsp; return scripts.appendChild(el);<br>\};

// Set Cookies<br><br>function setCookie(arr, type) \{<br>&nbsp; arr.forEach(function (obj) \{<br>&nbsp; &nbsp; if (obj.type === type) \{<br>&nbsp; &nbsp; &nbsp; let paths = obj.path;<br>&nbsp; &nbsp; &nbsp; paths.forEach(function (path) \{<br>&nbsp; &nbsp; &nbsp; &nbsp; createEl(path, type);<br>&nbsp; &nbsp; &nbsp; \});<br>&nbsp; &nbsp; \};<br>&nbsp; \});<br>\};

// Check Preferences<br>function checkPrefs(checkbox) \{<br>&nbsp; if (checkbox.checked) \{<br>&nbsp; &nbsp; let type = checkbox.dataset.consentType;<br>&nbsp; &nbsp; let index = consents.indexOf(type);<br>&nbsp; &nbsp; if (index === -1) \{<br>&nbsp; &nbsp; &nbsp; consents.push(type);<br>&nbsp; &nbsp; &nbsp; sessionStorage.clear();<br>&nbsp; &nbsp; &nbsp; sessionStorage.setItem("consents", consents);<br>&nbsp; &nbsp; \}<br>&nbsp; \} else if (\!checkbox.checked) \{<br>&nbsp; &nbsp; let type = checkbox.dataset.consentType;<br>&nbsp; &nbsp; let index = consents.indexOf(type);<br>&nbsp; &nbsp; if (index \!== -1) \{<br>&nbsp; &nbsp; &nbsp; consents.splice(index, 1);<br>&nbsp; &nbsp; &nbsp; sessionStorage.clear();<br>&nbsp; &nbsp; &nbsp; sessionStorage.setItem("consents", consents);<br>&nbsp; &nbsp; \}<br>&nbsp; \}<br>\}

\{% endraw % \}<br>\`\`\`

Let's go one-by-one:

1\. Create element

This function will manipulate the DOM and inject a \`&lt;script&gt;\` tag inside a container (\`&lt;div id="scripts"&gt;\`) with their respective attributes passed on (\`src\` and \`data-cookie-type\`).&nbsp;

2\. Set Cookies

This function will check how many iterations of the \`createEl()\` function; for example, if the cookie type "Marketing" has 3 \`paths\`, then it will create an element with the path and inject in the DOM.

3\. Check Preferences

This callback checks the user preferences and updates the sessionStorage according to the user's choices. It will:

\- check which of the checkboxes have been ticked<br>\- clear the session storage before setting the preferences<br>\- set the preferences on sessionStorage
