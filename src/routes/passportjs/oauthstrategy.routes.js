const express = require('express');
const router = express.Router();

const passport = require('passport');


router.get('/', async (req, res)=>{
  try{
    res.render('home');
  }catch(err){
    res.status(500).json({message:"Server not cathed", err:err.message});
  }
});

router.get('/login', async (req, res)=>{
    try{
      res.render('login');
    }catch(err){
      res.status(500).json({message:"Server not cathed", err:err.message});
    }
});

router.get('/dashboard', async (req, res)=>{
    try{
      res.render('dashboard');
    }catch(err){
      res.status(500).json({message:"Server not cathed", err:err.message});
    }
})


module.exports = router;