const {Schema, model} = require("mongoose");
const { stripLow } = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");

var mongoose = require("mongoose");
//const mongoosePaginate = require("mongoose-paginate");

var userSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    surname: {
        type: String
    },

    nick: {
        type: String,
        required: true
    },
    bio: String,
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required:true
    },

    role:{
        type: String,
        required: true,
        default: "role_user"
    },

    image:{
        type: String,
        default: "default.png"
    },

    created_at: {
        type: Date,
        default: Date.now
    }
});
// userSchema.plugin(mongoosePaginate);
mongoosePaginate(userSchema);
// var User = mongoose.Model('Model', userSchema);

// const UserSchema = Schema({
//     name: {
//         type: String,
//         required: true
//     },

//     surname: {
//         type: String
//     },

//     nick: {
//         type: String,
//         required: true
//     },
//     bio: String,
//     email: {
//         type: String,
//         required: true
//     },

//     password: {
//         type: String,
//         required:true
//     },

//     role:{
//         type: String,
//         required: true,
//         default: "role_user"
//     },

//     image:{
//         type: String,
//         default: "default.png"
//     },

//     created_at: {
//         type: Date,
//         default: Date.now
//     }

// });

module.exports = model("User", userSchema, "users")