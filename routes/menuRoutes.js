const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');



router.post('/', async (req, res) => {
    try {
        const menuItemData = req.body;//Asssuming the request body contains menu item data

        const menuItem = new MenuItem(menuItemData);//create a new menu item using the Mongoose model

        const menu_data = await menuItem.save();//Save the new menu item to the database

        console.log('Menu item saved');
        res.status(201).json(menu_data);
    }
    catch (error) {
        console.log('Error on creating menu item:', error);
        res.status(500).json({ error: "Internal Server error" })

    }
});



router.get('/', async (req, res) => {
    try {
        const data = await MenuItem.find();
        console.log('data fetched');
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error:"Internal Server Error "})

    }
})

router.get('/:tastetype',async(req,res)=>{
    try{
        const tastetype = req.params.tastetype;
   if(tastetype == "Spicy" || tastetype == "Sweet" || tastetype =="Sour"){
    const response = await MenuItem.find({taste:tastetype});
    console.log("Data Fetched");
    res.status(200).json(response);
   }
   else {
    res.status(400).json({error:"Invalid taste type"})
   }

    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Internal Server Error "})

    }
})


router.put('/:id',async(req,res)=>{
    try{
        const itemId = req.params.id;
        const updatedUserData = req.body;

        const response = await MenuItem.findByIdAndUpdate(itemId,updatedUserData,{
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation 
        });
        if (!response) {
            return res.status(404).json({ error: "Item not found" });
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
        const itemId = req.params.id;
        const response = await MenuItem.findByIdAndDelete(itemId);
        if (!response) {
            return res.status(404).json({ error: "Item not found" });
        }
        
        console.log("data deleted");
        res.status(200).json({message :'Item Deleted Successfully'});
           
    }
    catch(e){
        console.log(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


module.exports = router;