const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const { generateToken, jwtAuthMiddleware } = require('./../jwt');

// Post route for signing up a new person
router.post('/signup', async (req, res) => {
    try {
        const data = req.body; // Assuming the request body contains the person data

        // Create a new Person document using the Mongoose model
        const newPerson = new Person(data);

        // Save the new person to the database
        const response = await newPerson.save();
        console.log('Data saved');

        const payload ={
            id: response.id,
            username: response.username,
   
        }
        console.log(JSON.stringify(payload));


        // Generate a JWT token for the new person
        const token = generateToken(payload);
        console.log("Token generated:", token);

        res.status(200).json({ response: response, token: token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



//Login Routes

router.post('/login', async (req, res) => {

    try{
        //Extract username and password from request body
        const {username, password} = req.body;

        //Find the person with the given username
        const user = await Person.findOne({username: username});

        if(!user || !( await user.comparePassword(password))){
            return res.status(401).json({error: "Invalid username or password"});
        }

        //generate tokens

        const payload = {
            id : user.id,
            username : user.username,

        }
        const token = generateToken(payload);


        //return token as response
        res.json({token});

    }
    catch(e){
        console.error(e);
        res.status(500).json({error: "Internal Server Error"});

    }
}
)

// Get all persons
router.get('/',jwtAuthMiddleware, async (req, res) => {
    try {
        const data = await Person.find();
        console.log('Data fetched');
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//Profile route
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userData = req.user;
        console.log("User Data",userData);
        const userId = userData.id;
        const user = await Person.findById(userId);
        res.status(200).json({user});

    }
    catch(e){
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
})




// Get persons by work type
router.get('/:workType', async (req, res) => {
    try {
        const workType = req.params.workType;
        if (['chef', 'manager', 'waiter'].includes(workType)) {
            const response = await Person.find({ work: workType });
            console.log('Data fetched');
            res.status(200).json(response);
        } else {
            res.status(400).json({ error: "Invalid work type" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update a person by ID
router.put('/:id', async (req, res) => {
    try {
        const personId = req.params.id;
        const updatedPersonData = req.body;

        const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        });

        if (!response) {
            return res.status(404).json({ error: "Person not found" });
        }

        console.log("Data updated");
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Delete a person by ID
router.delete('/:id', async (req, res) => {
    try {
        const personId = req.params.id;
        const response = await Person.findByIdAndDelete(personId);

        if (!response) {
            return res.status(404).json({ error: "Person not found" });
        }

        console.log("Data deleted");
        res.status(200).json({ message: 'Person deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
