# Draad.js

Simple javascript plugin without any dependencies. It helps with creating designs that contains something like __treasure hunt map__ or __timeline path.__

It is __plain JS__ (ES6) script with babelized (ES5) version using Babel JS compiler.

When is called __Draad.js__ will create an SVG element that connects all the elements with defined class and it will be by default located in the body. SVG parent can be changed via __options.__ 
 
__[NPM](https://www.npmjs.com/package/draad)__ 

__[DEMO 1](https://codepen.io/tjezidzic/full/wmmaYZ/)__
 
__[DEMO 2](https://codepen.io/tjezidzic/full/dmmoWz/)__

## How to use

```JS
new Draad();
```

### Minimum setup

```JS
const newDraad = new Draad('connectingElementClass');
```

It __needs unique class__ for the elements that needs to be connected 

```HTML
<span class="connectingElementClass"></span>
```

### Ideal usage:

```JS
const newDraad = new Draad('elements', {
    parentClass: 'container',
    smoothing: 0.5,
    lineWidth: 2,
    dasharray: '5 5 3',
    wait: 300,
    responsive: true
});
```

### Removing line

```JS
newDraad.destroy;
```

### Options

Option | Type | Default | Example | Description
------ | ---- | ------- | ------- | -----------
element | string |   | 'class' | Enables elements connecting 
parentClass | string |   | 'class' | If not passed body will be parent of the SVG line
offsetX | number | half of an element width | 20 | Enables more precise line positioning
offsetY | number | half of an element height | 32 | Enables more precise line positioning 
fill | string |  | '#345adf' | It will create contour
color | string | '#000' | '#17f2a8' | Defines line color
lineWidth | number | 1 | 12 | Defines line width in px
lineOpacity | number | 1 | 0.6 | Defines line visibility
dasharray | string |  | '5 4 5' | Transforms solid line to dashed
cap | string |  | 'round' | It represents CSS property stroke-linecap
responsive | boolean | false | true | Enables responsive line 
wait | number | 0 | 1000 | It will wait with creating a line by defined milliseconds
smoothing | number | 0.2 | 3.3 | It smoothes line curves and if it's 0 passed the line will be straight with sharp edges 
absoluteUnits | boolean | false | true | Coordinates can be absolute if parent without position: relative; is added   

### Useful to know
- connected elements needs to have same parent
- connected elements don't needs to be in the same container
- elements positioning is irrelevant
- additional SVG styling and animating is possible because the line is just another element in DOM  

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
