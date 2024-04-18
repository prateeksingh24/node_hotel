const  passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Person = require('./models/Person');

passport.use(new LocalStrategy(async(username,password,done)=>{
    //Authentication logic here
    try{
        // console.log("Recieved Credentials: ",USERNAME,password);
        const user  = await Person.findOne({username});
        if(!user)
            return done(null,false,{message : "Incorrect Username"});
        const isPasswordMatch  =await user.comparePassword(password);
        if(isPasswordMatch){
            return done(null,user);
        }
        else{
            return done(null,false,{message : "Incorrect Password"});
        }
    }
    catch(e){
        return(done(e));
    }

}));

module.exports = passport;