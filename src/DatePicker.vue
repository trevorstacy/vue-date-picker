<template>
  <div class="date-picker-container flex-center" :class="{'hidden-footer': footer }">
    <div class="date-picker-background flex-center" @click.stop.prevent="onClose"></div>

    <div class="calendar-container">
      <div class="calendar">
        <div :style="{ 'background-color': color }" class="calendar-header flex-center">
          <div>
            <h3 :class="{ 'calendar-faint': selecting === 'date' }"
                @click="setSelecting('year')">
              {{ selectedYear }}
            </h3>

            <h2 :class="{ 'calendar-faint': selecting === 'year' }"
                @click="setSelecting('date')">
              {{ abbrivatedDay }}, {{ selectedMonthWord }} {{ selectedDay }}
            </h2>
          </div>
        </div>

        <!-- Calendar -->
        <div class="calendar-body" v-if="selecting === 'date'">
          <div class="calendar-date">
            <div>
              <!-- The svg's are from the material design chevron arrows -->
              <div class="calendar-arrows flex left" @click="setByMonth(currentMonth - 1)"
                   v-if="showLeftArrow">
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="24"
                     height="24"
                     viewBox="0 0 24 24">
                  <path fill="#212121" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </div>
            </div>

            <div class="calendar-current-date flex-center">
              <h4>{{ currentMonthWord }} {{ currentYear }}</h4>
            </div>

            <div>
              <div class="calendar-arrows flex right" @click="setByMonth(currentMonth + 1)"
                   v-if="showRightArrow">
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="24"
                     height="24"
                     viewBox="0 0 24 24">
                  <path fill="#212121" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <td>S</td>
                <td>M</td>
                <td>T</td>
                <td>W</td>
                <td>T</td>
                <td>F</td>
                <td>S</td>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(days, index) in calendar" :key="index">
                <td :style="{
                      'color': day.currentDay && ! day.selected ? color : '',
                      'background-color': day.selected ? color : ''
                    }"
                    :class="{
                      'current-day': day.currentDay,
                      'disabled': day.disabled,
                      'selected': day.selected
                    }"
                    v-for="(day, index) in days"
                    :key="`day-${index}-${day.day}`"
                    tabindex="0"
                    @keydown.enter="onInput"
                    @keydown.space.stop.prevent="onInput"
                    @keydown.esc="onClose"
                    @click="setByDay(day)">{{ day.day }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Years -->
        <div class="calendar-year-select" v-if="selecting === 'year'">
          <div :style="{ 'color': year.selected ? color : '' }"
               :class="{ 'selected': year.selected }"
               :id="`${year.year}-calendar-year`"
               v-for="year in years"
               :key="year.year"
               @click="setByYear(year.year)">
            {{ year.year }}
          </div>
        </div>

        <div class="calendar-footer" v-if="! footer">
          <button :style="{ 'color': color }" @click.stop.prevent="onClose">Cancel</button>

          <button :style="{ 'color': color }" @click.stop.prevent="onInput">Ok</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * Helpers for no dependencies™
   */

  const dayMap = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
  }

  const monthMap = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  }

  // Thanks, Lodash.

  /**
   * https://lodash.com/docs/4.17.4#slice
   */
  const slice = (array, start, end) => {
    let length = array == null ? 0 : array.length

    if (! length) {
      return []
    }

    start = start == null ? 0 : start

    end = end === undefined ? length : end

    if (start < 0) {
      start = -start > length ? 0 : (length + start)
    }

    end = end > length ? length : end

    if (end < 0) {
      end += length
    }

    length = start > end ? 0 : ((end - start) >>> 0)
    start >>>= 0

    let index = -1

    const result = new Array(length)

    while (++index < length) {
      result[index] = array[index + start]
    }

    return result
  }

  /**
   * https://lodash.com/docs/4.17.4#chunk
   */
  const chunk = (array, size) => {
    size = Math.max(size, 0)

    const length = array == null ? 0 : array.length

    if (! length || size < 1) {
      return []
    }

    let index = 0

    let resIndex = 0

    const result = new Array(Math.ceil(length / size))

    while (index < length) {
      result[resIndex++] = slice(array, index, (index += size))
    }

    return result
  }

  /**
   * Actual component stuff
   */

  export default {
    props: {
      color: {
        type: String,
        required: false,
        default: '#009688'
      },

      format: {
        type: Function,
        required: false
      },

      min: {
        type: String,
        required: false
      },

      max: {
        type: String,
        required: false
      },

      value: {
        type: String,
        required: false
      },

       footer: {
         type: Boolean,
         required: false,
         default: false
       }
    },

    computed: {
      /**
       * Returns if there was any initial date settings.
       *
       * @return {Boolean}
       */
      initialDate () {
        return !! (this.value || this.min)
      },

      /**
       * The date property, converted to a date.
       *
       * @return {Date}
       */
      specifiedDate () {
        return new Date(this.value)
      },

      /**
       * Returns a formatted date e.g. 2016-4-19. This is emiited on the input event.
       *
       * @return {String}
       */
      calculatedDate () {
        const day = this.selectedDay >= 10 ? this.selectedDay : `0${this.selectedDay}`

        const month = this.selectedMonth + 1 >= 10 ? this.selectedMonth + 1 : `0${this.selectedMonth + 1}`

        return `${this.selectedYear}-${month}-${day}`
      },

      /**
       * Returns an abbreviation of a day e.g. Sun, Mon, etc.
       *
       * @return {String}
       */
      abbrivatedDay () {
        return dayMap[this.selectedDayOfWeek]
      },

      /**
       * Returns the currently viewed month as a word.
       *
       * @return {String}
       */
      currentMonthWord () {
        return monthMap[this.currentMonth]
      },

      /**
       * Returns the selected month as a word.
       *
       * @return {String}
       */
      selectedMonthWord () {
        return monthMap[this.selectedMonth]
      },

      /**
       * The minimum date the calendar will allow you to select.
       *
       * @return {Date}
       */
      minDate () {
        if (this.min) {
          const minDateSplit = this.min.split('-')

          return new Date(minDateSplit[0], minDateSplit[1], minDateSplit[2])
        }

        return
      },

      /**
       * The maximum date the calendar will allow you to select.
       *
       * @return {Date}
       */
      maxDate () {
        if (this.max) {
          const maxDateSplit = this.max.split('-')

          return new Date(maxDateSplit[0], maxDateSplit[1], maxDateSplit[2])
        }

        return
      },

      /**
       * Determines if the left arrow for the current date should be shown.
       *
       * @return {Boolean}
       */
      showLeftArrow () {
        // Show the left arrow when there is either no mininum date, or when the
        // minimum year and minimum month are the same as the current year and
        // current month.
        if (! this.min) return true

        if (this.minDate.getFullYear() === this.currentYear &&
            this.minDate.getMonth() - 1 === this.currentMonth) {
          return false
        }

        return true
      },

      /**
       * Determines if the right arrow for the current date should be shown.
       *
       * @return {Boolean}
       */
      showRightArrow () {
        // Show the right arrow when there is either no maximum date, or when
        // the maximum year and maximum month are the same as the current
        // year and current month.
        if (! this.max) return true

        if (this.maxDate.getFullYear() === this.currentYear &&
            this.maxDate.getMonth() - 1 === this.currentMonth) {
          return false
        }

        return true
      },

      /**
       * Computes a formatted array of days for a given month and year.
       *
       * @return {Array}
       */
      calendar () {
        // The calendar's output is a function of all of the days in a given
        // month, chunked into an array of arrays, each containing 5 or 6
        // and 7 elements respectively.
        const days = []

        // Padding for the first row, e.g. if the month's first day starts on
        // Friday, the first array will be ['', '', '', '', '', '1', '2']
        const startOfMonthDay = new Date(this.currentYear, this.currentMonth, 1).getDay()

        for (let i = 0, len = startOfMonthDay; i < len; i++) {
          days.push('')
        }

        // Create an array containing all days in the current month
        const daysInMonth = 32 - new Date(this.currentYear, this.currentMonth, 32).getDate()

        for (let i = 0, len = daysInMonth; i < daysInMonth; i++) {
          days.push(i + 1)
        }

        // Map the days from numbers to objects that have current day,
        // selected, and disabled properties for the view.
        const today = new Date()

        const dayObjects = days.map((day) => {
          const currentDay = (day === today.getDate()) &&
                             (this.currentMonth === today.getMonth()) &&
                             (this.currentYear === today.getFullYear())

          const selected = (this.selectedDay === day) &&
                           (this.currentMonth === this.selectedMonth) &&
                           (this.currentYear === this.selectedYear)

          const disabled = this.dayDisabled(day)

          return { day, currentDay, selected, disabled }
        })

        // Chunk all of the days into an array of arrays, by seven.
        return chunk(dayObjects, 7)
      },

      /**
       * Computes a list of years.
       *
       * @return {Array}
       */
      years () {
        // Set the first year of the array.
        let firstYear

        if (this.min) {
          firstYear = this.minDate.getFullYear()
        } else if (this.value) {
          firstYear = this.specifiedDate.getFullYear()
        } else {
          firstYear = (new Date).getFullYear()
        }

        // Create a range of years to loop through which is either the maximum
        // date minus the first year, or simply 100.
        let through = this.max ? (this.maxDate.getFullYear() + 1) - firstYear : 101

        let years = []

        for (let i = firstYear, len = firstYear + through; i < len; i++) {
          years.push(i)
        }

        return years.map((year) => {
          return { year, selected: year === this.selectedYear }
        })
      }
    },

    created () {
      this.hideBodyOverflow(true)

      this.setDate()

      this.setEscapeEvent()
    },

    data: () => ({
      selecting: 'date',
      currentMonth: '',
      currentYear: '',
      selectedDayOfWeek: '',
      selectedDay: '',
      selectedMonth: '',
      selectedYear: ''
    }),

    methods: {
      /**
       * Changes the display to the calendar or years depending on the value.
       */
      setSelecting (value) {
        this.selecting = value

        // If the user is selecting a year, we want to go to the selected year
        // minus two (as does the material design date picker).
        if (value === 'year') {
          this.$nextTick(() => {
            const container = document.querySelector('.calendar-year-select')

            const el = document.getElementById(`${this.selectedYear}-calendar-year`)

            container.scrollTop = (el.offsetTop - 100) - 76
          })
        }
      },

      /**
       * Set the date by the given day.
       *
       * @param {Object}
       */
      setByDay (day) {
        if (day.disabled) return

        this.selectedYear = this.currentYear

        this.selectedDay = day.day

        this.selectedMonth = this.currentMonth

        this.selectedDayOfWeek = new Date(this.selectedYear, this.selectedMonth, day.day).getDay()

        if (this.footer) {
          this.onInput();
        }
      },

      /**
       * Set the date by the given month.
       *
       * @param {[String, Number]}
       */
      setByMonth (month) {
        if (month === 12) {
          this.currentYear = this.currentYear + 1

          this.currentMonth = 0

          return
        }

        if (month === -1) {
          this.currentYear = this.currentYear - 1

          this.currentMonth = 11

          return
        }

        this.currentMonth = month
      },

      /**
       * Set the date by the given year.
       *
       * @param {[String, Number]}
       */
      setByYear (year) {
        this.selectedYear = year

        this.currentYear = year

        this.selecting = 'date'
      },

      /**
       * Set the initial date for the calendar.
       */
      setDate () {
        // If a date property has been passed to the component, that will be
        // used instead of the current day.
        let date

        if (this.min && this.min && ! this.value) {
          date = new Date(this.min)
        } else if (this.value && this.value) {
          date = new Date(this.value)
        } else {
          date = new Date()
        }

        if (this.initialDate) {
          this.selectedDay = date.getDate() + 1
        } else {
          this.selectedDay = date.getDate()
        }

        this.selectedDayOfWeek = date.getDay()

        this.selectedMonth = date.getMonth()

        this.currentMonth = date.getMonth()

        this.selectedYear = date.getFullYear()

        this.currentYear = date.getFullYear()
      },

      dayDisabled (day) {
        // A day is disabled when the minimum month and minimum year are equal
        // to the current month and year and the day is less than the min date's day
        if (this.min &&
            (this.minDate.getMonth() - 1 === this.currentMonth &&
            this.minDate.getFullYear() === this.currentYear) &&
            day < this.minDate.getDate()) {
          return true
        }

        //  Or when the maximum month and maximum year are equal to the current
        //  month and year and the day is greater than the max date's day
        if (this.max &&
            (this.maxDate.getMonth() - 1 === this.currentMonth &&
            this.maxDate.getFullYear() === this.currentYear) &&
            day > this.maxDate.getDate()) {
          return true
        }

        return false
      },

      // Misc methods that have nothing to do with calendar stuff.

      /**
       * Hides the overflow of the body when the date picker is active.
       *
       * @param  {Boolean}
       */
      hideBodyOverflow (show) {
        const bodyEl = document.querySelector('body')

        if (show === true) {
          bodyEl.style.overflow = 'hidden'

          return
        }

        bodyEl.style.overflow = ''
      },

      /**
       * Close the date picker if the escape key is pressed.
       */
      setEscapeEvent () {
        document.addEventListener('keydown', (event) => {
          if (event.keyCode == 27 || event.key == 'Escape') {
            this.onClose()
          }
        })
      },

      /**
       * When the "Ok" button is pressed, or enter is pressed, emit the input
       * event and close the date picker.
       */
      onInput () {
        const date = this.format ? this.format(this.calculatedDate) : this.calculatedDate

        this.$emit('input', date)

        this.onClose()
      },

      /**
       * Emit a close event so the developer can close the date picker as they
       * see fit.
       */
      onClose () {
        this.hideBodyOverflow(false)

        this.$emit('close')
      }
    }
  }
</script>

<style scoped>
  *, *::before, *::after {
      box-sizing: inherit;
  }

  div, h2, h3, h4, table, tbody, thead, tr, td, button {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  button {
    border-radius: 2px;
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    padding: 0 16px;
    outline: none;
    user-select: none;
  }

  .flex {
    display: flex;
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .date-picker-container, .date-picker-background {
    overflow-y: auto;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .date-picker-container {
    line-height: 1.5;
    z-index: 9998;
  }

  .date-picker-background {
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
  }

  .calendar-faint {
    opacity: 0.75;
  }

  .calendar-container {
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 12px 52px rgba(0, 0, 0, 0.25);
    cursor: initial;
    position: relative;
    user-select: text;
    width: 350px;
    z-index: 10001;
    user-select: none;
  }

  .calendar {
    height: 500px;
    position: relative;
  }

  .hidden-footer .calendar {
    height: 470px;
  }

  .calendar-header {
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 28px;
  }

  .calendar-header h2, .calendar-header h3 {
    cursor: default;
  }

  .calendar-header h2.calendar-faint, .calendar-header h3.calendar-faint {
    cursor: pointer;
  }

  .calendar-header h2 {
    font-size: 28px;
    line-height: 30px;
    margin-top: 3px;
  }

  .calendar-header h3 {
    font-size: 1.125rem;
    font-weight: 300;
  }

  .calendar-body {
    padding: 16px;
  }

  .calendar-date {
    display: flex;
  }

  .calendar-date .calendar-arrows.left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .calendar-current-date {
    cursor: default;
    text-align: center;
  }

  .calendar-date .calendar-arrows.right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .calendar-date > div {
    width: 33.333%;
  }

  .calendar-date h4 {
    font-size: 14px;
    font-weight: 500;
  }

  .calendar-arrows {
    cursor: pointer;
    padding: 0 8px;
  }

  .calendar-body table {
    border-spacing: 2px;
    border-collapse: separate;
    cursor: default;
    font-size: 12px;
    margin-top: 8px;
    table-layout: fixed;
    text-align: center;
    width: 100%;
  }

  .calendar-body table thead {
    color: #757575;
  }

  .calendar-body table thead td, .calendar-body table thead td {
    cursor: default!important;
  }

  .calendar-body tr {
    height: 43px;
    vertical-align: middle;
  }

  .calendar-body td {
    border-radius: 50%;
    cursor: pointer;
    vertical-align: middle;
    transition: background-color .15s;
    width: 43px;
  }

  .calendar-body td:focus {
    outline: none;
  }

  .calendar-body tbody td:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .calendar-body td:empty {
    background-color: transparent!important;
    cursor: default;
  }

  .calendar-body td.current-day {
    font-weight: bold;
  }

  .calendar-body td.disabled {
    color: #c5c5c5;
    cursor: default;
    pointer-events: none;
  }

  .calendar-body td.selected {
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
  }

  .calendar-year-select {
    box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.075);
    height: 353px;
    overflow-y: scroll;
    text-align: center;
  }

  .hidden-footer .calendar-year-select {
    height: 378px;
  }

  .calendar-year-select div {
    cursor: pointer;
    padding: 8px 0;
    transition: background-color .15s;
  }

  .calendar-year-select div:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .calendar-year-select .selected {
    font-size: 24px;
  }

  .calendar-footer {
    position: absolute;
    bottom: 16px;
    right: 16px;
  }

  .calendar-footer button {
    background-color: transparent;
    border: 1px solid transparent;
    box-shadow: none;
  }

  .calendar-fade-enter-active, .calendar-fade-leave-active {
    transition: opacity .15s;
  }

  .calendar-fade-enter, .calendar-fade-leave-to {
    opacity: 0;
  }
</style>
