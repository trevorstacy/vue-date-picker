<template>
    <nav class="navigation">
        <ul class="navigation__menu menu">
            <router-link class="menu__item menu-item"
                         tag="li"
                         v-for="menuItem in menuItems"
                         v-if="menuItem.routeName !== 'dailyMenus' || showDailyMenu"
                         :to="{ name: menuItem.routeName }"
                         :class="{'menu-item--active': $route.name === menuItem.routeName }"
                         :title="menuItem.name"
                         :key="menuItem.name">
                <i class="menu-item__icon" :class="[menuItem.iconClass]"></i>
                <span class="menu-item__text">{{ menuItem.name }}</span>
            </router-link>
        </ul>
    </nav>
</template>

<script>
    import menuItems from "@/data/menu-items";
    import { ACTIVE_RESTAURANTS } from "@/store/lists/getters";
    import { mapState, mapGetters } from "vuex";

    export default {

        data() {
            return {
                menuItems
            };
        },

        computed: {
            ...mapState({
                queryParameters: state => state.queryParameters
            }),
            ...mapGetters({
                activeRestaurants: ACTIVE_RESTAURANTS
            }),
            showDailyMenu () {
                return !!this.activeRestaurants.filter(item => item.getAllowDmToggle()).length;
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .navigation {
        padding: 0 20px;
        background-color: white;
    }

    .menu {
        font-size: 14px;
        padding: 0;
        margin: 0;
        display: flex;
        @include respond-to(tablet) {
            justify-content: space-around;
        }
    }

    .menu-item {
        display: inline-flex;
        justify-content: space-between;
        align-content: center;
        align-items: center;
        cursor: pointer;
        margin: 0 .5em;
        border-bottom: 4px solid transparent;
        text-decoration: none;
        padding: 1.5em .3em .5em;
        color: inherit;
        @include respond-to(tablet) {
            padding: .5em .3em;
            font-size: 22px;
            flex-grow: 1;
            text-align: center;
            margin: 0 .2em;
        }

        &__text {
            @include respond-to(tablet) {
                display: none;
            }
        }

        &__icon {
            display: inline-block;
            color: $color-bistro-disabled;
            margin-right: 4px;
            @include respond-to(tablet) {
                width: 100%;
            }
        }

        &:hover {
            & .menu-item__icon {
                color: $color-bistro-red;
            }
        }

        &.router-link-active {
            border-color: $color-bistro-red;

            & .menu-item__icon {
                color: $color-bistro-red;
            }
        }
    }
</style>
