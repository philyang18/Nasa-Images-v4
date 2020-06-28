const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let Favorite = new Schema({

    
    
},{_id: false});

let Account = new Schema({
    _id:  {
        type: String
    },
    password: {
        type: String
    },
    favorites: {
        apod: [
            {
                _id: {
                    type: String
                },
                url: {
                    type: String
                },
                date: {
                    type: String
                },
                comment: {
                    type: String
                },
                api: {
                    type: String
                }
            
            },{_id: false}
        ],
        mars: [
            {
                _id: {
                    type: String
                },
                url: {
                    type: String
                },
                date: {
                    type: String
                },
                comment: {
                    type: String
                },
                api: {
                    type: String
                },
                array_id: {
                    type: Number
                }
            
            },{_id: false}
        ]
    }
   
}, {_id: false});


module.exports = mongoose.model('Account', Account);