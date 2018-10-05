<template>
    <div v-if="!restaurants.length" class="content-wrapper content-wrapper--no-restaurant-selected">
        <p class="content-wrapper__text">
            K vášmu účtu nie sú priradené žiadne reštaurácie.
            <br>
            Prosím, kontaktujte našu technickú podporu.
            <br><br>
            Ďakujeme.
        </p>
    </div>
    <div v-else-if="activeRestaurants.length" class="content-wrapper">
        <navigation class="content-wrapper__navigation" active="orders"></navigation>
        <router-view></router-view>
    </div>
    <div v-else class="content-wrapper content-wrapper--no-restaurant-selected">
        <p class="content-wrapper__text">Prosím, najskôr vyberte minimálne jednu reštauráciu</p>
    </div>
</template>

<script>
    import Navigation               from "@/components/content/Navigation";
    import { mapState, mapGetters   } from "vuex";
    import { ACTIVE_RESTAURANTS     } from "@/store/lists/getters";

    export default {
        computed: {
            ...mapState({
                restaurants: state => state.restaurants
            }),
            ...mapGetters({
                activeRestaurants: ACTIVE_RESTAURANTS
            })
        },
        components: {
            Navigation
        }
    };
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .content-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        background-color: $color-bistro-lighter-gray;

        &--no-restaurant-selected {
            justify-content: center;
            align-items: center;
            align-content: center;
        }

        &__text {
            text-align: center;
            font-size: 20px;
            color: #999;
            font-weight: lighter;
            line-height: 1.5;
        }

        &__navigation {
            @include respond-to(tablet) {
                box-shadow: 1px 1px 15px -3px $color-bistro-medium-gray;
                margin-bottom: 10px;
            }
        }

        &__content {
            padding: 20px 35px;
            height: 100%;
            display: flex;
            flex-direction: column;
            @include respond-to(mobile) {
                padding: 20px;
            }
        }
    }
</style>
