const settings = require('./settings.dev.json');
const civicSip = require('civic-sip-api');
console.log(settings);
const express = require('express');
const session = require('express-session');

const app = express();
app.disable('etag');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        name : 'connect.sid' 
    }
}));



app.get('/', function (req, res) {
    console.log(req.session);
    if(!req.session.email){
        res.render('index', { 
            title: 'Hey Anonymous!', 
            message: 'Why not try to civic your way in?'            
        });
    }else{
        res.render('index', { 
            title: 'Welcome, ' + req.session.email , 
            message: 'Good job, ' + req.session.email,
            email : req.session.email
        });
    }
   
});

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/?loggedout');
});

app.get('/exchange-code', (req, res) => {
    var jwtToken = req.query.token;
    var civicClient = civicSip.newClient(settings.civic);
    civicClient.exchangeCode(jwtToken).then((userData) => {
        req.session.email = userData.data[0].value;
        res.redirect('/');
    }).catch((error) => {
        console.log(error);
        res.redirect('/?error');
    });
});

app.listen(8000, () => console.log('Example app listening on port 8000!'))