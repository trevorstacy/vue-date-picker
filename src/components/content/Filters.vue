<template>
    <div class="filters-container">
        <div class="filters-container__header filters-header">
            <h1 v-if="title" class="filters-header__title">{{ title }}</h1>
            <button class="filters-header__trigger"
                    type="button"
                    @click="filtersVisible = !filtersVisible">
                <i class="filters-header__icon fas fa-sliders-h fa-size-medium"></i>
            </button>
        </div>
        <transition name="roll-down">
            <div v-show="filtersVisible || !isMobile" class="filters">
                <restaurant-filter class="filters__filter filters__filter--restaurants">
                </restaurant-filter>

                <month-filter class="filters__filter filters__filter--full-width">
                </month-filter>

                <date-interval-filter class="filters__filter filters__filter--date-intervals">
                </date-interval-filter>

                <div class="filters__placeholder"></div>

                <component class="filters__filter filters__filter--custom"
                           v-for="(customFilter, index) in customFilters"
                           :is="customFilter.component"
                           :key="index">
                </component>
            </div>
        </transition>
    </div>
</template>

<script>
    import MonthFilter          from "@/components/content/filters/MonthFilter";
    import ScreenService        from "@/services/ScreenService";
    import RestaurantFilter     from "@/components/content/filters/RestaurantFilter";
    import DateIntervalFilter   from "@/components/content/filters/DateIntervalFilter";
    import { mapState           } from "vuex";

    export default {

        props: {
            areFiltersVisible: {
                type: Boolean,
                required: false,
                default: false
            },
            title: {
                type: String,
                required: false,
                default: ''
            }
        },

        data () {
            return {
                filtersVisible: false,
                isMobile: !ScreenService.isBiggerThan(550)
            };
        },

        created () {
            ScreenService.isBiggerThan(550, status => this.isMobile = !status);
        },

        computed: {
            ...mapState({
                customFilters: state => state.customFilters
            })
        },

        components: {
            MonthFilter,
            RestaurantFilter,
            DateIntervalFilter
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .filters-container {
        @include respond-to(mobile) {
            margin-bottom: 15px;
        }
    }

    .filters-header {
        $parent: &;
        @include clear-fix();
        @include respond-to(mobile) {
            margin-bottom: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            align-content: center;
        }

        &__title {
            display: none;
            margin: 0 auto 0 0;
            color: $color-bistro-dark-gray;
            font-size: 28px;
            font-weight: 500;
            @include respond-to(mobile) {
                display: block;
            }
        }

        &__trigger {
            display: none;
            padding: 16px;
            color: white;
            background-color: $color-bistro-red;
            border-radius: 50%;
            float: right;
            outline: none;

            #{$parent}__icon {
                transform: rotate(90deg);
            }

            @include respond-to(mobile) {
                display: block;
            }
        }
    }

    .filters {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        max-height: 500px;
        @include respond-to(mobile) {
            margin-top: 15px;
            float: right;
        }

        &--invisible {
            @include respond-to(mobile) {
                display: none;
            }
        }

        &__filter {
            margin-bottom: 10px;
            @include respond-to(tablet) {
                width: 100%;
            }

            &--restaurants {
                display: none !important;
                @include respond-to(tablet) {
                    display: inline-block !important;
                }
            }

            &--custom {
                margin-left: 5px;
                @include respond-to(tablet) {
                    width: auto;
                }
                @include respond-to(mobile) {
                    width: 100%;
                    margin-left: 0;
                }
            }

            &--full-width {
                width: 100%;
                margin-left: 0;
            }
        }

        &__placeholder {
            @include respond-to(desktop) {
                flex-grow: 1;
            }
        }
    }

    .roll-down-enter-active,
    .roll-down-leave-active {
        transition: max-height .35s, margin-top .25s, opacity .25s;
        max-height: 300px;
    }

    .roll-down-enter,
    .roll-down-leave-to {
        opacity: 0;
        max-height: 0;
        margin-top: 0;
    }
</style>
