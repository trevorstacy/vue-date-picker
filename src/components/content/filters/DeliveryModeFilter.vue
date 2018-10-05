<template>
    <div class="delivery-mode">
        <select-box :options="options"
                    class="delivery-mode__select"
                    @change="onSelectChange"
                    :width="150"
                    :resettable="false"
                    placeholder="Zoskupovanie"
                    title="Zoskupiť podľa"
                    label="Zoskupovanie:"
                    :closable="false">
        </select-box>
    </div>
</template>

<script>
    import isNull           from "lodash/isNull";
    import SelectBox        from "@/components/shared/SelectBox";
    import { mapState       } from "vuex";
    import { DELIVERY_MODES } from "@/model/Delivery";

    const DeliveryModeFilter = {

        data () {
            return {
                options: [
                    {
                        name: 'hodiny',
                        value: DELIVERY_MODES.MODE_HOUR,
                        selected: false
                    },
                    {
                        name: 'dni',
                        value: DELIVERY_MODES.MODE_DAY,
                        selected: true
                    },
                    {
                        name: 'týždne',
                        value: DELIVERY_MODES.MODE_WEEK,
                        selected: false
                    },
                    {
                        name: 'mesiace',
                        value: DELIVERY_MODES.MODE_MONTH,
                        selected: false
                    }
                ],
                selectedOption: null
            };
        },

        computed: {
            ...mapState({
                customFilters: state => state.customFilters
            })
        },

        methods: {
            onSelectChange (option) {
                this.selectedOption =  option;
            },
            dispatchSelectedOption () {
                const filter = this.customFilters.find(filter => filter.component === DeliveryModeFilter);
                if (!filter) {
                    return;
                }
                filter.callback(!isNull(this.selectedOption) ? this.selectedOption.value : {});
            }
        },

        watch: {
            selectedOption () {
                return this.dispatchSelectedOption();
            }
        },

        components: { SelectBox }
    };
    export default DeliveryModeFilter;
</script>

<style lang="scss" scoped>
    .delivery-mode {
        display: inline-block;

        &__select {
            display: inline-flex;
            align-items: center;
        }
    }
</style>
