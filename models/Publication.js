const {schema, model, Schema} = require("mongoose");
const { stripLow } = require("validator");

const PublicationSchema = Schema({
    user:{
        type:Schema.ObjectId,
        ref: "User"
    },
    text: {
        type:String,
        require: true
    },
    file:{
        type:String
    },
    created_at:{
        type:Date,
        default:Date.now
    }
})

module.exports = model("Publication", PublicationSchema, "publications");