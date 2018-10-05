<template>
    <div ref="container">
        <span class="select-label" v-if="label">{{ label }}</span>

        <div class="select-box" @click="optionsVisible = !optionsVisible">

            <div class="select-box__select select"
                 :style="{ 'width': (width ? width + 'px' : 'auto') }"
                 :class="{
                    'select--no-border-bottom': optionsVisible,
                    'select--selected': selectedOptions.length
                 }">

                {{ selectedValue }}

                <i v-if="(!selectedOptions.length || !resettable) && !isMobile"
                   class="select__icon fas fa-angle-down"
                   :class="{ 'rotated': optionsVisible }">
                </i>

                <i v-else-if="selectedOptions.length && resettable"
                   class="select__icon fas fa-times"
                   @click.prevent.stop="reset">
                </i>
            </div>

            <div v-if="optionsVisible && isMobile" class="select-box__background"></div>
            <transition name="roll-down">
                <ul class="select-box__options options" v-if="optionsVisible">
                    <li v-if="isMobile && selectedOptions.length && resettable && !multiple"
                        @click.stop="reset()"
                        class="options__option">
                        <i class="options__icon far fa-circle"></i>

                        Resetovať
                    </li>

                    <li class="options__option"
                        v-for="option in localOptions"
                        :class="{ 'options__option--selected': option.selected }"
                        @click.stop="select(option)">

                        <i v-if="multiple && option.selected" class="options__icon fas fa-check-circle"></i>
                        <i v-else-if="option.selected" class="options__icon far fa-dot-circle"></i>
                        <i v-else class="options__icon far fa-circle"></i>

                        {{ option.name }}
                    </li>

                    <li v-if="multiple && isMobile"
                        class="options__option options__option--close"
                        @click.stop="optionsVisible = !optionsVisible">
                        Zatvoriť
                    </li>

                    <li v-else-if="isMobile"
                        class="options__option options__option--close"
                        @click.stop="optionsVisible = !optionsVisible">
                        Zrušiť
                    </li>
                </ul>
            </transition>
        </div>
    </div>
</template>

<script>
    import ScreenService from "@/services/ScreenService";

    export default {
        props: {
            options: {
                type: Array,
                required: true
            },
            label: {
                type: String,
                required: false,
                default: ""
            },
            title: {
                type: String,
                required: false,
                default: ""
            },
            placeholder: {
                type: String,
                required: false,
                default: "Vyberte možnosť"
            },
            width: {
                type: Number,
                required: false,
                default: 0
            },
            resettable: {
                type: Boolean,
                required: false,
                default: true
            },
            multiple: {
                type: Boolean,
                required: false,
                default: false
            }
        },

        data () {
            return {
                isMobile: !ScreenService.isBiggerThan(550),
                optionsVisible: false,
                localOptions: this.options
            };
        },

        created () {
            ScreenService.isBiggerThan(550, status => this.isMobile = !status);
        },

        computed: {
            selectedOptions () {
                return this.localOptions.filter(option => option.selected === true);
            },
            selectedValue () {
                if (this.selectedOptions.length) {
                    return this.selectedOptions.map(option => option.name).join(", ");
                }
                return this.placeholder ? this.placeholder : "";
            }
        },

        methods: {
            globalClosingListener (addOrRemove) {
                switch (addOrRemove) {
                    case 'add':
                        return document.addEventListener('click', this.closeFiltersCallback);
                    case 'remove':
                        return document.removeEventListener('click', this.closeFiltersCallback);
                }
            },
            closeFiltersCallback (event) {
                const isChildNode = this.$refs.container.contains(event.target);
                if (!isChildNode) {
                    this.optionsVisible = false;
                    this.globalClosingListener('remove');
                }
            },
            select (option, emit = true) {
                if (!this.multiple) {
                    this.localOptions.map(opt => opt.selected = false);
                }
                this.optionsVisible = this.multiple;
                option.selected = this.multiple ? !option.selected: true;
                this.globalClosingListener('remove');
                if (emit) {
                    let dataToEmit = null;
                    if (this.multiple) {
                        dataToEmit = this.localOptions;
                    } else if (this.selectedOptions.length) {
                        dataToEmit = this.selectedOptions[0];
                    }
                    this.$emit('change', dataToEmit);
                }
            },
            reset () {
                this.localOptions.map(option => option.selected = false);
                this.optionsVisible = false;
                this.globalClosingListener('remove');
                this.$emit('change', null);
            }
        },

        watch: {
            options (value) {
                this.localOptions = value;
            },
            optionsVisible (value) {
                if (value === true) {
                    this.globalClosingListener('add');
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .select-label {
        font: {
            size: 14px;
            weight: 500;
        }
        color: $color-bistro-dark-gray;
        display: inline-block;
        margin-right: .75em;

        @include respond-to(mobile) {
            display: none;
        }
    }

    .select-box {
        position: relative;
        display: inline-flex;

        @include respond-to(mobile) {
            width: 100%;
        }

        &__select {
            @include text-ellipsis();
            display: flex;
            align-items: center;
            align-content: center;
            position: relative;
        }

        &__background {
            display: none;

            @include respond-to(mobile) {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0,0,0,0.6);
                z-index: 9;
                display: block;
            }
        }

        &__options {
            position: absolute;
            left: 0;
            right: 0;
            padding: 0;
            margin: 0;
            top: 100%;
            z-index: 10;

            @include respond-to(mobile) {
                position: fixed;
                width: 90vw;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                max-height: 90vh;
                overflow-y: auto;
            }
        }
    }

    .options {
        display: flex;
        flex-direction: column;
        background-color: white;
        border-radius: 0 0 .8em .8em;
        box-shadow: 0 5px 15px -4px $color-bistro-medium-gray;
        transform-origin: top;
        $options: &;

        @include respond-to(mobile) {
            border-radius: 0;
            box-shadow: none;
        }

        &__icon {
            margin-right: .9em;
            color: $color-bistro-dark-gray;
        }

        &__option {
            display: block;
            padding: .7em 2em .7em 1em;
            color: $color-bistro-dark-gray;
            font: {
                size: 12px;
                weight: 300;
            }

            &--selected  #{$options}__icon {
                color: $color-bistro-red;
            }

            &--close {
                color: white;
                background-color: $color-bistro-red;
                text-transform: uppercase;
                text-align: center !important;
                font-weight: 600;

                &:hover {
                    background-color: $color-bistro-red !important;
                    color: white !important;
                }
            }

            @include respond-to(mobile) {
                margin: 0 auto;
                width: 100%;
                box-sizing: border-box;
                text-align: left;
                font-size: 16px;
                padding: 1.4em 1.2em;
                border-bottom: 1px solid $color-bistro-lighter-gray;
            }

            &:last-of-type {
                @include respond-to(mobile) {
                    border-bottom: none;
                }
            }

            &:hover {
                background-color: $color-bistro-lighter-gray;
                cursor: pointer;

                @include respond-to(mobile) {
                    cursor: auto;
                    background-color: white;
                }
            }

            &:last-of-type {
                border-radius: 0 0 .8em .8em;

                @include respond-to(mobile) {
                    border-radius: 0;
                }
            }
        }
    }

    .select {
        border-radius: 1.2em 1.2em 1.2em 1.2em; // duplicated sizes because of transition
        transition: .15s border-radius ease-in-out;
        box-shadow: 0 0 14px -4px $color-bistro-medium-gray;
        font: {
            size: 13px;
            weight: 300;
            style: italic;
        }
        line-height: 15px;
        background-color: white;
        padding: .6em 2em .6em 1em;
        color: $color-bistro-medium-gray;
        cursor: pointer;
        display: inline-block;
        @include text-ellipsis();

        @include respond-to(mobile) {
            width: 100% !important;
            box-sizing: border-box;
            font-size: 14px;
            line-height: 1.3;
            transition: none;
        }

        &__icon {
            position: absolute;
            right: 10px;
            transform: rotate(0);
            transition: .25s transform ease-out;
            color: $color-box-icon;

            &.rotated {
                transform: rotate(180deg);
            }
        }

        &--selected {
            font: {
                size: 14px;
                weight: 500;
                style: normal;
            }
        }

        &--no-border-bottom {
            border-radius: 1em 1em 0 0;
        }
    }

    .roll-down {
        &-enter-active {
            animation: roll-down .4s ease-out;
            @include respond-to(mobile) {
                animation: none;
            }
        }
        &-leave-active {
            animation: roll-down .25s ease-in reverse;
            @include respond-to(mobile) {
                animation: none;
            }
        }
    }

    @keyframes roll-down {
        0% {
            transform: scaleY(0);
        }
        40% {
            transform: scaleY(0);
        }
        100% {
            transform: scaleY(1);
        }
    }
</style>
