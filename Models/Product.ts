import {Schema , model} from "mongoose";

const productSchema = new Schema({
    Name_Product: {type: String, required: true, unique: true},
    Amount: {type: Number, required: true},
    Price: {type: Number, required: true}, 
    In_Cart: {type: Boolean, default: false},
});

export default model("Product", productSchema);