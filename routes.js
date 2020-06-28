import { Router } from 'express';
import bcrypt from 'bcryptjs';
import config from '../../config';
import jwt from 'jsonwebtoken';

let Account = require('./account.model');
const { JWT_SECRET } = config;
const router = Router();



router.get('/', function(req, res) {
    Account.find(function(err, accounts) {
        if(err) {
            console.log(err);
        } else {
            res.json(accounts);
        }
    });
});
router.post('/signup', function(req, res) {
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

router.post('/login', function(req, res) {
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



router.post('/password/edit', function(req,res) {
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

router.post('/favorites/apod/fetch', function(req, res) {
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
router.post('/favorites/mars/fetch', function(req, res) {
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

router.delete('/favorites/apod/delete', function(req,res) {
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

router.delete('/favorites/mars/delete', function(req,res) {
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
router.put('/favorites/mars/add', rfunction(req,res) {
    
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

router.post('/favorites/mars/edit', function(req,res) {
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

router.post('/favorites/apod/edit', function(req,res) {

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
router.put('/favorites/apod/add', function(req, res) {
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
router.post('/favorites', function(req, res) {
    Account.findById(req.body._id, function(err, acc) {
        if(acc) {
            res.json(acc.favorites);
        }
        else {
            console.log(err);
        }
    });
});

export default router;