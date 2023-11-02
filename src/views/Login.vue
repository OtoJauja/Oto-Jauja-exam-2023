<template>
    <div id="login-view">
        <form class="login-form">
            <div class="wrapper-logo">
                <img src="@/assets/logo.svg" />
                <div>KRAKEN.FM</div>
            </div>
            <input id="input-email" placeholder="E-mail" v-model="email" />
            <input id="input-password" type="password" placeholder="Password" v-model="password" />
            <button id="btn-submit" :disabled="disabledButton"
                @click="loginAuth">LOGIN</button>
        </form>
    </div>
</template>
  
<script>
import { useAuthStore } from '../stores/auth'

export default {
    data() {
        return {
            useAuthStore,
            email: '',
            password: '',
        }
    },
    computed: {
        disabledButton() {
            return this.email.length == 0 || this.password.length < 6;
        },
        loginAuth(){
            useAuthStore.authenticate(this.email, this.password)
        }
    }
}
</script>