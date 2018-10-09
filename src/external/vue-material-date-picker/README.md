# Vue Date Picker

A material design date picker component for Vue. 
Built on top of [vue-md-date-picker]() as the original package
is, unfortunately, not in development for quite a while now.
The package now accepts the translations and there's option to change
Sunday-to-Saturday to Monday-to-Sunday

## Contents

 - [Installing](#installing)
 - [Examples](#examples)
 - [Formatting Selected Date](#formatting)
 - [API](#api)

## Installing

Using **npm**: `npm install vue-material-date-picker`
<br>
Using **yarn**: `yarn add vue-material-date-picker`

In order to use the plugin after installation you need to import it.

```
import DatePicker from 'vue-material-date-picker'
```

## Examples

The most common use case

```html
<date-picker @close="show = false"
             v-if="show"
             v-model="date"></date-picker>
```

Note that there is a `v-if` directive and a `@close` event. 
This is because the date picker allows you to choose when it is displayed, and how to handle closing it.

Setting a min date to choose from

```html
<date-picker min="2017-8-16"
             @close="show = false"
             v-if="show"
             v-model="date"></date-picker>
```

Setting a max date to choose from


```html
<date-picker max="2017-8-24"
             @close="show = false"
             v-if="show"
             v-model="date"></date-picker>
```

Setting a range of dates to choose from

```html
<date-picker min="2017-8-16"
             max="2017-8-24"
             @close="show = false"
             v-if="show"
             v-model="date"></date-picker>
```

You may also specify a color to change the theme of the date picker

```html
<date-picker color="#F44336"
             @close="show = false"
             v-if="show"
             v-model="date"></date-picker>
```

There is also a provided transition if you want to fade the date picker in

```html
<transition name="calendar-fade">
  <date-picker @close="show = false"
               v-if="show" 
               v-model="date"></date-picker>
</transition>
```

In case you need to provide internationalization, you can pass your own `translations` object.

```javascript
const translations = {
    dayMap: {
        0: 'Mon',
        1: 'Die',
        2: 'Mitt',
        3: 'Don',
        4: 'Fre',
        5: 'Sam',
        6: 'Son'
    },
    shortDayMap: [
        'M',
        'T',
        'W',
        'T',
        'F',
        'S',
        'S',
    ],
    monthMap: {
        0: 'Januar',
        1: 'Februar',
        2: 'März',
        3: 'April',
        4: 'Mai',
        5: 'Juni',
        6: 'Juli',
        7: 'August',
        8: 'September',
        9: 'Oktober',
        10: 'November',
        11: 'Dezember'
    },
    cancelButtonText: 'Stornieren',
    submitButtonText: 'Ok'
};
```

```html
<date-picker @close="show = false"
             v-if="show"
             v-model="date"
             :translations="translations"></date-picker>
```

You can specify the week days interval format
`Sun-to-Sat` (default) or 
`Mon-To-Sun`

```html
<date-picker @close="show = false"
             v-if="show"
             v-model="date"
             week-format="Mon-To-Sun"
             :translations="translations"></date-picker>
```

## Formatting

To format the date picker's value, you may use the `:format` prop. The format prop takes a reference to a function; this function receives the date picker's date value (e.g. 2016-4-19) and may format it however you wish


```html
<date-picker :format="formatDate"
             @close="show = false"
             v-if="show"
             v-model="date"></date-picker>
```

In your component's methods...

```javascript
formatDate (date) {
  return moment(date).format('LL')
}
```

In the above example, if a user selected "2017-8-29" as the date, the `date` value would be "August 29, 2017".

## API

### Props

| Name         | Type     | Description                                                             |
| :----------- | :------- | :---------------------------------------------------------------------- |
| color        | String   | Changes the theme color of the date picker.                             |
| format       | Function | Formats the date picker's emitted date via a user specified function.   |
| min          | String   | Limits the date to a minimum specified value.                           |
| max          | String   | Limits the date to a maximum specified value.                           |
| translations | Object   | Provides the translations for days, months, cancel & submit button      |
| week-format  | String   | Specifies the week's format: Sunday-to-Saturday or Monday-to-Sunday     |

### Events

| Name   | Description |
| :----- | :---------- |
| close  | Closes the date picker. This is fired when the Cancel button is pressed, when the escape key is pressed, or when the input event is emitted.     |
| input  | Sets the selected date. This is fired when the Ok button is pressed, or when the user presses the enter or space key after selecting a date. If a format function is passed to the date picker, the emitted value will be run through that before this event is emitted.   |
