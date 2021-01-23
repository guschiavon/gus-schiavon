---
layout: post
title: Responsive Gallery with Vanilla JavaScript [ES6]
preview_image: /assets/images/js-gallery-cover.jpg
subtitle: A slim & responsive gallery for use with Jekyll 
short_description: In this post we will create a responsive gallery using vanilla JavaScript and loop through an array of images using Jekyll
categories:
  - JavaScript
  - Jekyll
tags:
  - Code Snippets
  - Responsive Gallery
  - Jekyll
  - JavaScript
---
## Responsive Gallery with Vanilla JavaScript (ES6)

### Overview

Nowadays it's so easy to make use of existing tools and pre-written code to add features to our projects. The issue with these is the chance of conflicts and issues when it comes to implementations using code written by multiple collectives or individuals. In this post we will cover the step-by-step process to create a **responsive image gallery using vanilla JavaScript** and Jekyll SSG which is simple enough and gives us some good insights on how JS works on the browser.

**We will cover:**
- [Responsive Gallery with Vanilla JavaScript (ES6)](#responsive-gallery-with-vanilla-javascript-es6)
  - [Overview](#overview)
  - [Setup](#setup)
  - [How to create a Jekyll Image Gallery using HTML & CSS](#how-to-create-a-jekyll-image-gallery-using-html--css)
    - [The HTML](#the-html)
    - [The CSS](#the-css)
    - [The JavaScript](#the-javascript)
  - [Troubleshooting](#troubleshooting)

### Setup

This tutorial assumes you have [Jekyll](https://jekyllrb.com/){:target="_blank"}{:rel="noreferrer"} installed on your system and that you are familiar with this library and [Liquid syntax](https://shopify.github.io/){:target="_blank"}{:rel="noreferrer"}.

We should also add [Gridlex CSS flexbox library](https://gridlex.devlint.fr/){:target="_blank"}{:rel="noreferrer"} to the `head` tag of our main Jekyll layout (`default.html` layout or whichever is the one you are using). Copy the below snippet or head to [Gridlex's site](https://gridlex.devlint.fr/){:target="_blank"}{:rel="noreferrer"} to get the latest version:

```
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/gridlex/2.7.1/gridlex.min.css">
```

### How to create a Jekyll Image Gallery using HTML & CSS
#### The HTML

We'll go step-by-step so we can check the layout is working before iterating over the `YAML` array. Let's start by adding some `HTML` to our page:

```
---
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/gridlex/2.7.1/gridlex.min.css">
  <link rel="stylesheet" href="/main.css">
</head>
<body>
{% raw %}
<section class="listing-gallery">
  <div class="grid-noGutter">
    <div class="col-12 listing-gallery-img-lg">
      <img id="active-img" src="/your-placeholder-image-url-here.jpg" alt="A description of the image" class="responsive-img">
    </div>
    <div class="col-12 grid-noGutter">
      <div class="col-3_md-4_sm-6 listing-gallery-img-sm">
        <img src="/your-placeholder-image-url-here.jpg" alt="A description of the image" class="listing-gallery-img responsive-img">
      </div>      
      <div class="col-3_md-4_sm-6 listing-gallery-img-sm">
        <img src="/your-placeholder-image-url-here.jpg" alt="A description of the image" class="listing-gallery-img responsive-img">
      </div>      
      <div class="col-3_md-4_sm-6 listing-gallery-img-sm">
        <img src="/your-placeholder-image-url-here.jpg" alt="A description of the image" class="listing-gallery-img responsive-img">
      </div>      
      <div class="col-3_md-4_sm-6 listing-gallery-img-sm">
        <img src="/your-placeholder-image-url-here.jpg" alt="A description of the image" class="listing-gallery-img responsive-img">
      </div>      
    </div>
  </div>
</section> 
{% endraw %}
</body>
</html>
```
> What we got here is: a `section` which serves as the container for the gallery; by leveraging Gridlex, we then create a flexbox grid using the `grid-noGutter` class. The first image is a larger image, which we have given an `id="active-img` and a class of `listing-gallery-img-lg`. This is wrapped in a `col-12` class, which Gridlex understands as a **full-width container** inside the `grid-noGutter` container. Directly below it, we have another full-width container (`col-12`) which **is also a `grid-noGutter`**. The children of this new grid are smaller images (thumbnails if we may), which all take Gridlex's `col-3_md-4_sm-6` class (each image takes 3 columns on large screens, 4 columns on mid-width screens and 6 columns on small screens and below, all relative to the grid's full width).

We should now have one large image and 4 small thumbnails (previews) below it. Once this is true, we can refactor the code using Liquid tags to iterate over the frontmatter array, like so:

{% highlight html %}

---
gallery:
  - image: /assets/images/image-1.jpg
    alt_text: Some alt text
  - image: /assets/images/image-2.jpg
    alt_text: Some alt text
  - image: /assets/images/image-3.jpg
    alt_text: Some alt text
  - image: /assets/images/image-4.jpg
    alt_text: Some alt text
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/gridlex/2.7.1/gridlex.min.css">
    <link rel="stylesheet" href="/main.css">
  </head>
  <body>
    {% raw %}
    <section class="listing-gallery">
      <div class="grid-noGutter">
        <div class="col-12 listing-gallery-img-lg">
          {% for img in page.gallery %}
          {% if forloop.first %}
            <img id="active-img" src="{{img.image}}" alt="{{img.alt_text}}" class="responsive-img">
          {% endif %}
          {% endfor %}
        </div>
        <div class="col-12 grid-noGutter">
          {% for img in page.gallery %}
          <div class="col-3_md-4_sm-6 listing-gallery-img-sm">
            <img src="{{img.image}}" alt="{{img.alt_text}}" class="listing-gallery-img responsive-img">
          </div>
          {% endfor %}
        </div>
      </div>
    </section> 
    {% endraw %}
  </body>
</html>
{% endhighlight %}

> By using the `forloop` statement we can refactor the code to iterate over the content of the page's `gallery` array, making the code more maintainable. Note the `if` statement on the large image block: that will output the first image of the `gallery` array.

#### The CSS

Now that the markup is ready, we will write some CSS to make it look nice.

{%highlight css%}

// Gallery
#active-img {
  opacity: 1;
}

.listing-gallery img {
  cursor: pointer;
}

.listing-gallery-img-lg,
.listing-gallery-img-sm {
  border: 5px solid white;
}

.listing-gallery-img-lg {
  height: 600px;
  overflow: hidden;
}

.listing-gallery-img-sm {
  height: 200px;
  overflow: hidden;
}

.listing-gallery-img {
  opacity: 0.6;
  transition: 0.2s all;
}

.listing-gallery-img.selected {
  opacity: 1;
  transition: 0.2s all;
}

.responsive-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

{%endhighlight%}

> Pretty simple CSS uses, with the `#active-img` selector for the active image (the large image) and the `responsive-img` class using the `object-fit` property to make the image respond as a background image (keeping aspect ratio). The `.selected` class will be added via JavaScript

#### The JavaScript

Now for the fun part: using Vanilla JavaScript to implement the gallery functionality.

**First:**

- Create a `/js` folder in your project's root directory, and add a `gallery.js` file inside it.
- Reference this file by adding the following script tag to the document's head: `<script src="/js/gallery.js" type="text/javascript"></script>`

Then we write the JS on the `gallery.js` file like this:


{% highlight javascript %}
// selects all elements with the listing-gallery-img class
const images = document.querySelectorAll(".listing-gallery-img"); 
// the active (main) image container
const activeImage = document.getElementById("active-img");
// selects the first image inside the images array (the collection of elements with the .listing-gallery-img class)
const firstImage = images[0];
// adds the 'selected' class to the first image of the array so it's not faded (see CSS)
firstImage.classList.add("selected");

// We use a JavaScript 'forloop' to iterate over the 'images' array
images.forEach((image) => {
  // for each image, listen for a 'click' on it:
  image.addEventListener("click", function () {
    // remove the 'selected' class from each image in the 'images' array
    images.forEach((image) => image.classList.remove("selected")); 
    // add the 'selected' class to the image which was clicked
    image.classList.add("selected"); 
    // check the source attribute value for the image which was clicked
    const thumbSrc = this.src;
    // change the value of the active image 'src' attribute to match that of the image clicked
    activeImage.src = thumbSrc; 
  });
});
{% endhighlight %}


That's it! You should now have a working Vanilla JavaScript responsive gallery

### Troubleshooting

Did it work? Did you have problems with it? Can I help? [Reach out to me](mailto:gus@gus-schiavon.com) 