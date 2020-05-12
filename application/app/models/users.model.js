const {mongoose} = require("../../system/db");
const bcrypt = require("bcrypt");

const UsersSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        remember_token: {
            type: String,
            default: null
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false,
        collection: "UsersCollection"
    }
);

UsersSchema.pre("save", function(next) {
    if (this.isModified("password") || this.isNew()) {
        this.password = bcrypt.hashSync(this.password, 12);
    }
    next();
});

module.exports = mongoose.model("UsersModel", UsersSchema);