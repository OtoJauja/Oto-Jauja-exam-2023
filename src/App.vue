<template>
    <Header v-if="useAuthStore.authenticated"></Header>
    <div id="section-body">
        <Navigation  v-if="useAuthStore.authenticated"></Navigation>
        <router-view class="section-router"></router-view>
    </div>
    <div id="section-player" v-if="useAuthStore.authenticated">
        <AudioPlayer />
    </div>
</template>

<script>
    import { useAuthStore } from './stores/auth';

    export default {
    data() {
        return {
            useAuthStore
        };
    }
}
</script>

