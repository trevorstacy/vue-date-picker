<template>
    <div>
        <div class="month-filter">
            <div class="month-filter__label">Mesiac:</div>
            <ul class="month-filter__options options">
                <li class="options__item"
                    v-for="month in months"
                    :class="{ 'options__item--active': month.isActive() }"
                    :title="month.getTitle()"
                    @click="activate(month)">
                    {{ month.getShortName() }}
                </li>
            </ul>
        </div>
        <div class="month-filter--mobile">
            <select-box class="select-box"
                        label="Mesiac:"
                        :options="options"
                        placeholder="Mesiac"
                        :width="100"
                        :resettable="false"
                        @change="activateFromSelect">
            </select-box>
        </div>
    </div>
</template>

<script>
    import Month from "@/model/Month";
    import SelectBox from "@/components/shared/SelectBox";
    import {
        mapState,
        mapActions
    } from "vuex";
    import {
        CHANGE_ACTIVE_MONTH
    } from "@/store/lists/actions";

    export default {

        computed: {
            ...mapState({
                months: state => state.months
            }),
            options () {
                return this.months.map(month => ({
                    value: month.getNumeric(),
                    name: month.getName(),
                    selected: month.isActive()
                }));
            }
        },

        methods: {
            activateFromSelect (option) {
                this.activate(new Month(option.value));
            },
            ...mapActions({
                activate: CHANGE_ACTIVE_MONTH
            })
        },

        components: { SelectBox }
    };
</script>

<style lang="scss" scoped>
    @import '@/shared';

    .month-filter {
        display: flex;
        justify-content: space-between;
        @include respond-to(tablet) {
            display: none;
        }

        &__label {
            display: inline-flex;
            align-items: center;
            align-content: center;
            font-size: 13px;
            font-weight: 500;
            color: $color-bistro-dark-gray;
        }

        &--mobile {
            display: none;
            @include respond-to(tablet) {
                display: block;
            }
        }
    }

    .options {
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        text-transform: uppercase;
        padding: 0;
        font-size: 11px;
        margin: 0;

        &__item {
            display: inline-block;
            padding: 5px 0;
            text-align: center;
            width: 50px;
            margin: 3px 2px;
            border-radius: 17px;
            background-color: $color-bistro-light-gray;
            color: $color-bistro-dark-gray;
            cursor: pointer;

            &--active, &:hover {
                color: white;
                background-color: $color-bistro-red;
            }
        }
    }

    .select-box {
        @include respond-to(mobile) {
            width: 100%;

            .select-box__select {
                width: 100% !important;
                box-sizing: border-box;
                font-size: 16px;
                line-height: 1.3;
            }

            .select-label {
                display: none;
            }
        }
    }
</style>
