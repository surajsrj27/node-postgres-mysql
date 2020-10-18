require('dotenv').config();
const express = require('express');
const cors = require("cors");
const db = require("./db");

const app = express();

// middleware

// app.use((req,res,next) => {
//     console.log("middleware");
//     next();
// });

app.use(cors());
app.use(express.json()); // middleware gets req.body

// get all restaurants
// method: GET
app.get("/api/v1/restaurants", async (req,res) => {

    try{
        // const results = await db.query("SELECT * FROM restaurants");
        // console.log(results);

        const restaurantRatingsData = await db.query(
            "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(ratings),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id"
        );
        // console.log(restaurantRatingsData);

        res.status(200).json({ 
            status: "success", 
            results: restaurantRatingsData.rows.length,
            data: {
                restaurants: restaurantRatingsData.rows
            }
        });
    }catch(err){
        console.error(err.message);
    }
});

//Get a Restaurant
app.get("/api/v1/restaurants/:id", async (req,res) => {
    // console.log(req.params.id);

    try{
        const restaurant = await db.query('select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(ratings),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id=$1', [req.params.id]);
        
        const reviews = await db.query('SELECT * FROM reviews WHERE restaurant_id = $1', [req.params.id]);
        
        res.status(200).json({ 
            status: "success", 
            data: {
                restaurant: restaurant.rows[0],
                reviews: reviews.rows
            }
        });
    }catch(err){
        console.error(err.message);
    }
});

// Create Restaurants
app.post("/api/v1/restaurants", async (req,res) => {
    // console.log(req.body);

    try{
        const results = await db.query("INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) returning *", [req.body.name, req.body.location, req.body.price_range]);
        // console.log(results);

        res.status(201).json({ 
            status: "success", 
            data: {
                restaurant: results.rows[0]
            }
        });
    }catch(err){
        console.error(err.message);
    }
});

// Update Restaurants
app.put("/api/v1/restaurants/:id", async (req,res) => {
    // console.log(req.params.id);

    try{
        const results = await db.query("UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 returning *", [
            req.body.name,
            req.body.location,
            req.body.price_range,
            req.params.id
        ]);
        // console.log(results);

        res.status(200).json({ 
            status: "success", 
            data: {
                restaurant: results.rows[0]
            }
        });
    }catch(err){
        console.error(err.message);
    }
});

// Delete Restaurant
app.delete("/api/v1/restaurants/:id", async (req,res) => {
    
    try{
        const results = await db.query("DELETE FROM restaurants WHERE id = $1", [req.params.id]);
    
        res.status(204).json({
            status: "Deleted successfully"
        });
    }catch(err){
        console.error(err.message);
    }
});

app.post("/api/v1/restaurants/:id/addReview", async (req,res) => {
    try{
        const newReview = await db.query("INSERT INTO reviews (restaurant_id,name,reviews,ratings) VALUES ($1, $2, $3, $4) returning *", [req.params.id, req.body.name, req.body.reviews, req.body.ratings]);
    
        res.status(201).json({
            status: "success",
            data: { 
                review: newReview.rows[0]
            }
        });
    }catch(err){
        console.log(err);
    }
});

const port = 5000 || process.env.PORT;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});