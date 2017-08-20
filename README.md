# Vue Date Picker

> A vue date picker component inspired by material design

![](http://i.imgur.com/YNrnrVD.png)

## Installing

`$ npm install vue-md-date-picker --save`

`import DatePicker from 'vue-md-date-picker'`

## Example

The most common use case

```html
<date-picker @close="show = false"
             v-if="show"
             v-model="date"></date-picker>
```

Note that there is a `v-if` directive and a `@close` event. This is because the date picker allows you to choose when it is displayed, and how to handle closing it.

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

You may also specifiy a color to change the theme of the date picker

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

## API

### Props

| Name  | Type   | Description                                     |
| :---- | :----- | :---------------------------------------------- |
| color  | String  | Changes the theme color of the date picker.   |
| min    | String  | Limits the date to a minimum specified value. |
| max    | String  | Limits the date to a maximum specified value. |

### Events

| Name   | Description |
| :----- | :---------- |
| close  | Closes the date picker. This is fired when the Cancel button is pressed, when the escape key is pressed, or when the input event is emitted.  |
| input  | Sets the selected date. This is fired when the Ok button is pressed, or when the user presses the enter or space keys after selecting a date. | 
