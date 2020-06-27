const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const accountRoute = express.Router();
const PORT = 80;

let Account = require('./account.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/nasa', { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

accountRoute.route('/').get(function(req, res) {
    Account.find(function(err, accounts) {
        if(err) {
            console.log(err);
        } else {
            res.json(accounts);
        }
    });
});
accountRoute.route('/signup').post(function(req, res) {
    let acc = new Account({
        _id: req.body._id,
        password: req.body.password,
        favorites: []
    });
    acc.save()
        .then(acc => {
            res.status(200).json({'login' : 'account created successfully'});
        })
        .catch(err => {
            res.status(400).send('sign up failed');
        });
});

accountRoute.route('/login').post(function(req, res) {
    Account.findById(req.body._id, function(err, acc){
        // if(acc && acc._id === req.body._id && acc.password === req.body.password) {
        //     res.status(200).send('valid login');
        // } else {
        //     res.status(404).send('invalid email or password');
        // }
        if(err) {
            res.status(404).send('invalid email');
        } else {
            if(acc && acc._id === req.body._id && acc.password === req.body.password) {
                res.status(200).send('valid login');
            } else {
                res.status(204).send('invalid password');
            }
        }
    });
});



accountRoute.route('/password/edit').post(function(req,res) {
    Account.findById(req.body._id, function(err, acc) {
        if(acc && acc._id === req.body._id && acc.password === req.body.password) {
            acc.password = req.body.new_password;
            acc.save().then( () => {
                res.json('password updated');
            })
            .catch(err => {
                res.status(400).send('update failed');
            });
        } else {
            res.status(404).send('account not found');
        }
    });
});

accountRoute.route('/favorites/apod/fetch').post(function(req, res) {
    Account.findById(req.body._id, function(err, acc) {
        var found = false;
        if(err || acc === null) {
            res.status(404).send("account not found");
        }
        else {
            for(var i = 0; i < acc.favorites.apod.length; ++i) {
                if(acc.favorites.apod[i]._id === req.body.data._id) {
                    res.json(acc.favorites.apod[i]).status(200).send();
                    found = true;
                }
            }
            if(!found) {
                res.status(204).send("not found");
            }
            
        }
    });
});
accountRoute.route('/favorites/mars/fetch').post(function(req, res) {
    Account.findById(req.body._id, function(err, acc) {
        var found = false;
        if(err || acc === null) {
            res.status(404).send("account not found");
        } else {
            for(var i = 0; i < acc.favorites.mars.length; ++i) {
                if(acc.favorites.mars[i]._id === req.body.data._id) {
                    res.json(acc.favorites.mars[i]).status(200).send();
                    found = true;
                }
            }
            if(!found) {
                res.status(204).send("not found");
            }
        }
    });
});

accountRoute.route('/favorites/apod/delete').delete(function(req,res) {
    Account.findById(req.body._id, function(err, acc) {
        if(err || acc === null || acc.favorites === null || acc.favorites.apod === null) {
            res.status(404).send("account not found");
        } else {
            for(var i = 0; i < acc.favorites.apod.length; ++i) {
                if(acc.favorites.apod[i]._id === req.body.data._id) {
                    acc.favorites.apod.splice(i, 1);
                    acc.save(function(error, success){
                        if(error) {
                            res.status(500).send("failed to deleted");
                        } else {
                            res.status(200).send(success);
                        }
                    });
                }
            }
        }
    });
});

accountRoute.route('/favorites/mars/delete').delete(function(req,res) {
    Account.findById(req.body._id, function(err, acc) {
        if(err || acc === null || acc.favorites === null || acc.favorites.apod === null) {
            res.status(404).send("account not found");
        } else {
            for(var i = 0; i < acc.favorites.mars.length; ++i) {
                if(acc.favorites.mars[i]._id === req.body.data._id) {
                    acc.favorites.mars.splice(i, 1);
                    acc.save(function(error, success){
                        if(error) {
                            res.status(500).send("failed to deleted");
                        } else {
                            res.status(200).send(success);
                        }
                    });
                }
            }
        }
    });
});
accountRoute.route('/favorites/mars/add').put(function(req,res) {
    
    Account.findOne({ _id: req.body._id }).then(account => {
        account.favorites.mars.unshift({
            _id: req.body.data._id,
            url: req.body.data.url,
            date: req.body.data.date,
            comment: req.body.data.comment,
            api: req.body.data.api,
            array_id: req.body.data.array_id
        });
        account.save().then(profile => res.json(profile)).catch(error => res.json(error));
    }).catch(err => {
        console.log(err);
    });
});

accountRoute.route('/favorites/mars/edit').post(function(req,res) {
    Account.update({_id: req.body._id, "favorites.mars._id" : req.body.data._id }, {'$set': {
        'favorites.mars.$.comment': req.body.data.comment
    }}, function(err, success) { 
        if(err) {
            res.json(err);
        } else {
            res.json(success);
        }
    }); 
});

accountRoute.route('/favorites/apod/edit').post(function(req,res) {
    
    
    Account.update({_id: req.body._id, "favorites.apod._id" : req.body.data._id }, {'$set': {
        'favorites.apod.$.comment': req.body.data.comment
    }}, function(err, success) { 
        if(err) {
            res.json(err);
        } else {
            res.json(success);
        }
    }); 
            
});
accountRoute.route('/favorites/apod/add').put(function(req, res) {
    console.log(req.body);
    Account.findOne({ _id: req.body._id }).then(account => {
        
        account.favorites.apod.unshift({
            _id: req.body.data._id,
            url: req.body.data.url,
            date: req.body.data.date,
            comment: req.body.data.comment,
            api: req.body.data.api
        });
        
        
        account.save().then(profile => res.json(profile)).catch(error => res.json(error));
    }).catch(err => {
        console.log(err);
    });
 
    // Account.findById(req.body._id, function(err, acc) {
    //     if(acc && acc.password === req.body.password && acc._id === req.body._id) {
    //         acc.favorites.apod.push({
    //             _id: "bye",
    //             url: "google.com",
    //             date: "11-06-2018",
    //             comment: "test",
    //             api: "apod"
    //         });
    //         acc.markModified('favorites.apod');
    //         acc.save().then( success => {
    //             res.json(acc.favorites);
    //         })
    //         .catch( err => {
    //             res.status(400).send(err);
    //         });
    //     } else {
    //         res.status(404).send('account not found');
    //     }
    // });
});
accountRoute.route('/favorites').post(function(req, res) {
    Account.findById(req.body._id, function(err, acc) {
        if(acc) {
            res.json(acc.favorites);
        }
        else {
            console.log(err);
        }
    });
});
app.use('/account', accountRoute);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

/*var query = Login.find({ "login_email" : id}).exec(function(err, account){
    if(!account) {
        res.status(404).send('data is not found');
    } else {
        account[0].login_password = req.body.login_password;
        account[0].save().then(account => {
            res.json('password updated');
        })
        .catch(err => {
            res.status(400).send('update failed');
        });
    }
});*/