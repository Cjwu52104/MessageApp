const express = require('express');
const port = 3000;
const app = express();
const http = require('http').Server(app);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message',{
    text: String
});
    
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        if (err) {
            console.log('error')
        }else {
            res.send(messages)
        }
    })
});
    
app.post('/messages', (req, res) => {
    var message = new Message(req.body);
        
    if (message != null) {
        Message.create(message).then(function(messagedata){
            res.status(200).send(messagedata)
        })
    } else {
        res.status(400).send()
    }
        
});
    
var url = 'mongodb://localhost:27017/messageapp'
    
var server = http.listen(port, () => {
    console.log('server is running on port', server.address().port);

    const connectMongoWithRetry = () => {
        mongoose
            .connect(url, {
                useUnifiedTopology: true,
                useNewUrlParser: true,})
            .then(() => console.log(`MongoDB connection ready at ${url}`))
            .catch(err => {
                console.error('MongoDB connection error', err);
                setTimeout(connectMongoWithRetry, 5000);
            });
    };

    connectMongoWithRetry();
});

