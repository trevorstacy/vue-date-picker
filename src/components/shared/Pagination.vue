<template>
    <div v-if="pageCount > 1" class="pagination">
        <button v-if="currentPage !== 1"
                class="pagination__button pagination__button--prev"
                @click="prevPage">
            <i class="fas fa-chevron-left"></i>
        </button>

        <button class="pagination__button pagination__button--number"
                @click="setPage(1)"
                :disabled="currentPage === 1">
            1
        </button>

        <span v-if="showLeftGap" class="pagination__gap">...</span>

        <button v-for="number in pageCount"
                v-if="number !== 1 && number !== pageCount"
                class="pagination__button pagination__button--number"
                :class="{ 'pagination__button--hidden' : isHiddenPageNumber(number) }"
                @click="setPage(number)"
                :disabled="currentPage === number">
            {{ number }}
        </button>

        <span v-if="showRightGap" class="pagination__gap">...</span>

        <button class="pagination__button pagination__button--number"
                @click="setPage(pageCount)"
                :disabled="currentPage === pageCount">
            {{ pageCount }}
        </button>

        <button v-if="currentPage !== pageCount"
                class="pagination__button pagination__button--next"
                @click="nextPage">
            <i class="fas fa-chevron-right"></i>
        </button>
    </div>
</template>

<script>
    export default {

        props: {
            pageCount: {
                type: Number,
                required: true
            },
            currentPageNumber: {
                type: Number,
                required: false,
                default: 1
            }
        },

        data () {
            return {
                currentPage: this.currentPageNumber
            };
        },

        computed: {
            showLeftGap () {
                return this.currentPage > 3;
            },
            showRightGap () {
                return this.currentPage < (this.pageCount - 2);
            }
        },

        methods: {
            nextPage () {
                this.setPage(this.currentPage + 1);
            },
            prevPage () {
                this.setPage(this.currentPage - 1);
            },
            setPage (page) {
                this.currentPage = page;
                this.$emit('change', this.currentPage);
            },
            isHiddenPageNumber (pageNumber) {
                return pageNumber !== 1
                    && pageNumber !== this.pageCount
                    && (pageNumber > this.currentPage + 1 || pageNumber < this.currentPage - 1)
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .pagination {
        padding-top: 15px;
        text-align: center;
        background-color: white;

        &__gap {
            font-size: 15px;
            margin: 0 2px;
        }

        &__button {
            cursor: pointer;

            &--prev, &--next {
                border: none;
                background-color: transparent;
                &:disabled {
                    display: none;
                }
                &:hover {
                    text-shadow: $color-bistro-medium-gray 1px 0;
                }
            }

            &--number {
                width: 25px;
                height: 25px;
                text-align: center;
                border-radius: 15px;
                border: none;
                background-color: $color-bistro-lighter-gray;
                margin: 10px 4px;
                padding: 0;
                font: {
                    size: 10px;
                    weight: bold;
                }
                &:not(:disabled):hover {
                    background-color: $color-bistro-light-gray;
                }
                &:disabled {
                    color: white;
                    background-color: $color-bistro-red;
                }
            }

            &--hidden {
                display: none;
            }
        }
    }
</style>
