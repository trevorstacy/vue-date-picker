<template>
    <aside class="sidebar">

        <!-- START Restaurants -->
        <div class="sidebar__upper-section restaurants-filter" v-if="restaurants.length">
            <h3 class="restaurants-filter__title">Vyberte si reštauráciu:</h3>
            <sidebar-restaurant v-for="(restaurant, index) in restaurants"
                               :restaurant="restaurant"
                               :key="index">
            </sidebar-restaurant>
            <divider class="restaurants-filter__divider" :color="'rgba(255,255,255,0.6)'"></divider>
            <div class="restaurants-filter__select-all-button select-all-button"
                 @click="activateAllRestaurants()"
                 :class="{ 'select-all-button--disabled': isEveryRestaurantActive }">

                <i v-if="isEveryRestaurantActive"
                   class="select-all-button__icon far fa-size-smaller fa-dot-circle">
                </i>
                <i v-else
                   class="select-all-button__icon far fa-size-smaller fa-circle">
                </i>
                <span class="select-all-button__text">Vybrať všetky</span>

            </div>
        </div>
        <!-- END Restaurants -->

        <div class="sidebar__middle-section"></div>

        <regional-manager class="sidebar__bottom-section"></regional-manager>
    </aside>
</template>

<script>
    import Divider              from '@/components/shared/Divider';
    import RegionalManager      from '@/components/sidebar/RegionalManager';
    import SidebarRestaurant    from '@/components/sidebar/SidebarRestaurant';
    import { mapState, mapMutations, mapGetters } from 'vuex';
    import { ACTIVATE_ALL_RESTAURANTS } from '@/store/lists/mutations';
    import { GET_AVAILABLE_RESTAURANTS } from '@/store/lists/actions';
    import {ACTIVE_RESTAURANTS} from "@/store/lists/getters";

    export default {

        created () {
            this.$store.dispatch(GET_AVAILABLE_RESTAURANTS);
        },

        computed: {
            ...mapState({
                restaurants: state => state.restaurants,
            }),
            ...mapGetters({
                activeRestaurants: ACTIVE_RESTAURANTS
            }),
            isEveryRestaurantActive () {
                return this.restaurants.length === this.activeRestaurants.length;
            }
        },

        methods: {
            ...mapMutations({
                activateAllRestaurants: ACTIVATE_ALL_RESTAURANTS
            })
        },

        components: {
            Divider,
            RegionalManager,
            SidebarRestaurant
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .sidebar {
        width: 100%;
        background-color: $color-bistro-red;
        display: flex;
        flex-direction: column;
        padding: 10px 0;
        @include respond-to(tablet) {
            display: none;
        }

        &__upper-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            align-content: center;
        }

        &__middle-section {
            flex-grow: 1;
        }

        &__bottom-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            align-content: center;
            margin: 50px 0 30px;
        }
    }

    .restaurants-filter {
        &__title {
            color: white;
            font-size: 14px;
            width: 100%;
            text-align: center;
            font-weight: 500;
            margin-bottom: 2.1em;
        }

        &__divider {
            margin-top: -10px;
            width: 65% !important;
        }

        &__select-all-button {
            color: white;
        }
    }

    .select-all-button {
        margin-top: 6px;
        cursor: pointer;

        &__text {
            margin-left: .25em;
            font-size: 12px;
            text-transform: uppercase;
        }

        &--disabled {
            pointer-events: none;
            color: $color-disabled;
        }
    }
</style>
