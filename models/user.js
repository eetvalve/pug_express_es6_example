
export default class User {

    constructor(name, username, email){
        this.name = name;
        this.username = username;
        this.email = email;
    }

    getUsername(){
        return this.username;
    }
    getName(){
        return this.name;
    }
}

import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs'

let UserSchema = new mongoose.Schema({
	  email: { 
	    type: String, 
	    unique: true, 
	    required: true, 
	    trim: true
	  },
	  username: { 
	    type: String, 
	    unique: true, 
	    required: true, 
	    trim: true
	  },
	  password: {
	    type: String, 
	    required: true,
	  },
	  confirmpassword: {
		    type: String, 
		    required: true,
		  }
	});

	//authenticate input against database
	UserSchema.statics.authenticate = (email, password, callback) =>{
	  User.findOne({ username: username })
	    .exec((err, user) => {
	      if (err) {
	        return callback(err)
	      } else if (!user) {
	        let err = new Error('Käyttäjää ei löytynyt.');
	        err.status = 401;
	        return callback(err);
	      }
	      bcrypt.compare(password, user.password, function (err, result) {
	        if (result === true) {
	          return callback(null, user);
	        } else {
	          return callback();
	        }
	      })
	    });
	};

	//hash password before saving
	UserSchema.pre('save', (next) =>{
	  let user = this;
	  bcrypt.hash(user.password, 10, (err, hash) =>{
	    if (err) {
	      return next(err);
	    }
	    user.password = hash;
	    next();
	  })
	});
	
	module.exports = User;