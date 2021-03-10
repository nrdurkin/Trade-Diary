<template>
    <div class="trade-table">
        <div class="header">
            <transaction></transaction>
        </div>
        <div class="transactions">
            <transaction
                v-for="t in test_data"
                v-bind:obj="t"
                :key="test_data.indexOf(t)"
            ></transaction>
        </div>
        <div class="transaction-summary">
            Vertical Spread 4/23 - 5/1 280-290C Cost $720 Sold $1864 Net $1144
        </div>
    </div>
</template>

<script>
import json from "./test-data.json";

export default {
    data() {
        return {
            test_data: json
        };
    }
};
</script>

<style lang="less" scoped>
.trade-table,
.transactions {
    max-width: 900px;
    width: 900px;
    font-size: 20px;
}
.transactions {
    padding: 5px;
}
.header {
    padding: 3px;
    border-bottom: 1px solid lightgrey;
}
</style>
