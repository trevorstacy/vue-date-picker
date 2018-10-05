<template>
    <div class="grade-type">
        <select-box :options="options"
                    @change="onSelectChange"
                    :width="100"
                    placeholder="Hodnotenie"
                    title="Filtrovať podľa hodnotenia">
        </select-box>
    </div>
</template>


<script>
    import isNull               from "lodash/isNull";
    import SelectBox            from "@/components/shared/SelectBox";
    import ratingGradeOptions   from "@/data/options/RatingGrade";
    import { mapState           } from "vuex";

    const GradeTypeFilter = {

        data () {
            return {
                options: ratingGradeOptions,
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
                const filter = this.customFilters.find(filter => filter.component === GradeTypeFilter);
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

    export default GradeTypeFilter;
</script>
<style lang="scss" scoped>
    .grade-type {
        display: inline-block;
    }
</style>
