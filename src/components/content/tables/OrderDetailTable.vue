<template>
    <div class="order-detail">

        <div class="order-detail__header">
            <h2 class="header__heading">Detail objednávky</h2>
            <a :href="getUrl('orders')" class="header__back-button">
                <i class="fas fa-angle-double-left"></i>
                <span class="header__button-text">Späť na moje objednávky</span>
            </a>
        </div>

        <div class="order-detail__general-info general-info">
            <div class="general-info__order-info">
                <div class="info-item">
                    Číslo: <strong>{{ order.getId() }}</strong>
                </div>
                <div class="info-item">
                    Dátum: <strong>{{ order.getDateAdd().format('DD.MM.YYYY | HH:mm') }}</strong>
                </div>
                <div class="info-item">
                    Reštaurácia: <strong>{{ order.getRestaurant().getName() }}</strong>
                </div>
                <div class="info-item">
                    Čas doručenia: <strong>{{ order.getDeliveryTime() }}</strong>
                </div>
            </div>
            <div class="general-info__address-info">
                <div class="address-title">Adresa:</div>
                <div class="address-items">
                    <div class="info-item bold">
                        {{ order.getCustomer().getFullName() }}
                    </div>
                    <span class="address-items__divider bold">|</span>
                    <div v-if="!order.isTakeaway()" class="info-item bold">
                        {{ order.getAddress().getStreet() }} {{ order.getAddress().getNumber() }}
                    </div>
                    <div v-else class="info-item bold">Osobný odber</div>
                    <span v-if="!order.isTakeaway()" class="address-items__divider bold">|</span>
                    <div v-if="!order.isTakeaway()" class="info-item bold">
                        {{ order.getAddress().getCity() }}
                    </div>
                </div>
            </div>
            <div v-if="order.getAddress().getNote()" class="general-info__address-info">
                <div class="address-title">Poznámka k adrese:</div>
                <div class="address-items">
                    <div class="info-item">
                        {{ order.getAddress().getNote() }}
                    </div>
                </div>
            </div>
        </div>

        <div class="order-detail__order-info order-info">
            <div class="order-info__row heading">
                <div class="product-count bold">Ks</div>
                <div class="product-name bold">Položka</div>
                <div class="product-price bold">Cena</div>
            </div>
            <div v-for="product in order.getProducts()"
                 class="order-info__row product"
                 :class="{ 'product--has-attributes': product.getAttributes() }">
                <div class="product-count">{{ product.getQuantity() }}x</div>
                <div class="product-name">
                    <strong>{{ product.getName() }}</strong><br>
                    {{ product.getAttributes() }}
                </div>
                <div class="product-price bold">{{ product.getPrice() | price }}</div>
            </div>
            <div class="order-info__row price shipping-price">
                <div class="price-name">Cena doručenia</div>
                <div class="price-value">{{ order.getPrice().getShippingPrice() | price }}</div>
            </div>
            <div class="order-info__row price credits">
                <div class="price-name">Kredity</div>
                <div class="price-value">{{ order.getPrice().getCreditsPrice() | price }}</div>
            </div>
            <div class="order-info__row price discount" v-for="discount in order.getDiscounts()">
                <div class="price-name">{{ discount.getName() }}</div>
                <div class="price-value">{{ discount.getValue() | price }}</div>
            </div>
            <div class="order-info__row price total-price">
                <div class="price-name">Celkom</div>
                <div class="price-value">{{ order.getPrice().getTotalPrice() | price }}</div>
            </div>
        </div>

    </div>
</template>

<script>
    import Order            from "@/model/Order";
    import TemplateParser   from "@/services/TemplateParsingService";
    import {
        price
    } from "@/filters/price";
    import {
        mapState
    } from "vuex";

    export default {

        data () {
            return {
                order: null
            }
        },

        created () {
            let orderData = TemplateParser.parse('order');
            this.order = orderData ? new Order(orderData) : null;
        },

        computed: {
            ...mapState({
                queryParameters: state => state.queryParameters
            })
        },

        methods: {
            getUrl (routeName) {
                return BackendRoutes.get(routeName, this.queryParameters);
            }
        },

        filters: { price }
    };
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    $padding-desktop: 30px;
    $padding-tablet: 12px;

    .order-detail {
        font-size: 13px;
        line-height: 32px;
    }

    .bold {
        font-weight: bold;
    }

    .header {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        @include respond-to(mobile) {
            padding: 0 10px 5px 20px;
        }

        &__heading {
            display: inline-block;
            color: $color-bistro-darker-gray;
            font-size: 22px;
            @include respond-to(mobile) {
                font-size: 18px;
                margin: 0;
            }
        }

        &__back-button {
            display: inline-block;
            float: right;
            background-color: $color-bistro-red;
            color: #fff;
            text-decoration: none;
            width: 195px;
            height: 25px;
            line-height: 25px;
            text-align: center;
            margin-top: 23px;
            font-size: 12px;
            border-radius: 12px;
            @include respond-to(mobile) {
                width: 28px;
                height: 28px;
                line-height: 28px;
                border-radius: 50%;
                margin-top: 0;
            }
        }

        &__button-text {
            @include respond-to(mobile) {
                display: none;
            }
        }
    }

    .general-info {
        color: $color-bistro-darker-gray;
        background-color: #fff;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
        @include respond-to(mobile) {
            line-height: 22px;
            padding: 7px 0 7px 4px;
        }

        &__order-info {
            display:flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            align-content: flex-start;
            align-items: center;
            border-bottom: 1px solid $color-bistro-light-gray;
            padding-left: $padding-desktop;
            padding-right: $padding-desktop;
            @include respond-to(tablet) {
                padding-left: $padding-tablet;
                padding-right: $padding-tablet;
            }
            @include respond-to(mobile) {
                align-items: start;
                flex-direction: column;
                border: none;
            }

            .info-item {
                padding: 0 8px;
                @include respond-to(mobile) {
                    padding-left: 0;
                }

                &:first-child {
                    padding-left: 0;
                }

                &:last-child {
                    padding-right: 0;
                    @include respond-to(tablet) {
                        padding-left: 0;
                    }
                }
            }
        }

        &__address-info {
            display: flex;

            .address-title {
                padding-left: $padding-desktop;
                @include respond-to(tablet) {
                    padding-left: $padding-tablet;
                }
            }

            .address-items {
                display: flex;
                @include respond-to(mobile) {
                    flex-direction: column;
                }

                &__divider {
                    @include respond-to(mobile) {
                        display: none;
                    }
                }

                .info-item {
                    padding: 0 8px;
                    @include respond-to(mobile) {
                        padding: 0 0 0 10px;
                    }
                }
            }
        }
    }

    .order-info {
        margin-top: 25px;
        background-color: #fff;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
        @include respond-to(mobile) {
            margin-top: 0;
        }

        &__row {
            display: flex;
            flex-wrap: nowrap;
            padding-left: $padding-desktop;
            padding-right: $padding-desktop;
            @include respond-to(tablet) {
                padding-left: $padding-tablet;
                padding-right: $padding-tablet;
            }
            &.heading {
                color: $color-bistro-medium-gray;
                @include respond-to(mobile) {
                    display: none;
                }
                .product-price {
                    padding-right: 5px;
                }
            }
            &.product {
                color: $color-bistro-darker-gray;
                background-color: $color-bistro-lighter-gray;
                border-bottom: 1px solid #fff;
                &--has-attributes {
                    line-height: 20px;
                    padding-top: 5px;
                    padding-bottom: 5px;
                }
            }
            &.price {
                justify-content: space-between;
                border-bottom: 1px solid $color-bistro-lighter-gray;
                color: $color-bistro-darker-gray;
                &:last-child {
                    border-bottom: none;
                }
                &.total-price {
                    background-color: $color-bistro-red;
                    color: #fff;
                }
            }
            .product-count {
                flex-grow: 1;
                flex-shrink: 0;
                flex-basis: 40px;
            }
            .product-name {
                flex-grow: 2;
                flex-basis: 170px;
                @include text-ellipsis();
            }
            .product-price {
                flex-grow: 1;
                flex-shrink: 0;
                flex-basis: 40px;
                text-align: right;
            }
        }
    }
</style>
