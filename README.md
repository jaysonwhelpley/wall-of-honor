# wall-of-honor
Audio story wall for the Jesus Film Project tour.

Created in October/November 2020 by Jayson Whelpley and Drew Warkentin

## Directory Structure
```index.html      The only html file.
  /audio
    /bed            The musical audio bed lives here.
    /stories        All of the stories' audio tracks.
  /css
    /css.css        All basic CSS (incomplete)
  /images
    /icons          For the side menu
    /miracles       Miracles icons
    /missionaries   Missionaries paintings. (/scans is unedited)
    /js
      /haiku.js     Runs the loading animation.
      /howler.js    Runs the audio.
      /jquery…
      /loader.js    The actual loading animation.
      /mir.json     Miracles content.
      /mis.json     Missionaries content.
      /mustache.js  Runs the templating.
      /tour.js      The custom JS for the whole experience.
  /videos           Really just the background video.
```

## HTML Page Structure:
There's only one html file: index.html. Inside of that file:
* CSS files: `normalize.css`, `skeleton.css`, `one_page.css` (these should be combined)
* JS files:
  * `JQuery`
  * `Mustache` (this allows for page templating)
  * `Howler` (audio controller)
  * `tour.js` (at the bottom of the page, this is all of the custom JS)
* JSON files that contain all Missionary and Miracle content. Mustache uses these to populate the page.

## JSON Structures:
```miracles (mir.json)
  title:      string
  slug:       string (unique)
  active:     boolean
  location:   string
  paragraphs: [ an array of strings ]
```
```missionaries (mis.json)
  name:       string
  slug:       string (unique)
  active:     boolean
  location:   string
  date:       string
  paragraphs: [ an array of strings ]
```

The order of the *active* content will be the displayed order.

## Adding new content:
1. Add the content to the appropriate JSON file. Take note of the "slug."
1. Add the representative avatar/icon/image to the proper image folder.
    * Miracle images should be *slug*.png
    * Missionary images should be *slug*.jpg
1. The story audio track should have 3 seconds of silence at the beginngin of the track and be named *slug*.mpg.

When the page is reloaded the new story should be available.



### Notes
The `body` tag has two classes that store the audio tracks' playing/muted status.

`.reload` creates a small square at the bottom left of the screen that, when tapped 8 times, reloads the experience.

`.reload` single click removes guide lines.

`.overlay` goes under the loading animation, videos aren't easily "faded in", but divs are easily faded out.

`video` can be updated with one for production.
