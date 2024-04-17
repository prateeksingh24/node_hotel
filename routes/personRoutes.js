const express = require('express');
const router = express.Router();
const Person = require('../models/Person');


//Post route
router.post('/', async (req, res) => {

    try {
        const data = req.body //Assuming the request body contains the person data


        //Create a new Person document using the Mongoose model

        const newPerson = new Person(data);

        //Save the new person to the database

        const response = await newPerson.save();
        console.log('data saved');
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }

});


router.get('/', async (req, res) => {
    try {
        const data = await Person.find();
        console.log('data fetched');
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });

    }
});

router.get('/:workType', async (req, res) => {
    try {
        const workType = req.params.workType; // Extract the workType from the URL parameter
        if (workType == 'chef' || workType == 'manager' || workType == 'waiter') {
            const response = await Person.find({ work: workType });
            console.log('data fetched');
            res.status(200).json(response);
        }
        else {
            res.status(400).json({ error: "Invalid work type" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.put('/:id',async(req,res)=>{
    try{
        const personId = req.params.id;//Extract the personId from the URL parameter
        const updatedPersonData = req.body;//Updated person data

        const response = await Person.findByIdAndUpdate(personId,updatedPersonData,{
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation 
        })
        if (!response) {
            return res.status(404).json({ error: "Person not found" });
        }
        
        console.log("data Updated");
        res.status(200).json(response);

    }
    catch(e){
        console.log(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.delete('/:id',async(req,res)=>{
try{
    const personId = req.params.id;
    const response = await Person.findByIdAndDelete(personId);   
    
    if (!response) {
        return res.status(404).json({ error: "Person not found" });
    }
    
    console.log("data deleted");
    res.status(200).json({message :'person Deleted Successfully'});
        }
catch(e){
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });

}
})




module.exports = router;