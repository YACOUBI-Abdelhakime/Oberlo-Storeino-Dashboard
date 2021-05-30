<template>
        <nav id="header" class="navbar shadow bg-white rounded justify-content-between flex-nowrap flex-row fixed-top">
            <div class="container">
                <img height="35" src="../assets/logo-Storeino.png" title="Storeino" alt="storeino">
                <ul v-if="this.user.fullName == null" class="nav navbar-nav flex-row float-right">
                    <li class="nav-item">
                        <router-link class="nav-link pr-3" to="/">Sign in</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="btn btn-outline-primary" to="/signup">Sign up</router-link>
                    </li>
                </ul>
                <ul v-else class="nav navbar-nav flex-row float-right">
                    <li class="nav-item">
                        <a v-on:click="logOut" class="nav-link pr-3" >log out</a>
                    </li>
                    <li class="nav-item">
                        
                        <button id="div-user" class="btn btn-primary" @click="goProfile">
                            <img height="25" src="../assets/person.png" alt="person">
                            <span>{{user.fullName}}</span>
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
</template>

<script>
import router from "../router"

    export default {
        data() {
            return {
                user : {},
            }
        },
        methods:{
            getUser(){
                let user = {
                    id : localStorage.getItem('id'),
                    fullName: localStorage.getItem('fullName'),
                    email :localStorage.getItem('email'),
                    token: localStorage.getItem('token'),
                }
                this.user = user;
            },
            logOut(){
                localStorage.clear()
                router.push("/")
            },
            goProfile(){
                router.push("/profile")
            }
        },
        mounted() {
            this.getUser()
        }
    }
</script>
<style scoped>
#div-user{
    padding: 5px 10px;
}
#div-user img{
    margin-right: 2px;
}
#div-user:hover{
    background-color: #007bff;
}
li:hover{
    text-decoration: underline;
}
</style>