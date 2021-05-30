<template>
    <div class="body">
        <Header />
        <div class="basic-info">
            <h5>Title</h5>
            <textarea name="title" id="title" v-model="product.title" ></textarea>
            <h5>Description</h5>
            <textarea name="description" id="description" v-model="product.description" ></textarea>
            <div class="div-price row">
                <div class="price col-lg-4 col-md-6 col-sm-6">
                    <h5>Sale price</h5>
                    <input class="price-input" id="sale-price" type="text" v-model="product.salePrice">
                </div>
                <div class="price col-lg-4 col-md-6 col-sm-6">
                    <h5>Compare price</h5>
                    <input class="price-input" id="compare-price" type="text" v-model="product.comparePrice">
                </div>
                <div class="price col-lg-4 col-md-6 col-sm-6">
                    <h5>Buying price</h5>
                    <input class="price-input" id="buying-price" type="text" v-model="product.buyingPrice">
                </div>
            </div>
        </div>
        
        <div class="div-container">
            <h5 class="title">Images</h5>
            <div class="images row">
                <div class="div-imgs col-sm-4 col-lg-2 col-md-3" v-for="(image,index) in product.images" v-show="image != null" :id="image" v-bind:key="image">
                    <div class="card">
                        <div class="img-product">
                            <img :src="image" >
                        </div>
                        <div class="card-inner btns">
                            <button v-on:click="removeImg(index)" class="btn remove-btn action-btn"><img src="../assets/remove.png" alt="remove"></button>
                            <button v-on:click="viewImage(image)"  class="btn view-btn action-btn"><img src="../assets/view.png" alt="remove"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="div-container">
            <h5 class="title">Properties</h5>
            <div id="properties" class="properties row"> 
                <div class="div-prop col-lg-4 col-md-6 col-sm-12" v-for="(property,index) in product.properties"  v-bind:key="index" >
                    <div class="title-prop">
                        <input type="text" v-model="property.title">
                        <button v-on:click="removeProp(index)" class="btn remove-btn btn-prop radius"><img src="../assets/remove.png" alt="remove"></button>
                    </div>
                    <div id="content-prop" class="content-prop row">
                        <div class="value-prop col-lg-6 col-md-6 col-sm-4" v-for="(value,index) in property.list" v-bind:key="index" >
                            <input class="input-value-prop" type="text" v-model="property.list[index]">
                            <button v-on:click="removePropValue(property,index)" class="btn-value-prop btn btn-prop"><img src="../assets/drop.png" alt="remove"></button>
                        </div>
                        <div id="add-prop-value-btn" class="value-prop col-lg-6 col-md-6 col-sm-4">
                            <button v-on:click="addPropValue(property)" class="grren btn-value-prop btn btn-prop" data-toggle="tooltip" data-placement="bottom" title="Add new Value"><img src="../assets/add.png"></button>
                        </div>
                    </div>
                </div> 
                <div class="div-add-prop col-lg-4 col-md-6 col-sm-12">
                        <button v-on:click="addProp(product.properties)" class="btn btn-add-prop" data-toggle="tooltip" data-placement="bottom" title="Add new Property"><img src="../assets/add.png"></button>
                </div> 
            </div>
        </div>
        <div >
            <button @click="save" class="btn btn-primary btn-save">Save</button>
            <button @click="deleteProduct" class="btn btn-danger btn-save">Save</button>
            <button @click="cancel" class="btn btn-secondary btn-cancel">Cancel</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import router from "../router" 
import _ from 'lodash';
import Header from '../components/Header'

    export default {
        data() {
            return{
                product:{},
                user : {},
                id_product:"",
                sale_price:"...",
                imgRemoved :[],
                videVProp : "...",
                newValuesProp : ""
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
                this.id_product = localStorage.getItem('product-selected')
                this.user = user;
            },
            getProduct(){  
                let header = { headers: {"x-token": this.user.token}}
                axios.post("http://localhost:8085/product/getOne", {id:this.id_product},header)    
                    .then((resp) => {
                        if(resp.data.res == "ok") {
                            this.product = resp.data.product;
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
            deleteProduct(e){
                e.preventDefault() 
                let header = { headers: {"x-token": this.user.token}}
                axios.post("http://localhost:8085/product/delete", {"id":this.product._id},header)    
                    .then((resp) => {
                        if(resp.data.res == "ok") {
                            router.push("/home")
                        }else{
                            this.showError(resp.data.message)
                        } 
                    })    
                    .catch((error) => {
                        this.showError(error.message)  
                    })
            },
            removeImg(index){
                this.product.images.splice(index, 1);
            },
            viewImage(img){
                console.log(img)
            },
            removeProp(index){
                this.product.properties.splice(index, 1);
            },
            removePropValue(property,index){
                property.list.splice(index, 1);
            },
            addPropValue(property){
                property.list.push("");
            },
            addProp(props){
                props.push({"list":[],"title":""})
            },
            cancel(){
                router.push("/home")
            },
            save(){
                let prod = _.pick(this.product,["images","title","description","price","properties","idUser"])

                let header = { headers: {"x-token": this.user.token}}
                axios.post("http://localhost:8085/product/update", {"id":this.product._id,"product":prod},header)    
                    .then((resp) => {
                        if(resp.data.res == "ok") {
                            router.push("/home")
                        }else{
                            this.showError(resp.data.message)
                        } 
                    })    
                    .catch((error) => {
                        this.showError(error.message)  
                    })
            }
        },
        mounted() {
            this.getUser()
            this.getProduct()
            if(!this.user.fullName){
                router.push("/")
            }
        }
    }
</script>
<style scoped>
.body{
    margin-top: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 30px;
}
.basic-info{
    width: 97%;
    height: auto;
}
h5{
    margin: 10px 0px;
}
#title{
    width: 100%;
    height: auto;
}
#description{
    width: 100%;
    height: 150px;
}
.div-price{
    margin-top: 10px;
}
.price{
    display: flex;
    justify-content: center;
    align-items: center;
}
.price-input{
    width: 100px;
    height: auto;
    margin-left: 15px;
    text-align: center;
}
.div-imgs{
    margin : 7px 00px;
    padding: 2px 15px;
    
}
.img-product{
    height: 170px;
}
.img-product > img{
    height: 170px;
}
.btns{
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.action-btn{
    width: 40px;
    height: 40px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.action-btn:hover {
  box-shadow: 0 5px 5px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}
.action-btn>img{
    width: 30px;
    height: 30px;
}

.remove-btn{
    background-color: #ff2f2f;
}
.view-btn{
    background-color: #00ffe26b;
}
.properties{
    margin: 30px 20px !important;
    width: 97.5%;
}
#properties{
    margin-left: 20px !important;
}
.div-container{
    margin: 0px 20px;
    width: 100%;
} 
.images{
    margin: 5px 20px !important;
}
.div-prop{
    border: #afb0b3 2px solid;
    background-color: rgb(255, 255, 255);
    border-radius: 7px;
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 0 !important;
}
.div-prop:hover{
    box-shadow: 0 5px 5px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}
.title-prop{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    background-color: gray;
}
.content-prop{
    display: flex;
    align-items: center;
    justify-content: center;
    
    max-height: 300px;
    height: auto;
    overflow: auto;
}
.value-prop{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
}
.input-value-prop{
    width: 90px;
    height: 35px;
    background-color: white;
    border: 1px solid black;
}
.btn-value-prop{
    background-color: white;
    border: 1px solid black;
    border-radius: 0 !important;
}
.btn-prop{
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.grren{
    background-color: #2cf779 !important;
}
.radius{
    border-radius: 4px;
}
.btn-prop:hover {
  box-shadow: 0 5px 5px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}
.btn-prop>img{
    width: 30px;
    height: 30px;
}
.row{
    margin-left: 0 !important;
    margin-right: 0 !important;
}
.btn-add-prop{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    border: 1px solid black;
}
.btn-add-prop:hover {
  box-shadow: 0 5px 5px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}
.btn-add-prop>img{
    width: 40px;
    height: 40px;
}
.div-add-prop{
    display: flex;
    align-items: center;
    justify-content: center;
}
.btn-add-prop{
    background-color: #2cf779;
}
.btn-save{
    /* width: auto; 
    padding: 3px 5px;*/
    margin: 2px 10px;
}
.btn-cancel{
    margin: 2px 10px;
}

</style>