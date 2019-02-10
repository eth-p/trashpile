# trashpile
A proof-of-concept for creating HTML elements that can't be easily scraped by headless browsers.

## Concept
Scrapers built around headless browsers have a large number of DOM-manipulation tools (`textContent`,
`innerText`, `innerHTML`) at their disposal, and generally don't have issues running JavaScript.
Given this, a better solution is needed than `myNode.innerHTML = 'my-email@example.com'` to prevent them from extracting
data from static websites.

This is where the Shadow DOM can come in handy. It allows the user to see different elements than those directly
contained in the DOM. Rather than using it for the intended purpose of hiding non-semantic structures, we're simply
inverting its use case.
  
## Caveats
- Is not good for accessibility.
- Will not prevent scrapers that use OCR.
- Will not work well without Shadow DOM support.
- Will not stop scrapers that override Shadow DOM or methods of trashpile.

## License
MIT License.

This is a cat and mouse game, and trashpile isn't intended to hide extremely sensitive data. It's a proof-of-concept to
see if it's possible to impair scrapers' abilities to read patterns off of website for spam or data collection purposes.

```
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND
[... AND] IN NO EVENT SHALL THE AUTHORS OR COPYRIGHTHOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY [...] ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE [...]
```

## Usage
**DO NOT USE THIS FROM A CDN.**

It's easy to take a well-known path and replace it with an API-compatible stub that feeds data directly to the scraper.
Just embed the source code in some mission-critical script and you will probably be fine.
