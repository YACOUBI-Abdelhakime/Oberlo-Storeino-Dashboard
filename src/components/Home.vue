<template>
    <div class="body">
        <Header />
        <div class="row">
            <div class="div-products col-lg-3 col-md-4 col-sm-6 " v-for="product in products" v-bind:key="product._id">
                <div class="card">
                    <div class="image">
                        <img :src="product.images[0]" />
                    </div>
                    <div class="card-inner">
                        <div class="card-subtitle mb-2 text-muted">
                            <h3>{{product.price}}</h3>
                        </div>
                        <div class="content">
                            <p>{{product.title.slice(0,100)}}...</p>
                        </div>
                        <div class="btns">
                            <button v-on:click="viewMore" :id="product._id" class="btn btn-primary">Details</button>
                            <button v-on:click="SendToStoreino" :id="product._id" class="btn btn-primary">Export</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import router from "../router" 
import Header from '../components/Header'

    export default {
        data() {
            return{
                products:[],
                user : {}
            }
        },
        components:{
            Header
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
            getProducts(){  
                let header = { headers: {"x-token": this.user.token}}
                axios.post("http://localhost:8085/product/", {},header)    
                    .then((resp) => {
                        if(resp.data.res == "ok") {
                            this.products = resp.data.products;
                        }else{
                            this.showError(resp.data.message)
                        } 
                    })    
                    .catch((error) => {    
                        this.showError(error.message)  
                    })
            },
            showError(message){
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0; 

                document.querySelector(".div-notify").classList.add("error");
                document.querySelector(".div-notify").classList.remove("success");
                document.querySelector("#notify-title").style.color = "red"
                document.querySelector("#notify-title").innerHTML="There is a problem.";
                document.querySelector("#notify-content").innerHTML="<span>Error : </span>"+message;

                document.querySelector(".notify").classList.toggle("active");
                
                setTimeout(function(){
                    document.querySelector(".notify").classList.remove("active");
                },3000);
            },
            viewMore(e){
                let id_product = e.target.getAttribute("id");
                localStorage.removeItem('product-selected')
                localStorage.setItem('product-selected',id_product)
                router.push("/product")
            },
            SendToStoreino(){
                
            }
        },
        mounted() {
            this.getUser()
            this.getProducts()
            if(!this.user.fullName){
                router.push("/")
            }
        }
    }
</script>
<style scoped>
.body{
    margin-top: 60px;
}
.div-products{
    margin : 7px 00px;
    padding: 2px 15px;
}
.content{
    height: 110px;
    overflow: hidden;
}
.btns{
    display: flex;
    justify-content: space-around;
    align-items: center;
}
</style>