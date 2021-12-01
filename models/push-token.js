const { Schema, model } = require('mongoose');

const PushTokenSchema = Schema({
    userId: {
        type: String,
        requiered: true
    },
    pushToken: {
        type: String,
        requiered: true
    },
}, { timestamps: true });

PushTokenSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject(); // operador rest??
    return object;
});

module.exports = model('PushToken', PushTokenSchema);