---
layout: post
title: Jekyll Lazyloading Responsive Images
subtitle: "Faster Jekyll Static Sites"
short_description: "Responsive, lazyloading images can help us optimize the loading speed by reducing the amount of data transferred, thus improving the site's performance"
categories:
  - Jekyll
  - SSG
tags: 
  - Jekyll
  - Lazy loading
  - Responsive images
  - CloudCannon
---
## Using jekyll-responsive-image with lazysizes

### Overview

Web optimized images (that is, in various sizes and compression) and lazy loading images are our friends when it comes to page load speed. This "dynamic duo" is a powerful ally to crush the score at Google's PageSpeed. Providing images in a `srcset` attribute allows the browser to choose which resolution to load according to various screen sizes and even resolution (pixel density), and telling the browser **when** to load them will also support faster loading times, as some images will load after the initial styles are rendered by the browser or better, not at all depending on user scroll behaviour, which saves bandwidth and makes page loading less expensive of a task.

Optimizing images for web is a time-consuming task. Resizing, optimizing and organizing them can take a great deal of effort when all we want to do is code. This implementation aims at **automating the process of image optimization and link it to lazy loading image capabilities for optimal performance**.

For this we're going to use `jekyll-responsive-image` plugin by [Joseph Wynn](https://github.com/wildlyinaccurate){:target="_blank"}{:rel="noreferrer"} together with [Alexander Farkas](https://github.com/aFarkas/){:target="_blank"}{:rel="noreferrer"} `lazysizes` to render lazy loading and responsive images with Jekyll.

### Setup:

We need to install the following dependencies & plugins:

#### rmagick

This is required to generate the different image sizes automatically.
- Run `brew install imagemagick` on MacOS or follow the [Rmagick installation documentation](https://github.com/rmagick/rmagick){:target="_blank"}{:rel="noreferrer"}
- Add `gem 'rmagick'` to our project's `Gemfile`
- Run `bundle install` on Terminal (make sure you are in the project's root folder for this)

#### lazysizes

- Head to [lazysizes](https://github.com/aFarkas/lazysizes){:target="_blank"}{:rel="noreferrer"} to download the script. Copy the code and paste it in a file called `lazysizes.min.js` and save it in the appropriate folder (i.e. `/js`).
- Let's add `<script src="/js/lazysizes.min.js" async=""></script>` to our markup (i.e. end of `body` tag)
- That's it for now!

#### jekyll-responsive-image

- Install [jekyll-responsive-image](https://github.com/wildlyinaccurate/jekyll-responsive-image){:target="_blank"}{:rel="noreferrer"} in project by adding `gem ‘jekyll-responsive-image’` to the Gemfile and running `bundle install`
- In our `_config.yml` file, we should add the following:

```
plugins:
  - jekyll-responsive-image
```

- Inside the `_includes` folder, we will create a base image template file, name it `dynamic-image.html` or *anything we want*. The file should contain a basic code like this (we can adjust this template to your needs):

```
{% raw %}
{% capture srcset %}
    {% for i in resized %}
        /{{ i.path }} {{ i.width }}w,
    {% endfor %}
{% endcapture %}

{% endraw %}

<img data-src="/{{ path }}" alt="{{ alt }}" data-srcset="{{ srcset | strip_newlines }}" class="lazyload">
```

The `data-src` will pull the `jekyll-responsive-image` generated images into the tag and make it available to `lazysizes` for lazy loading!

> We can define any class we want in the `class` attribute but it *is compulsory to put class `lazyload` for lazysizes to work* in conjunction with jekyll-responsive-image. We can play around with the template and create multiple versions to suit our needs (more on that later).

#### Configuration

- Let's configure the plugin by adding the following code to our `_config.yml` file:

```
responsive_image:
  template: _includes/dynamic-image.html # the name of the template file should match the created template
  base_path: assets # update this to match the path to your image folder (default: assets)
  output_path_format: assets/srcset/%{width}/%{basename} # the destination path for the resized images; configure to suit your project structure
```

- There's a variety of configurations for the plugin (check the [documentation](https://github.com/wildlyinaccurate/jekyll-responsive-image){:target="_blank"}{:rel="noreferrer"}) but *one to have particularly handy is the `sizes` configuration*, which tells the plugin what image size versions to generate for the `srcset`. Our `_config.yml` will look like this:

```
responsive_image:
   template: _includes/dynamic-image.html
   base_path: assets
   sizes:
    - width: 480  # [Required] How wide the resized image will be.
      quality: 80 # [Optional] Overrides default_quality for this size. The default is 90
    - width: 800
    - width: 1400
      quality: 90
```

- Let's save it and reload Jekyll

### Implementation

Now, in place of any `<img>` tags, we should instead use any of the following structures:

For a simple static image:

```
{%raw%}{% responsive_image path: assets/my-file.jpg %}{%endraw%}
```

Or for more attributes like adding `alt` or `title` to an image, we follow this syntax:

```
{%raw%}{% responsive_image path: assets/image.jpg alt: "Lorem ipsum..." title: "Lorem ipsum..." %}{%endraw%}
```

Or for greater versatility of use, we can play with Liquid attributes, conditional logic and pull values from frontmatter like so:

```
---
image: /assets/placeholder-1.jpg
image-alt: Chill, it's just a placeholder...
---
{%raw%}
{% assign path = page.image %}
{% assign alt = page.image-alt %}

{% responsive_image_block %}
  path: {{ path }}
  alt: {{ alt }}
{% if title %}
  title: {{ title }}
  {% endif %}
{% endresponsive_image_block %}
{%endraw%}
```

To which the output will be:

```
<img data-src="/assets/placeholder-1.jpg" alt="Chill, it's just a placeholder"
     data-srcset=" /assets/srcset/480/placeholder-1.jpg 480w,
                   /assets/srcset/800/placeholder-1.jpg 800w,
                   /assets/srcset/1400/placeholder-1.jpg 1400w,"
                   class="lazyload">
```

Where the image's size is relative to the `sizes` declared on the `_config.yml` and the `width` is relative to the viewport width. We can fiddle with the template to render images related to the pixel density and all sorts of things...
*IMPORTANT:* Data inside the `responsive_image_block` follows YAML syntax, so indentation is important!

- As for multiple `responsive_image_block` templates, we can override the default from the `_config.yml` by declaring the template to be used, like so:

```
---
image: /assets/placeholder-1.jpg
image-alt: Chill, it's just a placeholder...
---
{% raw %}
{% assign path = page.image %}
{% assign alt = page.image-alt %}

{% responsive_image_block %}
  template: another-img-template.html # Add the template override reference here
  path: {{ path }}
  alt: {{ alt }}
{% if title %}
  title: {{ title }}
  {% endif %}
{% endresponsive_image_block %}

{% endraw %}
```

### Troubleshooting & Comments
Got a better way of mixing these two? Think we can make it even better? There are some more improvements to be had, but that's subject to another post!

