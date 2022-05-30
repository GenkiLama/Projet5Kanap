import { getData } from "./data.js";

const url = "http://localhost:3000/api/products";
const items = await getData(url);

function getCart(){
    return JSON.parse(localStorage.getItem("aCart")) || []
  }


export { url , items , getCart }