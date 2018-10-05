<template>
    <div class="star-icons">
        <span v-for="grade in createGradeArray(this.grade)"
              class="star-icons__star-icon star-icon"
              :class="['star-icon--' + color]">

            <i v-if="grade >= 0.7" class="start-icon__icon fas fa-star"></i>
            <i v-else-if="grade > 0.1" class="start-icon__icon fas fa-star-half-alt"></i>
            <i v-else class="start-icon__icon far fa-star"></i>
        </span>
        <span class="star-icons__grade grade" :class="['grade--' + color]">
            {{ grade | number(1, '.', true) }}
        </span>
    </div>
</template>

<script>
    import { number } from "@/filters/number";

    export default {

        props: {
            grade: {
                type: Number,
                required: true
            },
            color: {
                type: String,
                required: true
            }
        },

        methods: {
            createGradeArray (grade) {
                return [0,0,0,0,0].map((v,i) => {
                    let out = Math.round((grade - 4 + i) * 10) / 10;
                    out = out >= 0 ? out : 0;
                    grade -= out;
                    return out;
                }).reverse();
            }
        },

        filters: { number }
    }
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .star-icons {
        &__star-icon {
            position: relative;
            color: $color-bistro-light-gray;
            line-height: 23px;
            margin-left: 0;
            font-size: 12px;
        }

        &__grade {
            font-weight: bold;
            margin-left: 5px;
        }
    }

    .star-icon {
        &:first-child {
            margin-left: 0;
        }

        &--red {
            color: $color-bistro-red;
        }

        &--green {
            color: $color-bistro-green;
        }

        &__icon.far.fa-star {
            color: $color-bistro-light-gray;
        }
    }

    .grade {
        &--red {
            color: $color-bistro-red;
        }

        &--green {
            color: $color-bistro-green;
        }
    }
</style>
