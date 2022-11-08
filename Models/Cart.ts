import { Schema, model } from "mongoose";


const cartSchema = new Schema({
    Name_Product: {type: String, required: true, unique: true},
    Amount: {type: Number, required: true},
    Price:  {type: Number},
});

export default model("Cart", cartSchema);
