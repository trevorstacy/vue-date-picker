<template>
    <div v-if="regionalManager" class="regional-manager">

        <div v-if="regionalManager.photo" class="regional-manager__photo"
             :style="{ backgroundImage: 'url(' + regionalManager.photo + ')' }">
        </div>

        <div class="regional-manager__name">{{ regionalManager.name }}</div>

        <div class="regional-manager__email email">
            <a class="regional-manager__action" :href="'mailto:' + regionalManager.email">
                <i class="email__icon fa fa-size-smaller fa-envelope"></i> {{ regionalManager.email }}
            </a>
        </div>

        <div class="regional-manager__phone phone">
            <a class="regional-manager__action" :href="'tel:' + regionalManager.phone">
                <i class="phone__icon fa fa-size-smaller fa-phone"></i> {{ regionalManager.phone }}
            </a>
        </div>

        <divider class="regional-manager__divider" :color="'rgba(255,255,255,0.6)'"></divider>

        <div class="regional-manager__position">Váš regionálny manažér</div>
    </div>
</template>

<script>
    import Divider from '@/components/shared/Divider';
    import CustomerService from '@/services/CustomerService';

    export default {

        data() {
            return {
                regionalManager: undefined
            }
        },

        created () {
            this.getRegionalManager();
        },

        methods: {
            async getRegionalManager() {
                this.regionalManager = await CustomerService.getRegionalManager();
            }
        },

        components: { Divider }
    }
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .regional-manager {
        color: white;

        &__photo {
            width: $width-sidebar-logo;
            height: $height-sidebar-logo;
            border-radius: 50%;
            background: {
                position: center center;
                size: cover;
            }
        }

        &__name {
            font-size: 14px;
            font-weight: 500;
            margin: .3em 0 .2em;
            color: $color-disabled-brightest;
        }

        &__divider {
            width: 20%;
            margin: 4px 0;
        }

        &__action {
            color: inherit;
            text-decoration: none;
        }

        &__email {
            color: $color-disabled-brighter;
            font-size: 12px;
            line-height: 1.5em;
            font-weight: 300;
        }

        &__phone {
            @extend .regional-manager__email;
        }

        &__position {
            @extend .regional-manager__email;
            font-style: italic;
        }

        .phone__icon, .email__icon {
            margin-right: .2em;
            display: inline-block;
        }

        .phone__icon {
            transform: rotate(90deg);
        }
    }
</style>