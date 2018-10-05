<template>
    <header class="header-wrapper">
        <section class="header">
            <div class="header__logo"></div>
            <div class="header__fill"></div>
            <router-link to="/"
                         title="Odhlásiť"
                         class="header__logout">
                <i class="fas fa-power-off"></i>
            </router-link>
        </section>
    </header>
</template>

<style lang="scss" scoped>
    @import "~@/shared";

    .header-wrapper {
        width: 100%;
        padding: 0 20px;
        height: 70px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: white;
        box-shadow: 0 0 15px -2px #999;
        box-sizing: border-box;

        @include respond-to(tablet) {
            width: 100%;
            padding: 0 40px;
            box-shadow: none;
        }

        @include respond-to(mobile) {
            width: 100%;
            padding: 0 20px;
        }
    }

    .header {
        max-width: calc(#{$width-page} - 40px);
        width: 100%;
        margin: 0 auto;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-content: center;
        align-items: center;

        @include respond-to(tablet) {
            justify-content: flex-end;
        }

        &__logo {
            background: {
                image: url("~@/assets/img/logo.png");
                repeat: no-repeat;
                position: center;
                size: contain;
            }
            height: 100%;
            width: 130px;
        }

        &__fill {
            flex-grow: 1;
        }

        &__logout {
            display: inline-block;
            color: $color-bistro-light-gray;
            font-size: 18px;

            &:hover {
                color: $color-bistro-red;
            }

            @include respond-to(mobile) {
                text-indent: -14px;
            }
        }
    }
</style>
