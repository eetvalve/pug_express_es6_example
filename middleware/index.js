export function loggedOut(req, res, next){
	if(req.session && req.session.userId) {
		return res.redirect('login', { title: 'Kirjaudu palveluun'});
	}
	return next();
}
export function requiresLogin(req, res, next){
	if(req.session && req.session.userId){
		return next();
	} else {
		let err = new Error('Tämän sivun katseleminen vaatii sisäänkirjautumisen');
		err.status=401;
		return next(err);
	}
}