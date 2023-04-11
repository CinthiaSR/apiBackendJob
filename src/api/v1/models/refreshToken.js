import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String
  }
}, { 
  timestamps: true 
})

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)

export default RefreshToken