# Vue Date Picker

> A vue date picker component inspired by material design

![](http://i.imgur.com/YNrnrVD.png)

## Installing

`$ npm install vue-md-date-picker --save`

`import DatePicker from 'vue-date-picker'`

## Example

The most common use case

```html
<input type="text" id="date" readonly @focus="show = true" v-model="date">

<date-picker id="date"
             @close="show = false"
             v-if="show"
             v-model="date"></date-picker>
```

Note that there is a `@close` event and a `v-if` directive. This is because the date picker allows you to choose when it is displayed, and how to handle closing it.

Setting a minimim limit date

```html
<input type="text" id="date" readonly @focus="show = true" v-model="date">

<date-picker id="date"
             min="2017-8-16"
             @close="show = false"
             v-if="show"
             v-model="date"></date-picker>
```

Setting a maximum limit date


```html
<input type="text" id="date" readonly @focus="show = true" v-model="date">

<date-picker id="date"
             max="2017-8-24"
             @close="show = false"
             v-if="show"
             v-model="date"></date-picker>
```

Setting a range of dates

```html
<input type="text" id="date" readonly @focus="show = true" v-model="date">

<date-picker id="date"
             min="2017-8-16"
             max="2017-8-24"
             @close="show = false"
             v-if="show"
             v-model="date"></date-picker>
```

You may also specifiy a color to change the theme of the date picker

```html
<date-picker id="date"
             color="#F44336"
             @close="show = false"
             v-if="show"
             v-model="date"></date-picker>
```
