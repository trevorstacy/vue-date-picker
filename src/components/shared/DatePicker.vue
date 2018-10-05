<template>
    <div>
        <span class="date-picker-label" v-if="label">{{ label }}</span>

        <div class="date-picker" @click="visible = true">

            <div class="date-picker__picker picker"
                 :class="{ 'select--selected': !!selected }">

                <span class="picker__text">{{ selected ? selected : "" }}</span>

                <i class="picker__icon fas fa-calendar-alt"></i>
            </div>
        </div>

        <date-picker @close="visible = false"
                     v-if="visible"
                     v-model="pickerValue"
                     :min="minDate.format('YYYY-MM-DD')"
                     :max="maxDate.format('YYYY-MM-DD')"
                     color="#B11A29"
                     :translations="calendarTranslations"
                     class="date-picker-calendar"
                     @input="setInactiveMonths">
        </date-picker>
    </div>
</template>

<script>
    import Moment                   from "moment";
    import DatePickerExternal       from "@/external/date-picker";
    import { DEACTIVATE_MONTHS      } from "@/store/lists/mutations";
    import { calendarTranslations   } from "@/data/translations";

    export default {

        props: {
            label: {
                type: String,
                required: false,
                default: ""
            },
            value: {
                type: Object,
                required: true
            },
            minDate: {
                type: Object,
                required: true
            },
            maxDate: {
                type: Object,
                required: true
            }
        },

        data () {
            return {
                visible: false,
                calendarTranslations
            };
        },

        computed: {
            selected () {
                return this.value.format('DD.MM.YYYY')
            },
            pickerValue: {
                set (value) {
                    this.$emit('change', Moment(value));
                },
                get () {
                    return this.value.format('YYYY-MM-DD')
                }
            }
        },

        methods: {
            setInactiveMonths () {
                this.$store.commit(DEACTIVATE_MONTHS);
            }
        },

        components: { 'date-picker': DatePickerExternal }
    };
</script>

<style lang="scss">
    @import "~@/shared";

    .calendar-body td {
        line-height: 10px;
    }

    .date-picker-label {
        font: {
            size: 14px;
            weight: 500;
        }
        color: $color-bistro-dark-gray;
        display: inline-block;
        margin-right: .25em;

        @include respond-to(mobile) {
            display: none;
        }
    }

    .date-picker {
        position: relative;
        display: inline-flex;
        align-items: center;
        @include respond-to(mobile) {
            width: 100%;
        }

        &__picker {
            display: flex;
            align-items: center;
            align-content: center;
            position: relative;
        }
    }

    .picker {
        $parent: &;
        @include text-ellipsis();
        border-radius: 1.2em 1.2em 1.2em 1.2em; // because of transition
        transition: .15s border-radius ease-in-out;
        box-shadow: 0 0 14px -4px $color-bistro-medium-gray;
        font: {
            size: 13px;
            weight: 300;
        }
        line-height: 1;
        background-color: white;
        padding: .6em 2.5em .6em 1em;
        color: $color-bistro-medium-gray;
        cursor: pointer;
        @include respond-to(mobile) {
            width: 100% !important;
            box-sizing: border-box;
            font-size: 14px;
            line-height: 1.3;
        }

        &__text {
            margin-top: 1px;
        }

        &__icon {
            position: absolute;
            right: 14px;
            transform: rotate(0);
            transition: .25s transform ease-out;
            color: $color-box-icon;

            #{$parent}:hover & {
                color: $color-bistro-red;
            }
        }

        &--selected {
            font: {
                size: 13px;
                weight: 500;
                style: normal;
            }
        }
    }
</style>
