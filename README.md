# Vanilla datepicker

Vanilla datepicker is a simple datepicker in Vanilla-JS.

## Installation

Include `vanilla.datepicker.min.js` script :
```html
<script src="vanilla.datepicker.min.js" type="text/javascript" charset="utf-8" />
```

Include the menu `vanilla.datepicker.css` default style :
```html
<link rel="stylesheet" href="vanilla.datepicker.css" type="text/css" media="screen" />
```

## Usage

Binding a datepicker to an input field is really easy.
```html
<input type="text" class="datepicker" />
```

```js
datepicker( '.datepicker' );
```

## Options

These are the supported options and their default values:
```js
datepicker.defaults = {
    firstDayOfWeek: 0,          // First day of week 
    months: {                   // Month formats
        short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    },
    navigateYear: true,         // Display year navigation
    outputFormat:'%Y-%m-%d',    // Date  output format
    weekdays: {
        short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
}
```
If you want to localize your datepicker, you can override default params `months` and `weekdays`. Both of thoses parameters have short et long of each element.