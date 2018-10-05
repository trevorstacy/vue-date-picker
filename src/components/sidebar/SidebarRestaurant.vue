<template>
    <div v-if="restaurant"
         class="sidebar-restaurant"
         :class="{ 'sidebar-restaurant--active': restaurant.isActive() }"
         @click="triggerActive(restaurant)">

        <div class="sidebar-restaurant__logo logo"
             :style="{ backgroundImage: 'url(' + restaurant.getLogoURL() + ')' }">
            <transition name="blink">
                <i v-if="restaurant.isActive()" class="logo__check fa fa-check fa-size-small"></i>
            </transition>
        </div>

        <span class="sidebar-restaurant__name">{{ restaurant.getName() }}</span>
    </div>
</template>

<script>
    import { mapMutations               } from 'vuex';
    import { TRIGGER_ACTIVE_RESTAURANT  } from '@/store/lists/mutations';

    export default {
        props: {
            restaurant: {
                type: Object,
                required: true
            }
        },
        methods: {
            ...mapMutations({
                triggerActive: TRIGGER_ACTIVE_RESTAURANT
            })
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .sidebar-restaurant {
        width: 100px;
        cursor: pointer;
        opacity: 0.45;
        transition: .4s opacity, .4s border;
        margin-bottom: 1.5em;

        &--active, &:hover {
            opacity: 1;

            .sidebar-restaurant__logo {
                border: 2px solid white;
                height: $height-sidebar-logo - 4px;
                width: $width-sidebar-logo - 4px;
            }
        }

        &__logo {
            height: $height-sidebar-logo;
            width: $width-sidebar-logo;
            border-radius: 50%;
            margin: 0 auto;
            background: {
                size: cover;
                position: center center;
            }
            position: relative;
        }

        &__name {
            color: white;
            font-size: 14px;
            font-weight: lighter;
            margin: .3em 0;
            display: block;
            text-transform: uppercase;
            text-align: center;
        }

        .logo__check {
            width: 30px;
            height: 30px;
            color: white;
            background-color: $color-bistro-green;
            top: -3px;
            right: -3px;
            display: flex;
            justify-content: center;
            align-items: center;
            align-content: center;
            position: absolute;
            border-radius: 50%;
            border: 1px solid white;
        }
    }

    .blink {
        &-enter-active {
            animation: blink .4s;
        }
        &-leave-active {
            animation: blink .25s reverse;
        }
    }

    @keyframes blink {
        0% { transform: scale(0) rotate(-180deg); }
        75% { transform: scale(1.2) rotate(340deg); }
        100% { transform: scale(1) rotate(360deg); }
    }
</style>
