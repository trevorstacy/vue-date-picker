<template>
    <div id="app">
        <app-header></app-header>
        <main class="main-wrapper">
            <section class="main">
                <app-sidebar class="main__sidebar"></app-sidebar>
                <app-content class="main__content"></app-content>
                <error-message class="main__error-message"></error-message>
            </section>
        </main>
    </div>
</template>

<script>
    import AppHeader from '@/components/AppHeader';
    import AppSidebar from '@/components/AppSidebar';
    import AppContent from '@/components/AppContent';
    import ErrorMessage from '@/components/shared/ErrorMessage';

    export default {
        components: {
            AppSidebar,
            ErrorMessage,
            AppContent,
            AppHeader
        }
    };
</script>

<style lang="scss">
    @import "~@/shared";

    html {
        height: 100%;
    }

    body {
        margin: 0;
        min-height: 100%;
        font-family: 'Roboto', sans-serif;
    }

    .fa-size {
        &-smallest {
            font-size: .65em;
        }
        &-smaller {
            font-size: .8em;
        }
        &-small {
            font-size: 1em;
        }
        &-medium {
            font-size: 1.5em;
        }
        &-large {
            font-size: 2em;
        }
    }

    .mobile-flex-column-reverse {
        @include respond-to(mobile) {
            display: flex;
            flex-direction: column-reverse;
            justify-content: space-between;
        }
    }

    .main-wrapper {
        display: block;
        width: 100%;
        padding-top: 110px;
        height: calc(100vh - 110px);
        background: {
            image: url("./assets/img/background.png");
            size: 200px;
        }

        @include respond-to(tablet) {
            background: white;
            padding-top: 70px;
            height: calc(100vh - 70px);
        }
    }

    .main {
        background-color: white;
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        align-content: stretch;
        min-height: 100%;
        max-width: $width-page;
        width: 100%;
        margin: 0 auto 50px;
        box-shadow: 1px 1px 15px -3px $color-bistro-medium-gray;

        &::after {
            content: '';
            display: block;
            clear: both;
        }

        @include respond-to(tablet) {
            height: 100%;
        }

        &__sidebar {
            max-width: $width-sidebar;
        }

        &__content {
            max-width: calc(100% - #{$width-sidebar});

            @include respond-to(tablet) {
                max-width: 100%;
            }
        }
    }
</style>
