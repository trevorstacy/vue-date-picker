<template>
    <div class="divider"
         :style="{ borderWidth: this.size + 'px', borderColor: this.color }"
         :class="['divider--' + direction]">
    </div>
</template>

<script>
    export default {

        props: {
            direction: {
                type: String,
                required: false,
                default: "horizontal"
            },
            color: {
                type: String,
                required: false,
                default: "#333"
            },
            size: {
                type: Number,
                required: false,
                default: 1
            }
        }
    }
</script>

<style lang="scss" scoped>
    .divider {
        &--vertical {
            height: 100%;
            width: 100%;
            border: {
                left-style: solid;
                top: none;
                right: none;
                bottom: none;
            }
        }
        &--horizontal {
            width: 100%;
            border: {
                left: none;
                top: none;
                right: none;
                bottom-style: solid;
            }
        }
    }
</style>
