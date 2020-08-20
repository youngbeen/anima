
[TOC]

## Anima

`Anima` is an easy-to-use yet light weight javascript library to animate elements in your page

### Features

* Easy to use
* Config animation time or animation type for each element
* Lazy triggering (means effecient)
* Auto revoking listeners (means effecient)

### Install

Install it via npm

```shell
npm i -S @youngbeen/anima
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

### Documents

#### Config Animation

You can config animation time and animation type for each element.

Add `anima-time` attribute to element to config animation time
> `anima-time` value is consumed in `ms`(milliseconds)

Add `anima-type` attribute to element to config animation type
> Support `zoom`, `fade`. Default as `zoom`

```html
<!-- Config animation time -->
<p use-anima anima-time="400">Element</p>

<!-- Config animation type -->
<p use-anima anima-type="fade">Element</p>

<!-- Config animation all together -->
<p use-anima anima-type="fade" anima-time="1000">Element</p>
```

#### Manually Revoke Listeners

```javascript
anima.revoke()
```
