<template>
    <div class="restaurants-filter">
        <select-box :options="options"
                    @change="onSelectChange"
                    :width="200"
                    :multiple="true"
                    :resettable="false"
                    placeholder="Vyberte reštaurácie"
                    title="Filtrovať podľa hodnotenia">
        </select-box>
    </div>
</template>


<script>
    import SelectBox from "@/components/shared/SelectBox";
    import {
        TRIGGER_ACTIVE_RESTAURANT,
        DEACTIVATE_ALL_RESTAURANTS
    } from "@/store/lists/mutations";
    import {
        mapState,
        mapMutations
    } from "vuex";

    const RestaurantFilter = {

        computed: {
            ...mapState({
                restaurants: state => state.restaurants
            }),
            options () {
                return this.restaurants.map(restaurant => ({
                    name: restaurant.getName(),
                    value: restaurant.getId(),
                    selected: restaurant.isActive()
                }));
            }
        },

        methods: {
            ...mapMutations({
                deactivateAllRestaurants: DEACTIVATE_ALL_RESTAURANTS,
                changeActiveStateOfRestaurant: TRIGGER_ACTIVE_RESTAURANT
            }),
            onSelectChange (options) {
                this.restaurants.map(restaurant => {
                    if (!options || !options.length) {
                        this.deactivateAllRestaurants();
                        return;
                    }
                    const restaurantOption = options.find(opt => opt.value === restaurant.getId());
                    if (restaurantOption && restaurant.isActive() !== restaurantOption.selected) {
                        this.changeActiveStateOfRestaurant(restaurant);
                    }
                })
            }
        },

        components: { SelectBox }
    };

    export default RestaurantFilter;
</script>
<style lang="scss" scoped>
    .restaurants-filter {
        display: inline-block;
    }
</style>
