<template>
    <div id="main-header" class="active">
        <div class="wrapper-logo">
            <img src="@/assets/logo.svg"/>
            <h2>KRAKEN.FM</h2>
        </div>
        <div class="wrapper-profile">
            <div class="section-user">
                <span class="avatar"></span>
                <h3 id="txt-full-name">{{ full_name }}</h3>
            </div>
            <button id="btn-logout" @click="logoutButton">LOGOUT</button>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';

export default {
    data() {
        return {
            useAuthStore
        }
    },
    computed: {
        full_name() {
            return `${useAuthStore.user.name} ${useAuthStore.user.surname}`;
        },
        logoutButton(){
            useAuthStore.logout()
        }
    }
    }
</script>
