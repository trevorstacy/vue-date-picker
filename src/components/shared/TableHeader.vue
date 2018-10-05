<template>
    <div class="filter-header desktop">
        <span class="date-type-1 bold">{{ getDateFilter() }}</span>
        <span class="separator">|</span>
        <span>{{ getRestaurantFilter() }}</span>
    </div>
</template>

<script>
    import {
        mapState,
        mapGetters
    } from "vuex";
    import {
        ACTIVE_MONTH,
        ACTIVE_RESTAURANTS
    } from '@/store/lists/getters';

    export default {

        props: {
            type: {
                type: String,
                required: true
            }
        },

        computed: {
            ...mapState({
                dateFrom: state => state.dateFrom,
                dateTo: state => state.dateTo
            }),
            ...mapGetters({
                activeMonth: ACTIVE_MONTH,
                activeRestaurants: ACTIVE_RESTAURANTS
            })
        },

        methods: {
            getDateFilter () {
                if (this.activeMonth) {
                    return `${this.activeMonth.getName()} ${this.activeMonth.getYear()}`;
                }
                return `${this.dateFrom.format('DD.MM.YYYY')} - ${this.dateTo.format('DD.MM.YYYY')}`;
            },
            getRestaurantFilter () {
                const names = this.activeRestaurants.map(restaurant => restaurant.name);
                const result = `${this.type} pre reštauráci` + (names.length > 1 ? 'e' : 'u');

                if (names.length === 1) {
                    return `${result} ${names[0]}`;
                }
                return `${result} ${names.join(', ')} a ${names.pop()}`;
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .filter-header {
        background: $color-bistro-red;
        color: white;
        padding: 10px 15px;
        margin-bottom: 2px;
        .separator {
            padding: 0 5px;
        }
    }
</style>
