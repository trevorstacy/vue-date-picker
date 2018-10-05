<template>
    <div class="statistics-container">
        <loader v-if="isLoading"></loader>
        <div v-else class="statistics-table">
            <div class="statistics-table__column-names bold">
                <div v-for="(column, index) in columns"
                     class="statistics-table__column"
                     :class="[
                        { 'statistics-table__column--last': index === columns.length - 1 },
                        'statistics-table__column--' + column.cls
                    ]">
                    {{ column.name }}
                </div>
            </div>
            <div class="statistics-table__data" >
                <div class="statistics-table__row" v-for="(bestseller, index) in bestsellers">
                    <div class="mobile-group">
                        <div class="statistics-table__column statistics-table__column--number"
                             :title="index + 1 < 10 ? '0' + (index + 1) : index + 1">
                            {{ index + 1 < 10 ? "0" + (index + 1) : index + 1 }}
                        </div>
                        <div class="statistics-table__column bold statistics-table__column--product"
                             :title="bestseller.getProductName()">
                            {{ bestseller.getProductName() }}
                        </div>
                        <div class="statistics-table__column statistics-table__column--restaurant"
                             :title="bestseller.getRestaurantName()">
                            {{ bestseller.getRestaurantName() }}
                        </div>
                    </div>
                    <div class="mobile-group">
                        <div class="statistics-table__column  statistics-table__column--sold"
                             :title="bestseller.getSoldQuantity()">
                            <span class="mobile">počet predaných produktov:</span>&nbsp;{{ bestseller.getSoldQuantity() }}
                        </div>
                        <div class="statistics-table__column mobile-right statistics-table__column--value"
                             :title="bestseller.getTotalSales() | price">
                            {{ bestseller.getTotalSales() | price }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import debounce                 from "lodash/debounce";
    import Loader                   from "@/components/shared/Loader";
    import StatisticsService        from "@/services/StatisticsService";
    import { mapState               } from "vuex";
    import { price                  } from "@/filters/price";
    import { SET_QUERY_PARAMETERS   } from "@/store/lists/mutations";

    export default {

        data () {
            return {
                columns: [
                    { name: '#', cls: 'number' },
                    { name: 'Produkt', cls: 'product' },
                    { name: 'Reštaurácia', cls: 'restaurant' },
                    { name: 'Predaj', cls: 'sold' },
                    { name: 'Tržby', cls: 'value' },
                ],
                bestsellers: StatisticsService.getBestsellersFromTemplate(),
                isLoading: false
            }
        },

        created () {
            this.$store.subscribe(mutation => {
                if (mutation.type === SET_QUERY_PARAMETERS) {
                    this.getBestsellers();
                }
            });
        },

        computed: {
            ...mapState({
                queryParameters: state => state.queryParameters
            })
        },

        methods: {
            getBestsellers () {
                if (!this.queryParameters.restaurants.length) {
                    return;
                }
                this.isLoading = true;
                this.debounceGetBestsellers();
            },
            debounceGetBestsellers: debounce(async function () {
                try {
                    this.bestsellers = await StatisticsService.getBestsellers(this.queryParameters);
                } catch (e) {
                    this.bestsellers = [];
                } finally {
                    this.isLoading   = false;
                }
            }, 500)
        },

        filters: { price },

        components: { Loader }
    };
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .statistics-container {
        position: relative;
        flex-grow: 1;
    }

    .statistics-table {
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
        margin-top: 25px;
        font-size: 13px;
        width: 100%;
        position: relative;
        $parent: &;

        @include respond-to(mobile) {
            margin-top: 0;
        }

        &__column-names {
            overflow: hidden;
            color: $color-bistro-dark-gray;
            @include respond-to(mobile) {
                display: none;
            }
        }

        &__column {
            box-sizing: border-box;
            float: left;
            text-align: left;
            padding: 10px 0 10px 15px;
            background-color: white;
            width: 15%;
            @include text-ellipsis();
            @include respond-to(mobile) {
                padding: 0 0 0 15px;
                width: auto;
            }

            @include respond-to(mobile) {
                padding: 2px 0 2px 15px;
                width: auto;
            }

            &--last {
                border: none;
                @include respond-to(mobile) {
                    width: auto;
                }
            }

            &--number {
                width: 5%;
                @include respond-to(mobile) {
                    width: 15%;
                }
            }

            &--product {
                width: 40%;
                @include respond-to(mobile) {
                    width: 40%;
                }
            }

            &--restaurant {
                width: 25%;
                @include respond-to(mobile) {
                    width: 40%;
                    display: inline-block;
                }
            }

            &--value {
                text-align: right;
                padding: 10px 15px 10px 0;
            }
        }

        &__row {
            color: $color-bistro-dark-gray;
            overflow: hidden;
            display: block;

            @include respond-to(mobile) {
                padding: 5px 0;
            }

            &:nth-child(even){
                background-color: white;
                #{$parent}__column {
                    background-color: white;
                }
            }

            &:nth-child(odd){
                background-color: $color-bistro-lighter-gray;
                #{$parent}__column {
                    background-color: $color-bistro-lighter-gray;
                }
            }
        }

        .mobile {
            display: none;
            @include respond-to(mobile) {
                display: inline-block;
            }
        }

        .mobile-right {
            @include respond-to(mobile) {
                float: right;
                padding: 0 10px 0 0;
            }
        }

        .mobile-group {
            @include respond-to(mobile) {
                width: 100%;
                display: inline;
                background-color: inherit;
            }
        }
    }

    .bold {
        font-weight: bold;
    }
</style>
