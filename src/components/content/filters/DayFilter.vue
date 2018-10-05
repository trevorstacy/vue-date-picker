<template>
    <div>
        <div class="day-filter">
            <div class="day-filter__label">Dni v týždni:</div>
            <ul class="day-filter__options options">
                <li class="options__item"
                    v-for="day in days"
                    :class="{ 'options__item--active': day.isActive() }"
                    :title="day.getName()"
                    @click="activate(day)">
                    {{ day.getShortName() }}
                </li>
            </ul>
        </div>
        <div class="day-filter--mobile">
            <select-box class="select-box"
                        label="Deň:"
                        :options="options"
                        placeholder="Deň"
                        :width="100"
                        @change="activateFromSelect"
                        :resettable="false">
            </select-box>
        </div>
    </div>
</template>

<script>
    import Day              from "@/model/Day";
    import SelectBox        from "@/components/shared/SelectBox";
    import DailyMenuService from "@/services/DailyMenuService";

    export default {

        data () {
            return {
                days: []
            }
        },

        created () {
            this.days = DailyMenuService.generateDayObjects();
        },

        computed: {
            options () {
                return this.days.map(day => ({
                    value: day.getNumeric(),
                    name: day.getName(),
                    selected: day.isActive()
                }));
            }
        },

        methods: {
            activateFromSelect (option) {
                this.activate(new Day(option.value));
            },
            activate (day) {
                this.days.forEach(item => item.setActive(item.getNumeric() === day.getNumeric()));
                this.$emit('changeDay', day);
            }
        },

        components: { SelectBox }
    };
</script>

<style lang="scss" scoped>
    @import '@/shared';

    .day-filter {
        display: flex;
        justify-content: flex-start;

        @include respond-to(tablet) {
            display: none;
        }

        &__label {
            display: inline-flex;
            align-items: center;
            align-content: center;
            font-size: 13px;
            font-weight: 500;
            margin-right: 15px;
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
            margin: 3px;
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
