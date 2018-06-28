
import express from 'express';
let router = express.Router();
import User from '../models/user';
import loggedOut from '../middleware/index.js';
import requiresLogin from '../middleware/index.js';

//login GET 
router.get('/', (req, res, next) => {
    return res.render('login', { title: 'Kirjaudu palveluun'});
});

//login POST 
router.post('/', (req, res, next) =>{
	if(req.body.username &&
			req.body.pw){
		User.authenticate(req.body.username, req.body.pw, (error, user) =>{
		if(error || !user){
			let err = new Error('Virheellinen käyttäjätunnus tai salasana');
			err.status=401;
			return next(err);
		} else {
			req.session.userId = user._id;
			return res.redirect('/insertssn');
		}
		});
	}else {
		let err = new Error('Kirjoita käyttäjätunnus ja salasana');
		err.status = 401;
		return next(err);
	}
});

//insert ssn etc. GET
router.get('/insertssn', loggedOut, (req, res, next) =>{
	return res.render('insertssn', { title: 'Syötä tiedot'});
});

//queryresult GET
router.get('/queryresults', requiresLogin, (req, res, next) =>{
	return res.render('queryresults', {title: 'Kyselyn tulokset'})
});

//createuser GET
router.get('/createuser', loggedOut, (req, res, next) =>{
	return res.render('createuser', { title: 'Luo uusi käyttäjä' });
});

//createuser POST 
router.post('/createuser', (req, res, next) =>{
	if(req.body.email &&
			req.body.username &&
			req.body.password &&
			req.body.confirmpassword) {
		
		if(req.body.password !== req.body.confirmpassword){
			let err = new Error('Salasanat eivät täsmää');
			err.status = 400
			return next(err);
		}
	
		let user = new User(req.body.name, req.body.username, req.body.email);
		res.json(user);
		
	} else {
		let err = new Error('Kaikki kentät on täytettävä');
		err.status = 400;
		return next(err);
	}
});

//log out page GET
router.get('/logout', (req, res, next) =>{
	  if (req.session) {
	    req.session.destroy(function(err) {
	      if(err) {
	        return next(err);
	      } else {
	        return res.redirect('login'), { title: 'Kirjauduit ulos'};
	      }
	    });
	  }
	});

export default router;
