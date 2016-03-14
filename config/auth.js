//this is where the facebook OAuth Information goes
module.exports = {
  'facebook':{
    'clientID':'245880409087585', //taken from my developer dashboard for the app
    'clientSecret': '409094323bd4da0035e2aa0341a3a337',
    'callbackURL': 'http://localhost:3000/auth/facebook/callback',
    'profileFields': ['emails', 'displayName'] 
  }
}
