<template>
    <div class="vue-tempalte">
        <form v-on:submit="login">
            <h3>Sign In</h3>

            <div class="form-group">
                <label>Email address</label>
                <input type="email" id="email" class="form-control form-control-lg" required/>
            </div>

            <div class="form-group">
                <label v-on:click="showUser">Password</label>
                <input type="password" id="password" class="form-control form-control-lg" required/>
            </div>

            <button type="submit" class="btn btn-dark btn-lg btn-block">Sign In</button>

            <p class="forgot-password text-right mt-2 mb-4">
                <router-link to="/forgot-password">Forgot password ?</router-link>
            </p>

            <div class="social-icons">
                <ul>
                    <li><a href="#"><i class="fa fa-google"></i></a></li>
                    <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                    <li><a href="#"><i class="fa fa-twitter"></i></a></li>
                </ul>
            </div>

        </form>
    </div>
</template>

<script>
import axios from "axios"

    export default {
        data() {
            return { }
        },
        methods: {
            login(e){
                e.preventDefault()    
                let email = document.getElementById("email").value   
                let password =  document.getElementById("password").value   
                let data = {   
                    'email': email, 
                    'password': password    
                } 

                axios.post("http://localhost:8085/user/", data)    
                    .then((resp) => {
                        if(resp.data.res == "ok") {
                            this.setUser(resp.data.user, resp.headers["x-token"])
                            //router.push("/home")
                            console.log("RESP :>"+resp.data.user.fullName)
                        }else{
                            document.getElementById("email").value =""
                            document.getElementById("password").value =""
                            this.showError(resp.data.message)
                        } 
                    })    
                    .catch((error) => {    
                        this.showError(error.message)  
                    }) 
            },
            showUser(){
                console.log("Name:: "+localStorage.getItem('fullName'))
                console.log("token:: "+localStorage.getItem('token'))
            },
            setUser(user,token){
                localStorage.setItem('id',user._id)
                localStorage.setItem('fullName',user.fullName)
                localStorage.setItem('email',user.email)
                localStorage.setItem('token',token)
            },
            showError(message){
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                console.log("Error :>"+message)
                document.querySelector(".div-notify").classList.add("error");
                document.querySelector(".div-notify").classList.remove("success");
                document.querySelector("#notify-title").style.color = "red"
                document.querySelector("#notify-title").innerHTML="There is a problem.";
                document.querySelector("#notify-content").innerHTML="<span>Error : </span>"+message;

                document.querySelector(".notify").classList.toggle("active");
                
                setTimeout(function(){
                    document.querySelector(".notify").classList.remove("active");
                },3000);
            }
        }
    }
</script>