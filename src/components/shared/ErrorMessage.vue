<template>
    <div class="error-message">
        <v-snackbar
            v-model="visible"
            :timeout="timeout"
            :color="'#B11A29'">
            Prepáčte, nastala neočakávaná chyba.
            <br class="error-message__break" />
            Prosím, skúste opäť neskôr.
        </v-snackbar>
    </div>
</template>

<script>
    import axios from "axios";

    export default {

        props: {
            showError: {
                type: Boolean,
                default: false
            }
        },

        data () {
            return {
                timeout: 5000,
                visible: this.showError
            }
        },

        created () {
            axios.interceptors.response.use(response => response, () => this.visible = true);
        }
    }
</script>

<style lang="scss">
    @import "~@/shared";

    .error-message {
        text-align: center;

        & .v-snack__content {
            justify-content: center !important;
        }

        &__break {
            display: none;
            @include respond-to(tablet) {
                display: initial;
            }
        }
    }
</style>
