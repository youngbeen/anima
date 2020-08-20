
[TOC]

## Anima

`Anima` is an easy-to-use yet light weight javascript library to animate elements in your page

### Features

* Easy to use
* Config animation time to each element differently
* Lazy triggering (means effecient)
* Auto revoking listeners (means effecient)

### Install

Install it via npm

```shell
npm i -S '@youngbeen/anima'
```

### Import

```javascript
import anima from '@youngbeen/anima'
```

### Usage

In html, on which element you want to animate. Add a `use-anima` attribute

```html
<p use-anima>Element</p>
```

Then init anima in proper time (or reinit it)

```javascript
anima.init()
```

That's all! `Anima` will handle the rest.

### Options

For now, you can config animation time for each element.
Add `anima-time` attribute to element

> `anima-time` value is consumed with `ms`(milliseconds)

```html
<p use-anima anima-time="400">Element</p>
```
