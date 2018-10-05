<template>
    <div class="table-loader">
        <i class="fas fa-spinner fa-3x fa-spin"></i>
    </div>
</template>

<style lang="scss" scoped>
    @import "~@/shared";

    .table-loader {
        position: absolute;
        top: 50%;
        left: 50%;
        color: $color-bistro-medium-gray;
        height: 48px;
        width: 48px;
        margin: -24px 0 0 -24px;
    }
</style>
