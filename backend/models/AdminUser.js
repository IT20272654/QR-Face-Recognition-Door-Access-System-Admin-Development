const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminUserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['SuperAdmin', 'Admin'], default: 'Admin' },
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
}, { timestamps: true });

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser;