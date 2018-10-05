<template>
    <div class="delivery-rating">
        <svg :viewbox="`0 0 ${width} ${width}`"
             class="delivery-rating__circular-chart circular-chart">
            <path class="circular-chart__circle circle circle--full"
                  :stroke-dasharray="`${circuit}, ${circuit}`"
                  :d="`M${x} ${y}
                    a ${r} ${r} 0 0 1 0 ${d}
                    a ${r} ${r} 0 0 1 0 -${d}`">
            </path>
            <path class="circular-chart__circle circle circle--part"
                  :class = "{ 'circle--null-stroke': delayedValue === 0 }"
                  :stroke-dasharray="`${computedValue}, ${circuit}`"
                  :d="`M${x} ${y}
                    a ${r} ${r} 0 0 1 0 ${d}
                    a ${r} ${r} 0 0 1 0 -${d}`">
            </path>
        </svg>
        <div class="delivery-rating__value value">
            {{ delayedValue }} <span class="value__percent">%</span>
        </div>
        <div class="delivery-rating__name name">{{ deliveryRating.getTranslatedName() }}</div>
    </div>
</template>

<script>
    import DeliveryRating   from "@/model/DeliveryRating";
    import delay            from "lodash/delay";

    const MOBILE_CIRCUIT    = 350;
    const DESKTOP_CIRCUIT   = 250;
    const MOBILE_WIDTH      = 160;
    const DESKTOP_WIDTH     = 100;

    export default {
        props: {
            deliveryRating: {
                type: DeliveryRating,
                required: true
            },
            isMobile: {
                type: Boolean,
                required: true
            }
        },

        data () {
            return {
                delayedValue: 0
            }
        },

        created () {
            this.delayedValue = this.deliveryRating.getValue();
        },

        computed: {
            circuit () {
                return this.isMobile ? MOBILE_CIRCUIT : DESKTOP_CIRCUIT;
            },
            width () {
                return this.isMobile ? MOBILE_WIDTH : DESKTOP_WIDTH;
            },
            computedValue () {
                return (this.delayedValue / 100) * this.circuit;
            },
            r () {
                return this.circuit / (2 * Math.PI);
            },
            d () {
                return 2 * this.r;
            },
            x () {
                return this.width / 2;
            },
            y () {
                return (this.width - this.d) / 2;
            }
        },

        methods: {
            updateDelayedValue (change) {
                this.delayedValue += change;
            }
        },

        watch: {
            deliveryRating () {
                const diff      = this.deliveryRating.getValue() - this.delayedValue;
                const change    = diff < 0 ? -1 : 1;
                const i         = diff * change;
                const interval  = 400 / i;

                for (let j = 0; j < i; j++) {
                    delay(this.updateDelayedValue, interval * (j + 1), change);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .delivery-rating {
        position: relative;

        &__circular-chart {
            display: block;
            max-width: 102px;
            max-height: 102px;
            margin: 0 auto;

            @include respond-to(mobile){
                max-width: 160px;
                max-height: 160px;
            }
        }

        &__value {
            width: 60px;
            height: 24px;
            position: absolute;
            top: 40px;
            left: 22px;

            @include respond-to(mobile){
                width: 80px;
                height: 50px;
                top: 62px;
                left: 42px;
            }
        }

        &__name {
            margin-top: 10px;

            @include respond-to(mobile) {
                margin-top: 5px;
                margin-bottom: 15px;
            }
        }
    }

    .value {
        font-weight: bold;
        font-size: 20px;
        color: $color-bistro-medium-gray;
        text-align: center;

        @include respond-to(mobile) {
            font-size: 35px;
        }

        &__percent {
            font-size: 12px;
            margin-left: -4px;

            @include respond-to(mobile){
                font-size: 22px;
                margin-left: -10px;
            }
        }
    }

    .name {
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        color: $color-bistro-darker-gray;
    }

    .circular-chart {
        &__circle {
            fill: none;
            stroke-width: 14px;
            stroke-linecap: round;

            @include respond-to(mobile) {
                stroke-width: 22px;
            }
        }

        &__circle--null-stroke {
            stroke-width: 0;
        }
    }

    .circle {

        &--full {
            stroke: $color-bistro-lighter-gray;
        }

        &--part {
            stroke: $color-bistro-red;
            animation: progress 1s ease-out forwards;
        }

        &--null-stroke {
            stroke-width: 0;
        }
    }

    @keyframes progress {
        0% {
            stroke-dasharray: 0 350;
        }
    }
</style>