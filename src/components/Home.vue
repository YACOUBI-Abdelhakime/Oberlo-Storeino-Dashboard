<template>
    <div class="body">
        <Header />
        <div class="row">
            <div class="div-products col-lg-3 col-md-4 col-sm-6 " v-for="(product, index) in products" v-bind:key="product._id">
                <div class="card">
                    <div class="image">
                        <img :src="product.images[0]" />
                    </div>
                    <div class="card-inner">
                        <div class="card-subtitle mb-2 text-muted">
                            <h3>{{product.buyingPrice}}</h3>
                            <div class="div-drop" data-toggle="tooltip" data-placement="bottom" title="Delete product">
                                <img @click="deleteProduct(product,index)" src="../assets/red-drop-1.png" >
                            </div>
                            
                        </div>
                        <div class="content">
                            <p >{{product.title.slice(0,80)}}...</p>
                        </div>
                        <div class="btns">
                            <button v-on:click="viewMore" :id="product._id" class="btn btn-primary">Details</button>
                            <button v-on:click="ExportProduct(product)" :id="product._id" class="btn btn-primary">Export</button>
                            <!-- <img src="../assets/remove.png" > -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="div-1">
            <div class="div-2">
                <form v-on:submit="storeinoLogin">
                    <h3>Storeino Sign In</h3>

                    <div class="form-group">
                        <label>Email address</label>
                        <input type="email" id="email" class="form-control form-control-lg" required/>
                    </div>

                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="password" class="form-control form-control-lg" required/>
                    </div>

                    <button type="submit" class="btn btn-dark btn-lg btn-block">Sign In</button>
                    <button @click="cancel" class="btn btn-block">Cancel</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import router from "../router" 
import Header from '../components/Header'
import jwt_decode from "jwt-decode";

    export default {
        data() {
            return{
                products:[],
                user : {},
                storeinoToken :"",
                storId:"",
                productToExport : ""
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
            showOk(message){
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0; 

                document.querySelector(".div-notify").classList.add("success");
                document.querySelector(".div-notify").classList.remove("error");
                document.querySelector("#notify-title").style.color = "green"
                document.querySelector("#notify-title").innerHTML="Success.";
                document.querySelector("#notify-content").innerHTML="<span>"+message+"</span>";

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
            storeinoLogin(e){
                e.preventDefault()
                axios.get("http://localhost:8085/user/tokenStoreino")    
                    .then((resp) => {
                        localStorage.setItem('storeinoToken',resp.data.storeinoToken)
                        this.storeinoToken = resp.data.storeinoToken;
                        document.querySelector("div.div-1").classList.remove("activeLogin");
                        this.showLogin()
                    })    
                    .catch((error) => {    
                        this.showError(error.message)
                    })
            },
            ExportProduct(product){
                this.productToExport = product;
                this.showLogin();
            },
            showLogin(){
                console.log("**S-Token : "+this.storeinoToken)
                console.log("....S-Token : "+ localStorage.getItem("storeinoToken") )
                // if(this.storeinoToken == "" || this.storeinoToken == null){
                if(localStorage.getItem("storeinoToken") == "" || localStorage.getItem("storeinoToken") == null){
                    document.querySelector("div.div-1").classList.add("activeLogin");
                }else{
                    this.storeinoToken = localStorage.getItem("storeinoToken")
                    this.SendToStoreino(this.productToExport)
                }
                
            },
            SendToStoreino(product){
                let buyingPrice = product.buyingPrice.trim().split(" ")[0]/*.replace(".","").replace(",",".")*/
                let comparePrice = product.comparePrice.trim().split(" ")[0]
                let salePrice = product.salePrice.trim().split(" ")[0]
                let tokenDecoded = jwt_decode(this.storeinoToken);
                this.storId = tokenDecoded.store._id
                let images =[]
                product.images.forEach(url => {
                    images.push({src:url,storeId: this.storId})
                });
                let options = []
                product.properties.forEach(function(prop){
                    let pValues = []
                    if(prop.title == "Color" || prop.title == "Size"){
                        prop.list.forEach(function(v){
                            pValues.push({"value1":v,"value2":v})
                        })
                        options.push({"key":prop.title.toLowerCase(),"name":prop.title,"values":pValues})
                    }else{
                        prop.list.forEach(function(v){
                            pValues.push({"value1":v})
                        })
                        options.push({"name":prop.title,"values":pValues})
                    } 
                })
                let price = {buyingPrice: buyingPrice, salePrice: salePrice}
                comparePrice != "" ? price.comparePrice= comparePrice : "WALO" 
                let header = { headers: {"x-auth-token": this.storeinoToken}}
                axios.post("https://api-stores.storeino.com/api/products/create", 
                    {
                        description: product.description.slice(0,248),
                        images: images,
                        name: product.title,
                        options: options,
                        price: price,
                        seo: {keywords: [], description: product.description.slice(0,248), title: product.title},
                        status: "PUBLISH",
                    },header)    
                    .then((resp) => {
                        console.log(resp.data)
                        this.showOk("Product successfully added to Storeino")
                    })    
                    .catch((error) => {    
                        this.showError("ErrOOR login ="+error.message)  
                        console.log(" Error :: "+error.message)
                    })
            },
            cancel(e){
                 e.preventDefault()
                document.querySelector("div.div-1").classList.remove("activeLogin");
            },
            deleteProduct(product,index){
                //e.preventDefault() 
                // let index = e.target.getAttribute("id")
                // console.log("index === "+index)
                // let product = this.products[index]
                if(confirm("Are you sure to delete this product !!")){
                    let header = { headers: {"x-token": this.user.token}}
                    axios.post("http://localhost:8085/product/delete", {"id":product._id},header)    
                        .then((resp) => {
                            if(resp.data.res == "ok") {
                                this.products.splice(index, 1);
                                // location.reload();
                                console.log("ok deleted ...")
                            }else{
                                this.showError(resp.data.message)
                            } 
                        })    
                        .catch((error) => {
                            this.showError(error.message)  
                        })
                }
            },
        },
        mounted() {
            this.getUser()
            this.getProducts()
            if(!this.user.fullName){
                router.push("/")
            }
            this.storeinoToken = localStorage.getItem('storeinoToken')
            console.log("SToken ::: "+this.storeinoToken)
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
.card-subtitle > img{
    height: 30px;
    width: 30px;
}
.card-subtitle{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.card{
    /* height: 450px; */
    box-shadow: 0px 6px 12px 1px rgb(0 0 0 / 19%), 0px 6px 12px 1px rgb(0 0 0 / 19%);
}
.card:hover{
    box-shadow: 0px 6px 8px 7px rgb(0 0 0 / 23%),0px 6px 8px 7px rgb(0 0 0 / 23%);
}
.div-drop{
    border-radius: 5px;
    border: 1px red solid;
    background-color: #f5000017;
    height: 35px;
    width: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.div-drop:hover{
    background-color: #f5000045;
}
.div-drop > img{
    height: 20px;
    width: 20px;
}

</style>