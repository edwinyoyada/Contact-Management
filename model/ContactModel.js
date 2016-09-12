var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ContactSchema = new Schema ({
	name: String,
    title: String,
	email: [],
    phone: [],
    address: [],
    company: String,
	avatar: String,
	others: [Schema.Types.Mixed],
	is_active: Boolean,
	last_update: Date
},
{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

// ContactSchema.virtual('full_avatar_url').get(function () {
// 	if(this.avatar)
// 		return avatarBaseUrl + this.avatar;
// });

module.exports = mongoose.model('Contact', ContactSchema);
