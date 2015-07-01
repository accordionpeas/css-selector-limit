# css-selector-limit

> Node.js module for detecting if any CSS file in a set has more selectors than IE's limit of 4095.

## Overview
Pass the module an array of CSS file paths and it will analyse each file and invoke a callback function that is passed an array of result objects in the same order of the original array.

There is a grunt and gulp plugin that wraps this module:
- [grunt plugin](https://github.com/accordionpeas/grunt-css-selector-limit)
- [gulp plugin](https://github.com/accordionpeas/gulp-css-selector-limit)

```js
var cssSelectorLimit = require('css-selector-limit');

cssSelectorLimit([
	__dirname + '/style/default.css'
], function(err, results){
	if(err){
		//error occurred
	}
	else if(!results[0].ok){
		//number of selectors is over the limit.
	}
});

//pass options to function
cssSelectorLimit([
	__dirname + '/style/default.css'
], {
	limit: 10000
}, function(err, results){
	//do something with results.
});
```

## Options

### options.limit
Type: `Number`
Default value: `4095`

## Result Object

### result.file
Type: `String`

Path to the file that was analysed.

### result.ok
Type: `Boolean`

If the number of selectors is less than or equal to the limit the value will be _true_ else _false_.

### result.selector
Type: `String`
Default value: `null`

The first selector that went over the limit.

### result.line
Type: `Number`
Default value: `null`

The line number of the first selector that went over the limit.

The first selector that went over the limit.

### result.count
Type: `Number`

The total number of selectors in the file.