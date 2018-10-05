<template>
    <div class="daily-menu">
        <day-filter @changeDay="changeDay"></day-filter>
        <loader v-if="isLoading"></loader>
        <p v-else-if="dailyMenusByActiveDay.length === 0" class="daily-menu__no-results no-results">
            Ľutujeme, pre zvolený deň nie je nastavené žiadne dené menu.
        </p>
        <div v-else class="daily-menu__table table">
            <div v-if="dailyMenusByActiveDay.length" class="table__row row row--heading">
                <div class="row__column column column--product-name">Názov jedla</div>
                <div class="row__column column column--product-category">Kategória</div>
                <div class="row__column column column--product-state" style="text-indent: 1px;"></div>
            </div>
            <div class="table__row row row--item" v-for="dailyMenu in dailyMenusByActiveDay">
                <div class="row__column column column--product-name">{{ dailyMenu.getName() }}</div>
                <div class="row__column column column--product-category">{{ dailyMenu.getCategoryName() }}</div>
                <div class="row__column column column--product-state">
                    <transition name="switch" mode="out-in">
                        <div class="column__state-switch state-switch"
                             :class="{ 'state-switch--disabled': !dailyMenu.isActive() }"
                             @click="setActive(dailyMenu, !dailyMenu.isActive())">
                            <span class="state-switch__text">
                                {{ dailyMenu.isActive() ? 'Zapnuté' : 'Vypnuté' }}
                            </span>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Loader               from "@/components/shared/Loader";
    import debounce             from "lodash/debounce";
    import DayFilter            from "@/components/content/filters/DayFilter";
    import DailyMenuService     from "@/services/DailyMenuService";
    import { mapState           } from "vuex";

    export default {

        data () {
            return {
                dailyMenus: [],
                activeDay: null,
                isLoading: false
            }
        },

        created () {
            this.dailyMenus = DailyMenuService.preloadDailyMenuFromTemplate();
            this.activeDay  = DailyMenuService.getActiveDay();
        },

        computed: {
            dailyMenusByActiveDay () {
                return this.dailyMenus.filter(dm => dm.getDays().includes(this.activeDay.getNumeric() + ''));
            },
            ...mapState({
                queryParameters: state => state.queryParameters
            })
        },

        methods: {
            changeDay (day) {
                this.activeDay = day;
            },
            async setActive (dailyMenu, active) {
                try {
                    await DailyMenuService.setActiveState(dailyMenu, active);
                    this.dailyMenus.map(item => {
                        if (item.getId() === dailyMenu.getId()) {
                            item.setActive(active);
                        }
                    });
                } catch (e) {}
            },
            getDailyMenus () {
                if (!this.queryParameters.restaurants.length) {
                    return;
                }
                this.isLoading = true;
                this.debounceFetchDailyMenu();
            },
            debounceFetchDailyMenu: debounce(async function () {
                try {
                    this.dailyMenus = await DailyMenuService.getDailyMenus(this.queryParameters);
                } catch (e) {
                    this.dailyMenus = [];
                } finally {
                    this.isLoading   = false;
                }
            }, 500),
        },

        watch: {
            queryParameters () {
                this.getDailyMenus()
            }
        },

        components: {
            Loader,
            DayFilter
        }
    };
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    $padding-desktop: 30px;
    $padding-tablet: 12px;

    .daily-menu {
        position: relative;
        height: 100%;

        &__table {
            margin-top: 30px;
        }
    }

    .table {
        background-color: #fff;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.25);

        &__row {
            display: flex;
            justify-content: space-between;

            @include respond-to(mobile) {
                flex-direction: column;
            }
        }
    }

    .no-results {
        text-align: center;
        margin-top: 130px;
        font-size: 18px;
        color: $color-bistro-dark-gray;
    }

    .row {
        padding: 0 $padding-desktop;
        font-size: 13px;
        color: $color-bistro-dark-gray;

        @include respond-to(tablet) {
            padding: 0 $padding-tablet;
        }

        &--heading {
            line-height: 34px;
            font-weight: bold;

            @include respond-to(mobile) {
                display: none;
            }
        }

        &--item {
            min-height: 48px;
            line-height: 26px;
            position: relative;

            @include respond-to(mobile) {
                line-height: 20px;
                padding-top: 5px;
                padding-bottom: 5px;
            }

            &:nth-child(even) {
                background-color: $color-bistro-lighter-gray;
            }
        }

        &__column {
            padding: 0 10px;
            display: inline-flex;
            align-items: center;

            @include respond-to(mobile) {
                padding: 0;
            }
        }
    }

    .column {
        &--product-name {
            flex-grow: 6;
            flex-basis: 300px;
            padding-left: 0;

            @include respond-to(tablet) {
                flex-basis: 390px;
            }

            @include respond-to(mobile) {
                flex-basis: 0;
                width: calc(100% - 60px);
            }
        }

        &--product-category {
            flex-grow: 2;
            flex-basis: 110px;

            @include respond-to(tablet) {
                flex-basis: 170px;
            }

            @include respond-to(mobile) {
                flex-basis: 0;
                width: calc(100% - 60px);
            }
        }

        &--product-state {
            flex-grow: 6;
            flex-basis: 110px;
            padding-right: 0;
            text-align: left;
            justify-content: flex-end;

            @include respond-to(tablet) {
                flex-basis: 70px;
            }

            @include respond-to(mobile) {
                flex-basis: 0;
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
            }
        }

        &__state-switch {
            max-width: 95px;
            height: 25px;
            width: 50px;

            @include respond-to(tablet) {
                width: calc(100% - 35px);
                max-width: 40px;
            }

            @include respond-to(mobile) {
                float: right;
                width: 20px;
            }
        }
    }

    .state-switch {
        border-radius: 15px;
        cursor: pointer;
        font-size: 10px;
        line-height: 25px;
        color: #fff;
        letter-spacing: .5px;
        background-color: $color-bistro-green;
        padding-right: 35px;
        position: relative;
        transition: padding .15s ease-in;
        text-indent: 12px;

        &::after {
            position: absolute;
            top: 0;
            right: 0;
            content: '';
            display: block;
            height: 23px;
            width: 23px;
            margin-top: 1px;
            margin-right: 1px;
            background-color: #fff;
            border-radius: 50%;
            box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.35);
            transition: right .25s ease-in-out;
        }

        &--disabled {
            background-color: $color-bistro-medium-gray;
            padding-right: 15px;
            padding-left: 20px;

            &::after {
                right: calc(100% - 23px - 1px);
            }
        }

        &__text {
            font-weight: bold;
            @include respond-to(tablet) {
                display: none;
            }
        }
    }
</style>
