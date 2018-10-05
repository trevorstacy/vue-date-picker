<template>
    <div class="from-to-date-filter">
        <date-picker class="date-picker"
                    label="Od:"
                    :minDate="dateFromMin"
                    :value="dateFrom"
                    :maxDate="dateTo"
                    @change="calculateDateToMax">
        </date-picker>
        <date-picker class="date-picker"
                    label="Do:"
                    :value="dateTo"
                    :minDate="dateFrom"
                    :maxDate="dateToMax"
                    @change="calculateDateFromMin">
        </date-picker>
    </div>
</template>

<script>
    import Moment       from "moment";
    import DatePicker   from "@/components/shared/DatePicker";
    import { mapState   } from "vuex";
    import {
        SET_DATE_FROM,
        SET_DATE_TO,
    } from "@/store/lists/mutations";

    export default {

        data () {
            return {
                dateFromMin: undefined,
                dateToMax: undefined
            };
        },

        created () {
            this.calculateDateFromMin(this.dateTo);
            this.calculateDateToMax(this.dateFrom);
        },

        computed: {
            ...mapState({
                dateFrom: state => state.dateFrom,
                dateTo: state => state.dateTo
            })
        },

        methods: {
            calculateDateFromMin (value) {
                if (this.dateTo !== value) {
                    this.$store.commit(SET_DATE_TO, value);
                }
                this.dateFromMin = value.clone().subtract(1, 'year');
            },
            calculateDateToMax (value) {
                if (this.dateFrom !== value) {
                    this.$store.commit(SET_DATE_FROM, value);
                }
                const now = Moment();
                const max = value.clone().add(1, 'year');
                this.dateToMax = max <= now ? max : now;
            }
        },

        components: { DatePicker }
    };
</script>

<style lang="scss">
    @import "~@/shared";

    .from-to-date-filter {
        display: inline-block;
        @include respond-to(mobile) {
            display: flex;
            justify-content: space-between;
        }
    }

    .date-picker {
        display: inline-block;
        @include respond-to(mobile) {
            width: 100%;
        }

        &:first-of-type {
            margin-right: 10px;
            @include respond-to(mobile) {
                margin-right: 5px;
            }
        }
    }
</style>
