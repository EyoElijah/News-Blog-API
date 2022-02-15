const { Schema, model } = require('mongoose');

const VideoSchema = new Schema(
	{
		videoId: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

module.exports = model('Video', VideoSchema);
