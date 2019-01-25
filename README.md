# lem(o)n

A tiny web framework rendering dom using an template tag function `h`.

- Render components and text as elements or attributes
- Designed as a modest library for building internal tools
  - Tiny footprint with 1.3kb build minified and gzipped
  - One dependency (lemn)
  - No required build infrastructure (babel, webpack, browserify, etc)

## Getting Started

```
<script src="https://mzgoddard.github.io/lemn/web.min.js"></script>
```

```
class Item {
  constructor (model) {
    this.model = model;
  }

  render () {
    return lemn.h`<li>${this.model}</li>`;
  }
}

class App {
  constructor (options) {
    this.options = options;
  }

  render () {
    return lemn.h`<ol>${this.model.as(list => list.map(item => new Item(item)))}</ol>`;
  }
}

const model = new lemn.Model([
  new lemn.Model('apple'),
  new lemn.Model('orange'),
  new lemn.Model('strawberry')
]);

lemn.attach(document.querySelector('.root'), new App(model));
```
