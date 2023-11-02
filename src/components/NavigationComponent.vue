<template>
  <nav id="nav-main" class="wrapper-navigation">
    <ol>
      <li v-for="route in routes" :key="route.path">
        <router-link :to="route.path">{{ route.name }}</router-link>
      </li>
    </ol>
  </nav>
</template>
  
<script>
import { useAuthStore } from '../stores/auth'

export default {
  data() {
    return {
      routes: [
        { path: '/', name: 'SONGS' },
        { path: '/albums', name: 'ALBUMS' },
        { path: '/about', name: 'ABOUT' },
      ],
      useAuthStore
    };
  },
};
</script>