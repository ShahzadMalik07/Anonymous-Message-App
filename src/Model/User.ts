import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content : string,
    createdAt: Date
}
export interface User extends Document {
    username : string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean
    isAcceptingMessages:boolean,
    message:Message []

}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        require:true,
        default:Date.now
    }
})

const UserSchema: Schema<User> = new Schema({
  username:{
    type:String,
    required:[true, "Username is Required"],
    unique:true,
    trim:true
  },
  email:{
    type:String,
    required:[true, "Email is Required"],
    unique:true,
    match:[/.+@.+\..+/,"please use valid email "]
     

  },
  password:{
    type:String,
    required:true

  },
  verifyCode:{
    type:String,
    required:[true,"code is required"]
  },
  verifyCodeExpiry:{
    type:Date,
    required:true
  },
  isVerified:{
    type:Boolean,
    default:false

  },
  isAcceptingMessages:{
    type:Boolean,
    default:true
  },
  message:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel