---
layout: post
title: CloudCannon Theme Settings
subtitle: Setting up a theme with Jekyll
short_description: Learn how to implement a theme settings feature for your Jekyll websites deployed on CloudCannon CMS
categories:
  - Jekyll
  - SSG
tags:
  - Sass
  - CloudCannon
  - CSS Variables
---

## Enable site-wide settings using Jekyll and Sass

*This tutorial works really well for Jekyll sites hosted on&nbsp;[CloudCannon CMS](https://cloudcannon.com/){: rel="nofollow"}{:target="_blank"}*.

### Overview

Thanks to [Lily Bruns](https://lilybruns.com) to encouraging me to learn this\! Here's the background story…

Lily asked me to implement a&nbsp;**structure that allows editors to easily change basic settings on their CloudCannon site**, like colors, fonts, logos, etc without having to fiddle with code files. The projects are hosted on&nbsp;[**CloudCannon**](https://cloudcannon.com/){: rel="nofollow"}{:target="_blank"}, a CMS for Jekyll which is quite awesome. The objective was to&nbsp;*allow editors to use the CMS's UI for intuitive changes*&nbsp;of these settings, without having to go to a \_config.yml file or similar.

After some preliminary analysis I've opted to work with Sass instead of CSS Variables as it is much more powerful for this set up. With that said, it will still work with plain CSS Variables.

### Before we start…

Please note that this process breakdown&nbsp;**assumes familiarity with Sass**; FreeCodeCamp has this&nbsp;[great tutorial](https://www.youtube.com/watch?v=_a5j7KoflTs){: rel="nofollow"}{:target="_blank"}&nbsp;that covers some of the basic functions (don't be scared by the 2hr-length: focus on the first half hour for a good insight on how Sass works).

### Set-up & Folder Structure

1. First, let's install a Sass/SCSS processor on our code editor (Atom, etc.). This will ensure that `scss` files are processed into `css` when we save them.
2. Next, let's set up our folder structure as usual; let's also add some markup to our `index.html` file for reference.
3. Then, we create a `main.scss` file and place it on our styles folder: this is our&nbsp;**main**&nbsp;scss file which Jekyll will render.
4. We can create a `_sass` folder and include all our&nbsp;**Sass partials**, mixins and all here (the Sass '@import' partials).
5. Next, we create a `_data`&nbsp;***folder***&nbsp;and create a `settings.yml`&nbsp;***file***&nbsp;inside of it: this is where we will put all the variable values for Jekyll to output from Liquid tags.

### Implementation ("Jekyllfy Sass")

#### Configuring your `settings.yml` file

We should set up the structure & values of our variables here. Colors, font embed codes, images, etc… Anything we want to have on the CloudCannon user interface. This will allow CloudCannon to display these keys in a user-friendly interface on their Explore view. They have a nice database of keys which are displayed with their own UI, which we can refer to&nbsp;[here](https://docs.cloudcannon.com/editing/interfaces/inputs/){: rel="nofollow"}. As an example:

```
general_settings:
  site_title: My awesome site
  site_url: 'https://example.com'
  preview_image:
  social:
    - icon: "LinkedIn"
      url: 'https://linkedin.com/'
    - icon: "Github"
      url: 'https://github.com/'
theme:
  heading_font_family: '"Glegoo", serif;'
  body_font_family: '"Bitter", serif;'
  dark_color: '#222'
  light_color: '#d2d2d2'
  accent_color: '#1fc71f'
seo:
  description_text:
  fb_app_id:
  keywords: []
configuration:
  head_code_block: '
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/gridlex/2.7.1/gridlex.min.css">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,200;0,300;0,400;0,700;1,200;1,300;1,400&family=Glegoo:wght@400;700&display=swap" rel="stylesheet">'
  body_code_block:
```

Note that some of these keys have&nbsp;***underscore***&nbsp;rather than a&nbsp;*dash*; this syntax allows CloudCannon to read the keys and provide the friendly UI for editors, so definitely&nbsp;[check their documentation](https://docs.cloudcannon.com/editing/interfaces/inputs/){: rel="nofollow"}&nbsp;for more detailed information.

#### Configuring the `main.scss` file

The `main.scss` file needs to have empty Front Matter for Jekyll to process it;&nbsp;**we do so by adding 2 lines of 3 dashes `(—--)` at the top of the file**. So:

```
{%raw%}
---
---
// Write your SCSS from here onwards
{%endraw%}
```

Write our `scss` normally, and where we'd normally place the value for the Sass variables (that is, in our `main.scss` stylesheet), we place a Liquid tag to pass the values from the `settings.yml` file. Following this project's example,&nbsp;*in our `main.scss` file*, instead of:

`{%raw%}$dark_color: '#222';{%endraw%}`

we should set:

`{%raw%}$primary_color: {{site.data.settings.theme.dark_color}}{%endraw%};`

### Overall, the `main.scss` file should look something like this:

```
{%raw%}
---
---
// note the 2 lines of dashes with empty front matter above: that's what tell Jekyll to process this file
// describe your Sass variables BEFORE you add partials that take these values (like universal styles) otherwise Jekyll will throw an error as it cannot parse the information for the partials

$dark_color:  {{site.data.settings.colors.primary_color}};
$light_color: {{site.data.settings.colors.secondary_color}};

// write your SCSS from here, for example:

h1 {
  color: $dark_color;
}
body {
  background-color: $light_color;
}

// or a better alternative, add partials from the _sass folder to render the stylesheet:

@import
  '_resets',
  '_typography';
{%endraw%}
```

#### IMPORTANT: settings for `_config.yml` when using scss partials

In case we are using partials, we must add the following code to our `_config.yml` file:

```
{%raw%}
sass:
  sass_dir: _sass
{%endraw%}  
```


NB:&nbsp;*This is the path for the directory storing the scss partials; we can configure it to suit our project structure.*

### Reference repo

Here's a reference repository to peek into some code:&nbsp;[Jekyllfy Sass](https://github.com/guschiavon/jekyllfy-sass)

## Troubleshooting

Personally I have run into errors when trying to populate&nbsp;***variables located in partials***&nbsp;with YAML values, so the work around is to have all the Sass variables on our main SCSS file and use `@import` for the actual styles. Also, we&nbsp;*cannot*&nbsp;process Sass partials with Jekyll (meaning we cannot have empty frontmatter `(--—)` in the partial files). At least it didn't work for me, so if you know more, please get in touch and let me know how to do it!