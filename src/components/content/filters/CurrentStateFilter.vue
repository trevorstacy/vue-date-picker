<template>
    <div class="order-state">
        <select-box :options="options"
                    @change="onSelectChange"
                    :width="150"
                    placeholder="Stav objednávky"
                    title="Filtrovať podľa stavu objednávky">
        </select-box>
    </div>
</template>

<script>
    import isNull               from "lodash/isNull";
    import SelectBox            from "@/components/shared/SelectBox";
    import orderStateOptions    from "@/data/options/OrdersCurrentState";
    import { mapState           } from "vuex";

    const CurrentStateFilter = {

        data() {
            return {
                options: orderStateOptions,
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
                this.selectedOption = option;
            },
            dispatchSelectedOption () {
                const filter = this.customFilters.find(filter => filter.component === CurrentStateFilter);
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
    export default CurrentStateFilter;
</script>

<style lang="scss" scoped>
    .order-state {
        display: inline-block;
    }
</style>
