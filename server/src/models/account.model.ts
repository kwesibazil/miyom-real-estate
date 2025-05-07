import mongoose from "mongoose";
import {CounterModelType, AccountModelType} from '../types/general.interface'


const CounterSchema = new mongoose.Schema<CounterModelType>({
  month: { type: String, unique: true, required:true },
  sequence: { type: Number, default: 0, min: 0, required: true }
})


const AccountSchema = new mongoose.Schema<AccountModelType>({
  property: CounterSchema,
  investment: CounterSchema
},{ timestamps: true})



export default mongoose.model('Account', AccountSchema);
