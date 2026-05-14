const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travel-tracer', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
