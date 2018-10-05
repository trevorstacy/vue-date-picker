<template>
    <div class="delivery">
        <div class="delivery__table-wrapper table-wrapper">
            <loader v-if="isLoading"></loader>
            <div v-else-if="deliveries.length === 0" class="table-wrapper__no-results no-results">
                Ľutujeme, pre zvolený dátum neboli nájdené žiadne výsledky.
            </div>
            <div v-else class="table-wrapper__table table">
                <div class="table__row row row--heading heading">
                    <div class="row__column column column--interval">Obdobie</div>
                    <div class="row__column column column--avg-time">Čas tlačiarne</div>
                    <div class="row__clear"></div>
                </div>
                <div v-for="delivery in pagesDeliveries" class="table__row row row--item">
                    <div class="row__column column column--interval">
                        <div class="interval__margin margin margin--from"
                             :class="`margin--${mode === 'hour' ? 'hour' : 'day'}`">
                            {{ delivery.getFrom().format(mode === 'hour' ? 'HH:mm' : 'DD. MMM') }}<br>
                            <span v-if="mode !== 'hour'" class="margin__year year">{{ delivery.getFrom().format('YYYY') }}</span>
                        </div>
                        <div v-if="mode !== 'day'" class="interval__divider">-</div>
                        <div v-if="mode !== 'day'" class="interval__margin margin margin--to"
                             :class="`margin--${mode === 'hour' ? 'hour' : 'day'}`">
                            {{ delivery.getTo().format(mode === 'hour' ? 'HH:mm' : 'DD. MMM') }}<br>
                            <span v-if="mode !== 'hour'" class="margin__year year">{{ delivery.getTo().format('YYYY') }}</span>
                        </div>
                    </div>
                    <div class="row__column column column--avg-time avg-time">
                        <span class="avg-time__text-info">čas tlačiarne:</span>
                        {{ delivery.getAvgTime() }} min.
                    </div>
                    <div class="row__clear"></div>
                </div>
                <pagination :page-count="pageCount"
                            :current-page-number="page"
                            @change="onPageChange">
                </pagination>
            </div>
        </div>
        <div class="delivery__graphs graphs">
            <div class="graphs__graph-wrapper graph-wrapper graph-wrapper--top">
                <loader v-if="isLoading"></loader>
                <div v-else-if="deliveries.length > 0" class="graphs__graph-wrapper graph-wrapper graph-wrapper--top">
                    <div class="graph-wrapper__graph graph">
                        <h3 class="graph__heading">Priemerný potvrdzovaný čas</h3>
                        <GChart v-if="chartData.length > 1"
                                type="LineChart"
                                :data="chartData"
                                :options="compChartOptions">
                        </GChart>
                    </div>
                </div>
                <div v-else class="graph-wrapper__no-results no-results">
                    Ľutujeme, pre zvolený dátum neboli nájdené žiadne výsledky.
                </div>
            </div>
            <div class="graphs__graph-wrapper graph-wrapper graph-wrapper--bottom">
                <loader v-if="isLoading"></loader>
                <div v-else-if="deliveryRatings.length > 0" class="graph-wrapper__graph graph">
                    <h3 class="graph__heading">Hodnotenie času doručenia</h3>
                    <div class="graph__delivery-ratings">
                        <delivery-rating
                                v-for="deliveryRating in deliveryRatings"
                                :deliveryRating="deliveryRating"
                                :key="deliveryRating.getName()"
                                :isMobile="isMobile">
                        </delivery-rating>
                    </div>
                </div>
                <div v-else class="graph-wrapper__no-results no-results">
                    Ľutujeme, pre zvolený dátum neboli nájdené žiadne hodnotenia času doručenia.
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import debounce         from "lodash/debounce";
    import Loader           from "@/components/shared/Loader";
    import Pagination       from "@/components/shared/Pagination";
    import DeliveryRating   from "@/components/shared/DeliveryRating";
    import ScreenService    from "@/services/ScreenService";
    import DeliveryService  from "@/services/DeliveryService";
    import chartOptions     from "@/external/deliveryChartOptions";
    import { DELIVERY_MODES } from "@/model/Delivery";
    import { mapState       } from "vuex";
    import { GChart         } from "vue-google-charts";

    const PER_PAGE = 12;

    export default {
        data () {
            return {
                mode: DELIVERY_MODES.MODE_DAY,
                deliveries: [],
                deliveryRatings: [],
                page: 1,
                isLoading: false,
                isMobile: !ScreenService.isBiggerThan(550)
            }
        },

        created () {
            DeliveryService.addCustomFiltersToStore(this);
            const { deliveries, ratings }   = DeliveryService.getDeliveriesFromTemplate(this.mode);
            this.deliveries                 = deliveries;
            this.deliveryRatings            = ratings;

            ScreenService.isBiggerThan(550, status => this.isMobile = !status);
        },

        computed: {
            ...mapState({
                queryParameters: state => state.queryParameters
            }),
            chartData () {
                let data = this.deliveries.map(item => {
                    const date = item.getDate();
                    return [
                        new Date(
                            +date.format("YYYY"),
                            +date.format("M") - 1,
                            +date.format("D"),
                            +date.format("H"),
                            +date.format("m")
                        ),
                        +item.getAvgTime()
                    ];
                });
                // musi tu byt, ale nevieme preco
                data.unshift(['', '']);
                return data;
            },
            pageCount () {
                return +(this.deliveries.length / PER_PAGE).toFixed(0);
            },
            pagesDeliveries () {
                const from  = (this.page - 1) * PER_PAGE;
                const to    = from + PER_PAGE;
                return this.deliveries.slice(from, to);
            },
            compChartOptions () {
                return {
                    ...chartOptions,
                    hAxis: {
                        format: this.mode === DELIVERY_MODES.MODE_HOUR ? 'HH:mm' : 'dd. MMM yy',
                        textStyle: {
                            fontName: 'Roboto, sans-serif',
                            fontSize: 10,
                        },
                        gridlines : {
                            count: 6
                        },
                        viewWindowMode: 'maximized'
                    }
                };
            }
        },

        methods: {
            getDeliveries () {
                if (!this.queryParameters.restaurants.length) {
                    return;
                }
                this.isLoading = true;
                this.debounceGetDeliveries();
            },
            onPageChange (page) {
                this.page = page;
            },
            debounceGetDeliveries: debounce(async function () {
                try {
                    const { deliveries, ratings } = await DeliveryService.getData({
                        ...this.queryParameters,
                        mode: this.mode
                    });
                    this.deliveries = deliveries;
                    this.deliveryRatings = ratings;
                } catch (e) {
                    this.deliveries = [];
                    this.deliveryRatings = [];
                } finally {
                    this.isLoading   = false;
                }
            }, 500)
        },

        watch: {
            queryParameters () {
                this.page = 1;
                this.getDeliveries();
            },
            mode () {
                this.page = 1;
                this.getDeliveries();
            }
        },

        components: {
            GChart,
            Loader,
            Pagination,
            DeliveryRating
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .delivery {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        align-items: flex-start;
        height: 535px;

        @include respond-to(tablet) {
            justify-content: space-around;
            flex-direction: column;
            height: auto;
            align-items: center;
        }

        @include respond-to(mobile) {
            margin-top: 0;
        }

        &__table-wrapper {
            flex-basis: 310px;
            max-height: 535px;
            height: 100%;

            @include respond-to(tablet) {
                width: 100%;
                max-width: 445px;
                margin-bottom: 15px;
            }

            @include respond-to(mobile) {
                width: 100%;
                max-width: 550px;
                flex-basis: 100px;
            }
        }

        &__graphs {
            width: 445px;
            padding-left: 15px;

            @include respond-to(tablet) {
                padding-left: 0;
            }

            @include respond-to(mobile) {
                width: 100%;
            }
        }
    }

    .table-wrapper {
        background-color: #fff;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.25);
        position: relative;

        @include respond-to(mobile) {
            box-shadow: none;
        }
    }

    .no-results {
        text-align: center;
        font-size: 14px;
        color: $color-bistro-medium-gray;
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        box-sizing: border-box;
        padding: 0 20px;
    }

    .table {
        font-size: 12px;

        &__row {
            height: 36px;
        }
    }

    .row {
        padding: 0 15px;
        box-sizing: border-box;

        @include respond-to(mobile) {
            padding: 0 10px;
        }

        &:nth-child(even) {
            background-color: $color-bistro-lighter-gray;
        }

        &--heading {
            color: $color-bistro-medium-gray;
            font-weight: bold;
            line-height: 36px;

            @include respond-to(mobile) {
                display: none;
            }
        }

        &__clear {
            @include clear-fix();
        }
    }

    .column {
        &--interval {
            float: left;
            color: $color-bistro-medium-gray;
            width: 60%;
            display: flex;

            @include respond-to(mobile) {
                width: 50%;
            }
        }

        &--avg-time {
            float: right;
            font-weight: bold;
            color: $color-bistro-darker-gray;
            width: 40%;
            line-height: 36px;

            @include respond-to(mobile) {
                width: 50%;
            }

            .heading & {
                color: inherit;
            }
        }
    }

    .avg-time {
        &__text-info {
            display: none;
            font-weight: normal;

            @include respond-to(mobile) {
                display: inline;
            }
        }
    }

    .margin {
        &--day {
            min-width: 43px;
            line-height: 15px;
            text-transform: uppercase;
            padding-top: 4px;
        }

        &--hour {
            line-height: 36px;
        }

        &__year {
            font-size: 10px;
        }
    }

    .interval {
        &__divider {
            line-height: 36px;
            padding: 0 5px;
        }
    }

    .graphs {
        &__graph-wrapper {
            width: 100%;
            box-shadow: 0 0 4px 0 rgba(0,0,0,0.25);
            &:first-child {
                margin-bottom: 15px;
            }
        }
    }
    
    .graph-wrapper {
        background-color: #fff;
        position: relative;

        &--top {
            height: 275px;
        }

        &--bottom {
            height: 244px;
        }
    }

    .graph {
        &__heading {
            width: 100%;
            font-size: 16px;
            text-align: left;
            padding-left: 17px;
            color: $color-bistro-dark-gray;
            box-sizing: border-box;
            margin: 0;
            padding-top: 25px;
            padding-bottom: 16px;
        }

        &__delivery-ratings {
            display: flex;
            justify-content: space-around;
            align-items: flex-start;
            margin-top: 15px;

            @include respond-to(mobile) {
                flex-direction: column;
                align-items: center;
            }
        }
    }

</style>