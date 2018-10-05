<template>
    <div class="payment-type">
        <select-box :options="options"
                    @change="onSelectChange"
                    :width="110"
                    placeholder="Forma platby"
                    title="Filtrovať podľa formy platby">
        </select-box>
    </div>
</template>


<script>
    import isNull                   from "lodash/isNull";
    import SelectBox                from "@/components/shared/SelectBox";
    import orderPaymentTypeOptions  from "@/data/options/OrdersPaymentType";
    import { mapState               } from "vuex";

    const PaymentTypeFilter = {

        data () {
            return {
                options: orderPaymentTypeOptions,
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
                const filter = this.customFilters.find(filter => filter.component === PaymentTypeFilter);
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

    export default PaymentTypeFilter;
</script>
<style lang="scss" scoped>
    .payment-type {
        display: inline-block;
    }
</style>
