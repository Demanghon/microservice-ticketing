import mongoose, { Model, Mongoose } from "mongoose";
import { Password } from "../services/password";

//attributes to create a user
interface UserAttr{
    email: string;
    password: string;
}

//Properties of the model
interface UserModel extends Model<UserDoc> {
    build: (attrs: UserAttr) => UserDoc;
}

interface UserDoc extends mongoose.Document, UserAttr{
    updatedAt: string;
}

//properties of the document


const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
});

userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed)
    }
    done();
})

userSchema.statics.build = (attrs: UserAttr) => {
    return new User(attrs);
};

export const User = mongoose.model<UserDoc, UserModel>("User", userSchema);