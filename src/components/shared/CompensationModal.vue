<template>
    <div class="modal">
        <div class="modal__modal-content modal-content" >
            <button class="modal-content__close-btn close-btn" @click="close">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-content__title title">
                <h2>Ospravedlnenie sa zákazníkovi</h2>
            </div>
            <div class="modal-content__rating rating">
                <div class="left rating__stars stars">
                    <star-icons :grade="rating.getGrade()"
                                :color="rating.getGrade() >= 3 ? 'green' : 'red'">
                    </star-icons>
                    {{ rating.getDateAdd('DD.MM.YYYY') }}
                </div>
                <div class="left rating__content content">
                    <strong>{{ rating.getCustomerName() }} | {{ rating.getPhone() }}</strong><br>
                    {{ rating.getContent() }}
                </div>
            </div>
            <div class="modal-content__compensation compensation">
                <div class="compensation__value value">
                    <input class="value__radio-button radio-button"
                           value="1"
                           type="radio"
                           name="compensation"
                           id="compensation-1"
                           v-model="discountValue">
                    <label for="compensation-1">kupón v hodnote <strong>1€</strong></label>
                </div>
                <div class="compensation__value value">
                    <input class="value__radio-button radio-button"
                           value="2"
                           type="radio"
                           name="compensation"
                           id="compensation-2"
                           v-model="discountValue">
                    <label for="compensation-2">kupón v hodnote <strong>2€</strong></label>
                </div>
                <div class="compensation__value value">
                    <input class="value__radio-button radio-button"
                           value="3"
                           type="radio"
                           name="compensation"
                           id="compensation-3"
                           v-model="discountValue">
                    <label for="compensation-3">kupón v hodnote <strong>3€</strong></label>
                </div>
            </div>
            <div class="modal-content__info info">
                Vybranú výšku ospravedlnenia pošleme zákazníkovi vo forme kupónu,<br>
                ktorý môže po prijatí ospravedlnenia použiť ako<br>
                <b>zľavu pri objednávke jedla vo vašej reštaurácií cez Bistro.sk</b><br>
                <br><br>
                Ak Váš zákazník ospravedlnenie prijíme, pri jeho hodnotení bude<br>
                uvedená informácia: "Reštaurácia sa ospravedlnila"
            </div>
            <div class="modal-content__submit submit">
                <button @click="submit()" class="submit__submit-button submit-button">Odoslať ospravedlnenie</button>
            </div>
        </div>
    </div>
</template>

<script>
    import Rating           from '@/model/Rating';
    import StarIcons        from '@/components/shared/StarIcons';
    import RatingsService   from "@/services/RatingsService";

    export default {

        props: {
            rating : {
                type: Rating,
                required : true
            }
        },

        data () {
            return {
                discountValue: 0
            }
        },

        methods: {
            close () {
                this.$emit("close");
            },
            async submit () {
                if (this.discountValue === 0) {
                    return;
                }
                try {
                    await RatingsService.compensate(this.rating, this.discountValue);
                    this.rating.setCompensation(true);
                    this.close();
                } catch (e) {}
            }
        },

        components: { StarIcons }
    }
</script>
<style lang="scss" scoped>
    @import "~@/shared";

    .left {
        float: left;
    }

    .modal {
        &__modal-content {
            @include respond-to(desktop) {
                width: 550px;
                margin: 250px auto;
                border-radius: 10px;
                padding: 25px;
            }
            @include respond-to(tablet) {
                width: 450px;
                margin: 20px auto;
                border-radius: 10px;
                padding: 25px;
            }
            @include respond-to(mobile) {
                width: 100%;
                margin: 0;
                padding: 0;
                border-radius: 0;
            }
            background-color: white;
            z-index: 50;
            position: relative;
        }
    }

    .modal-content {
        &__close-btn {
            position: absolute;
            top: -13px;
            right: -13px;
            border: 2px solid white;
            background-color: $color-bistro-red;
            color: white;
            width: 28px;
            height: 28px;
            font-weight: bold;
            border-radius: 14px;
            padding: 0;
            text-align: center;
            cursor: pointer;
            @include respond-to(mobile) {
                top: 15px;
                right: 15px;
            }
        }

        &__title {
            color: $color-bistro-dark-gray;
            margin: 0 25px 25px 25px;
            text-align: center;
            @include respond-to(mobile) {
                padding-top: 15px;
                h2 {
                    margin-top: 0;
                }
            }
        }

        &__rating {
            color: $color-bistro-dark-gray;
            background-color: $color-bistro-lighter-gray;
            margin: 10px;
            padding: 10px;
            border-radius: 10px;
            overflow: hidden;
            @include respond-to(desktop) {
                display: flex;
                margin: 25px;
            }
        }

        &__compensation {
            color: $color-bistro-dark-gray;
            text-align: center;
            @include respond-to(desktop) {
                display: flex;
                margin: 25px;
                border: 1px solid $color-bistro-medium-gray;
                border-radius: 15px;
                padding: 10px;
            }
        }

        &__info {
            color: $color-bistro-dark-gray;
            margin: 25px;
            text-align: center;
        }

        &__submit {
            text-align: center;
            margin-top: 25px;
            @include respond-to(tablet) {
                padding-bottom: 25px;
                width: 100%;
            }
        }
    }

    .rating {
        &__stars {
            padding: 0 15px 0 5px;
        }

        &__content {
            @include respond-to(desktop) {
                border-left: 1px solid $color-bistro-light-gray;
                padding: 3px 3px 3px 10px;
                max-width: 70%;
            }
            @include respond-to(tablet) {
                padding: 3px;
                width: 100%;
            }
        }
    }

    .compensation {
        &__value {
            display: inline-block;
            margin: 0 10px;
            @include respond-to(tablet) {
                border: 1px solid $color-bistro-medium-gray;
                border-radius: 15px;
                margin: 10px auto;
                width: 70%;
                padding: 10px;
            }
        }
    }

    .value {
        label {
            margin-right: 10px;
        }

        &__radio-button {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }
    }

    .radio-button {
        &:checked {
            color: red;
            & + label {
                color: $color-bistro-red;
                &:before {
                    color: $color-bistro-red;
                    content: "\f192";
                }
            }
        }

        & + label {
            cursor: pointer;
            &:before {
                font-family: 'Font Awesome 5 Free';
                display: inline-block;
                content: "\f111";
                letter-spacing: 10px;
                font-size: 1.2em;
                color: $color-bistro-dark-gray;
                width: 1.4em;
            }
        }
    }

    .submit {
        &__submit-button {
            text-transform: uppercase;
            background-color: white;
            border-radius: 16px;
            cursor: pointer;
            color: $color-bistro-dark-gray;
            padding: 7px 15px;
            text-decoration: none;
            width: 220px;
            text-align: center;
            margin-right: 15px;
            font-weight: bold;
            border: 1px solid $color-bistro-medium-gray;
        }
    }

    .submit-button {
        &:hover {
            background-color: $color-bistro-red;
            color: white;
            border: 1px solid $color-bistro-red;
        }
    }
</style>
