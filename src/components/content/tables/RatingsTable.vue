<template>
    <div class="ratings-container">
        <loader v-if="isLoading"></loader>
        <p v-else-if="!ratings.length" class="ratings-no-data">
            Ľutujeme, za vybrané obdobie sa nepodarilo nájsť žiadne hodnotenia.
        </p>
        <div v-else class="ratings-table">
            <compensation-modal v-if="selectedRating"
                               :rating="selectedRating"
                               @close="closeCompensateModal">
            </compensation-modal>

            <table-header type="Hodnotenia"></table-header>

            <div class="ratings-table__body">
                <div class="ratings-table__column-names bold">
                    <div class="ratings-table__column width-10">Dátum</div>
                    <div class="ratings-table__column width-50">Hodnotenie</div>
                    <div class="ratings-table__column width-20">Meno a telefón</div>
                    <div class="ratings-table__column width-20">Možnosti</div>
                </div>
                <div class="ratings-table__data">
                    <div class="ratings-table__row" v-for="rating in ratings">
                        <div class="tablet-group-1">
                            <div class="ratings-table__column width-10">
                                {{ rating.getDateAdd('DD.MM.YYYY') }}
                            </div>
                        </div>
                        <div class="tablet-group-2">
                            <div class="ratings-table__column width-50">
                                <div class="ratings-table__stars">
                                    <StarIcons :grade="rating.getGrade()"
                                                :color="rating.getGrade() >= 3 ? 'green' : 'red'" />
                                </div>
                                {{ rating.getContent() }}
                            </div>
                            <div class="ratings-table__column width-20">
                                {{ rating.getCustomerName() }}
                                <br />
                                {{ rating.getPhone() }}
                            </div>
                            <div class="ratings-table__column width-20">
                                <button v-if="rating.isCompensated() === false"
                                        class="ratings-table__button"
                                        @click="compensate(rating)">
                                    Ospravedlniť
                                </button>
                                <button v-else
                                        class="ratings-table__button ratings-table__button--apologized">
                                    Ospravedlnené
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <pagination :page-count="pageCount"
                        :current-page-number="page"
                        @change="onPageChange">
            </pagination>
        </div>
    </div>
</template>

<script>
    import debounce             from "lodash/debounce";
    import Loader               from "@/components/shared/Loader";
    import StarIcons            from "@/components/shared/StarIcons";
    import Pagination           from "@/components/shared/Pagination";
    import TableHeader          from "@/components/shared/TableHeader";
    import CompensationModal    from "@/components/shared/CompensationModal";
    import RatingsService       from "@/services/RatingsService";
    import { mapState           } from "vuex";
    import { SET_QUERY_PARAMETERS } from "@/store/lists/mutations";

    export default {

        data () {
            return {
                ratings: RatingsService.getRatingsFromTemplate(),
                pageCount: RatingsService.getPageCountFromTemplate(),
                page: 1,
                ratingType: 0,
                isLoading: false,
                selectedRating: null
            }
        },

        created () {
            RatingsService.addCustomFiltersToStore(this);
            this.$store.subscribe(mutation => {
                if (mutation.type === SET_QUERY_PARAMETERS) {
                    this.page = 1;
                    this.getRatings();
                }
            });
        },

        computed: {
            ...mapState({
                queryParameters: state => state.queryParameters
            })
        },

        methods: {
            getRatings () {
                if (!this.queryParameters.restaurants.length) {
                    return;
                }
                this.isLoading = true;
                this.debounceGetRatings();
            },
            compensate (rating) {
                this.selectedRating = rating;
            },
            closeCompensateModal () {
                this.selectedRating = null;
            },
            onPageChange (page) {
                this.page = +page;
                this.getRatings();
            },
            debounceGetRatings: debounce(async function () {
                const filters = {
                    ...this.queryParameters,
                    page: this.page
                };
                if (this.ratingType && this.ratingType > 0) {
                    filters.ratingType = this.ratingType;
                }
                try {
                    const { ratings, pageCount } = await RatingsService.getRatings(filters);
                    this.ratings   = ratings;
                    this.pageCount = pageCount;
                } catch (e) {
                    this.ratings    = [];
                } finally {
                    this.isLoading = false;
                }
            }, 500)
        },

        components: {
            Loader,
            StarIcons,
            Pagination,
            TableHeader,
            CompensationModal
        }
    };
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .ratings-container {
        position: relative;
        flex-grow: 1;
        margin-top: 15px;

        @include respond-to(mobile) {
            margin-top: 0;
        }
    }

    .ratings-no-data {
        text-align: center;
        font-size: 15px;
        color: #666;
        position: absolute;
        top: 10%;
        left: 50%;
        width: 100%;
        transform: translate(-50%, -50%);
    }

    .ratings-table {
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.25);
        font-size: 13px;
        width: 100%;
        $parent: &;

        &__stars {
            margin-top: -5px;
        }

        .tablet-group-1 {
            @include respond-to(tablet) {
                background-color: inherit;
                float: left;
                width: 20%;
                margin-top: 5px;
            }
        }

        .tablet-group-2 {
            @include respond-to(tablet) {
                background-color: inherit;
                float: right;
                width: 75%;

                #{$parent}__column {
                    padding-bottom: 10px;
                    padding-top: 5px;
                    width: 33%;
                    @include respond-to(mobile) {
                        width: 100%;
                    }
                }
            }
        }

        .row-separator {
            border-bottom: 1px solid $color-bistro-lighter-gray;
            width: 100%;
        }

        .row-separator-thick {
            border-bottom: 35px solid $color-bistro-lighter-gray;
            width: 100%;
        }

        &__column {
            box-sizing: border-box;
            float: left;
            text-align: left;
            padding: 10px 0 10px 15px;
            background-color: white;
            line-height: 17px;

            @include respond-to(tablet) {
                padding: 0 0 0 15px;
            }

            @include respond-to(mobile) {
                padding: 0 0 0 5px;
            }

            @include respond-to(desktop) {
                &.width-10 {
                    width: 10%;
                }
                &.width-20 {
                    width: 20%;
                }
                &.width-50 {
                    width: 50%;
                }

            }
        }

        &__column-names {
            overflow: hidden;
            color: $color-bistro-dark-gray;
            @include respond-to(tablet) {
                display: none;
            }
        }

        &__data {
            font-size: 11px;
        }

        &__row {
            color: $color-bistro-dark-gray;
            overflow: hidden;
            @include respond-to(tablet) {
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

        &__button {
            background-color: transparent;
            border-radius: 16px;
            border: 1px solid $color-bistro-medium-gray;
            cursor: pointer;
            color: $color-bistro-medium-gray;
            padding: 7px 15px;
            text-decoration: none;
            width: 120px;
            text-align: center;
            margin-right: 15px;
            outline: none;
            float: right;
            $buttonParent: &;

            &--apologized {
                border: 2px solid $color-bistro-red;
                color: $color-bistro-red;

                &:hover {
                    cursor: not-allowed;
                }
            }

            &:not(#{$buttonParent}--apologized):hover {
                border-color: $color-bistro-red;
                color: $color-bistro-red;
            }
        }
    }

    .ellipsis {
        @include text-ellipsis();
    }

    .flex {
        display: flex;
    }

    .bold {
        font-weight: bold;
    }

    .right {
        float: right;
    }

    .bistro-red {
        color: $color-bistro-red;
    }

    .bistro-green {
        color: $color-bistro-green;
    }

    .desktop {
        @include respond-to(tablet) {
            display: none;
        }
    }

    .modal {
        position: fixed; /* Stay in place */
        z-index: 43; /* Sit on top */
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        overflow: auto; /* Enable scroll if needed */
        background-color: rgb(0,0,0); /* Fallback color */
        background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }
</style>
