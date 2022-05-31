import { getData } from "./data.js";

const url = "http://localhost:3000/api/products";
const items = await getData(url);



export { url , items }