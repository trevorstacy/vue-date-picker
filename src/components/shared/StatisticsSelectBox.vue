<template>
    <div class="statistics-selectbox-wrapper">
        <div class="statistics-selectbox">
            <div class="select-div">
                <select v-model="selectedValue" title="Typ štatistiky">
                    <option v-for="option in options"
                            :value="option.text">
                        {{ !isMobile ? option.text : (option.text + ' (' + option.info + ')') }}
                    </option>
                </select>
            </div>
            <div v-if="selected && !isMobile" class="statistics-info">
                {{ selected.info }}
            </div>
        </div>
    </div>
</template>

<script>
    import ScreenService from "@/services/ScreenService";

    export default {
        data () {
            return {
                isMobile: !ScreenService.isBiggerThan(550),
                options: [
                    {
                        text: 'Bestseller',
                        info: 'top 10 najpredávanejších produktov'
                    }
                ],
                selectedValue: undefined
            }
        },
        created () {
            ScreenService.isBiggerThan(550, status => this.isMobile = !status);
            this.selectedValue = this.options[0].text;
        },
        computed: {
            selected () {
                return !this.selectedValue ? undefined : this.options.find(opt => opt.text === this.selectedValue);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/shared";

    .statistics-selectbox-wrapper {
        width: calc(100% + 70px);
        margin-left: -35px;
        margin-top: -20px;

        @include respond-to(mobile) {
            width: 100%;
            background: none;
            margin: 0;
        }

        .statistics-selectbox {
            padding: 20px 20px 20px 35px;
            border-bottom: 10px solid white;
            margin-bottom: 16px;
            background: linear-gradient(to right, $color-bistro-lighter-gray, $color-bistro-lighter-gray, white);
            display: flex;

            @include respond-to(mobile) {
                width: 100%;
                margin: 0;
                background: none;
                padding: 0;
                border-bottom: none;
            }

        }

        .select-div {
            position: relative;

            @include respond-to(mobile) {
                width: 100%;
            }

            select {
                color: $color-bistro-red;
                font-weight: bold;
                font-size: 14px;
                background: none;
                border: none;
                width: 100%;
                cursor: pointer;
                padding-right: 15px;
                word-break: normal;
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                outline: none;

                @include respond-to(mobile) {
                    font-size: 16px;
                    background: white;
                    border-radius: 25px;
                    padding: 14px 28px 14px 10px;
                    color: $color-bistro-dark-gray;
                    font-weight: normal;
                    appearance: listbox;
                    -webkit-appearance: listbox;
                    -moz-appearance: listbox;
                    box-shadow: 0 0 6px 0 rgba(0,0,0,0.15);
                    margin-bottom: 20px;
                }
            }

            &:after {
                font-family: "Font Awesome 5 Free", sans-serif;
                content: "\f107";
                font-weight: 900;
                color: $color-bistro-red;
                position: absolute;
                pointer-events: none;
                cursor: pointer;
                top: 2px;
                right: 0;

                @include respond-to(mobile) {
                    right: 10px;
                    top: 16px;
                    color: $color-bistro-disabled;
                }
            }
        }

        .statistics-info {
            text-transform: uppercase;
            font-weight: bold;
            font-size: 12px;
            margin-left: 50px;
            margin-top: 3px;

            @include respond-to(mobile) {
                display: none;
            }
        }
    }

    .filters-container {
        padding-top:15px;
    }

    /* IE11 hide native button (thanks Matt!) */
    select::-ms-expand {
        display: none;
    }

</style>
