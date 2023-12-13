const { Schema } = new dbLocal({ path: "./databases" });

const CartItem = Schema("CartItem", {
    _id: { type: Number },
    name: { type: String },
    price: { type: String },
    restaurantId: { type: String },
    imagePath: { type: String },
});