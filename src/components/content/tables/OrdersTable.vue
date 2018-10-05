<template>
    <div class="orders-container">

        <loader v-if="isLoading"></loader>

        <p v-else-if="!orders.length" class="orders-no-data">
            Ľutujeme, za vybrané obdobie sa nepodarilo nájsť žiadne objednávky.
        </p>

        <div v-else class="orders-table">

            <table-header type="Objednávky"></table-header>

            <div class="orders-table__header">
                <div class="orders-table__count">
                    <span class="bold">Počet objednávok</span>
                    <span class="tablet-group">
                        <span class="right">
                            {{ information.acceptedTotal }}&nbsp;/&nbsp;<strong>{{ information.countTotal }}</strong>
                        </span>
                        <span class="right">(akceptovaných&nbsp;/&nbsp;<strong>všetkých</strong>)</span>
                    </span>
                </div>
                <divider class="orders-table__separator" color="#EFEFEF"></divider>
                <div class="orders-table__sales bold">
                    <span class="bold ellipsis">
                        Tržby <span class="desktop-only">z akceptovaných objednávok</span>
                    </span>
                    <span class="bistro-red right">{{ information.priceTotal | price }}</span>
                </div>
                <divider class="orders-table__separator desktop-only" color="#EFEFEF" :size="35">
                </divider>
            </div>

            <div class="orders-table__body">
                <div class="orders-table__column-names bold">
                    <div v-for="(column, index) in columns"
                         class="orders-table__column"
                         :class="{
                            'orders-table__column--last': index === columns.length - 1,
                            'prices': column === 'Cena'
                         }">
                        {{ column }}
                    </div>
                </div>
                <div class="orders-table__data">
                    <a class="orders-table__row" v-for="order in orders" :href="getDetailUrl(order.getId())">
                        <div class="tablet-group">
                            <div class="orders-table__column bistro-red">{{ order.getId() }}</div>
                            <div class="orders-table__column">{{ order.getCustomer().getFullName() }}</div>
                        </div>
                        <div class="tablet-group">
                            <div class="orders-table__column">{{ order.getDateAdd().format('DD.MM.YYYY') }}</div>
                        </div>
                        <div class="tablet-group">
                            <div class="orders-table__column">
                                <span class="flex"
                                      v-if="order.getPaymentMethod() === PAYMENT_TYPES.PAYMENT_TYPE_CASH">
                                    <i class="fas fa-money-bill-alt"></i>&nbsp;&nbsp;Hotovost
                                </span>
                                <span class="flex" v-else>
                                    <i class="far fa-credit-card"></i>&nbsp;&nbsp;Kartou
                                </span>
                            </div>
                            <div class="orders-table__column prices">
                                {{ order.getPrice().getTotalPrice() | price }}
                            </div>
                            <div class="orders-table__column orders-table__column--last">
                                <span class="bistro-green"
                                      v-if="order.getCurrentState() === ORDER_STATES.STATE_ACCEPTED">
                                    <i class="fas fa-check-circle"></i>&nbsp;&nbsp;Akceptovaná
                                </span>
                                <span class="bistro-red"
                                      v-else-if="order.getCurrentState() === ORDER_STATES.STATE_REJECTED">
                                    <i class="fas fa-times-circle"></i>&nbsp;&nbsp;Zrušená zákazníkom
                                </span>
                                <span class="bistro-gray"
                                      v-else-if="order.getCurrentState() === ORDER_STATES.STATE_PROGRESS">
                                    <i class="fas fa-spinner"></i>&nbsp;&nbsp;Prebieha spracovanie
                                </span>
                                <span class="bistro-blue"
                                      v-else-if="order.getCurrentState() === ORDER_STATES.STATE_PREORDER">
                                    <i class="fas fa-box"></i>&nbsp;&nbsp;Predobjednávka
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            <pagination :page-count="information.pageCount"
                        :current-page-number="page"
                        @change="onPageChange">
            </pagination>
        </div>
    </div>
</template>

<script>
    import Loader           from "@/components/shared/Loader";
    import Divider          from "@/components/shared/Divider";
    import debounce         from "lodash/debounce";
    import Pagination       from "@/components/shared/Pagination";
    import TableHeader      from '@/components/shared/TableHeader.vue';
    import OrdersService    from "@/services/OrdersService";
    import { mapState       } from "vuex";
    import { price          } from "@/filters/price";
    import { SET_QUERY_PARAMETERS } from "@/store/lists/mutations";
    import { PAYMENT_TYPES, ORDER_STATES } from "@/model/Order";

    export default {

        data () {
            return {
                orders: OrdersService.getOrdersFromTemplate(),
                information: OrdersService.getOrdersInformationFromTemplate(),
                page: 1,
                isLoading: false,
                currentState: 0,
                paymentMethod: 0,
                columns: [
                    'Číslo',
                    'Zákazník',
                    'Dátum',
                    'Forma platby',
                    'Cena',
                    'Stav',
                ],
                PAYMENT_TYPES,
                ORDER_STATES
            }
        },

        created () {
            OrdersService.addCustomFiltersToStore(this);
            this.$store.subscribe(mutation => {
                if (mutation.type === SET_QUERY_PARAMETERS) {
                    this.page = 1;
                    this.getOrders();
                }
            });
        },

        computed: {
            ...mapState({
                queryParameters: state => state.queryParameters
            })
        },

        methods: {
            getOrders () {
                if (!this.queryParameters.restaurants.length) {
                    return;
                }
                this.isLoading = true;
                this.debounceGetOrders();
            },
            onPageChange (page) {
                this.page = +page;
                this.getOrders();
            },
            getDetailUrl (idOrder) {
                return BackendRoutes.get('orders_detail', { ...this.queryParameters, idOrder })
            },
            debounceGetOrders: debounce(async function () {
                const filters = {
                    ...this.queryParameters,
                    page: this.page
                };
                if (this.currentState && this.currentState > 0) {
                    filters.currentState = this.currentState;
                }
                if (this.paymentMethod && this.paymentMethod > 0) {
                    filters.paymentMethod = this.paymentMethod;
                }
                try {
                    const { orders, information } = await OrdersService.getOrders(filters);
                    this.orders      = orders;
                    this.information = information;
                } catch (e) {
                    this.orders    = [];
                } finally {
                    this.isLoading   = false;
                }
            }, 500)
        },

        filters: { price },

        components: {
            Loader,
            Divider,
            Pagination,
            TableHeader
        }
    };
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .orders-container {
        position: relative;
        flex-grow: 1;
        margin-top: 15px;
        @include respond-to(mobile) {
            margin-top: 0;
        }
    }

    .orders-no-data {
        text-align: center;
        font-size: 15px;
        color: #666;
        position: absolute;
        top: 10%;
        left: 50%;
        width: 100%;
        transform: translate(-50%, -50%);
    }

    .orders-table {
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.25);
        font-size: 13px;
        width: 100%;
        $parent: &;

        &__count, &__sales {
            padding: 10px 15px;
        }

        &__header {
            font-size: 12px;
            background: white;
            color: $color-bistro-medium-gray;

            span {
                margin: 0 5px;
                @include respond-to(mobile) {
                    margin: 0;
                }
            }
        }

        &__body {
            font-size: 11px;
        }

        &__column-names {
            overflow: hidden;
            color: $color-bistro-dark-gray;
            @include respond-to(mobile) {
                display: none;
            }
        }

        &__column {
            box-sizing: border-box;
            float: left;
            text-align: left;
            padding: 10px 0 10px 15px;
            background-color: white;
            width: 15%;
            @include text-ellipsis();
            @include respond-to(mobile) {
                padding: 0 0 0 15px;
                width: auto;
            }

            &.prices {
                padding: 10px 25px 10px 0;
                text-align: right;
                @include respond-to(mobile) {
                    padding: 0 0 0 15px;
                    text-align: left;
                }
            }

            &--last {
                border: none;
                width: 25%;
                @include respond-to(mobile) {
                    width: auto;
                }
            }
        }

        &__row {
            color: $color-bistro-dark-gray;
            overflow: hidden;
            display: block;
            text-decoration: none;

            @include respond-to(mobile) {
                padding: 5px 0;
            }

            &:nth-child(even){
                background-color: white;
                #{$parent}__column {
                    background-color: white;
                }
            }

            &:nth-child(odd){
                background-color: $color-bistro-lighter-gray;
                #{$parent}__column {
                    background-color: $color-bistro-lighter-gray;
                }
            }
        }
    }

    .bold {
        font-weight: bold;
    }

    .right {
        float: right;
    }

    .bistro {
        &-red {
            color: $color-bistro-red;
        }

        &-blue {
            color: $color-bistro-blue;
        }

        &-gray {
            color: $color-bistro-medium-gray;
        }

        &-green {
            color: $color-bistro-green;
        }
    }

    .desktop-only {
        @include respond-to(mobile) {
            display: none;
        }
    }

    .ellipsis {
        @include text-ellipsis();
    }

    .flex {
        display: flex;
    }

    .tablet-group {
        @include respond-to(mobile) {
            width: 100%;
            display: flex;
            background-color: inherit;
        }
    }

</style>
