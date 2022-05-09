import express from 'express';
import {
    createUser,
    updateUser,
    deleteUserAct,
    userLoggedIn,
    userLogin,
    resetLink,
    verifyToken
 } from '../controllers/UserDBController.js';


const router = express.Router();

router.get('/', (req, res) => 
{
    res.send("Healthy!");
});

router.post('/newUser', async (req, res) => 
{
    let resp = await createUser(req.body);
    res.send(resp);
})

router.post('/updateUser', async (req, res) => 
{
    let resp = await updateUser(req.body, req.cookies.jwt);
    res.send(resp);
})

router.delete('/delete', async (req, res) => 
{
    let token = req.cookies.jwt;
    let resp = await deleteUserAct(req.body, token);
    res.send(resp);
})

router.post('/loggedin', async (req, res) => 
{
    let resp = await userLoggedIn(req.cookies.jwt);
    res.send(resp);
})

router.post('/loginUser', async (req, res) => 
{
    let resp = await userLogin(req.body, req.body["type"]);
    if(resp["status"] === "AUTH")
    {
        res.cookie("jwt", resp["jwt"], {
            httpOnly: true,
            secure: true
        });
    }
    res.send(resp);
})

router.post('/logout', async (req, res) => 
{
    try
    {
        res.cookie('jwt', 'expired token', {
            httpOnly: true, 
            secure: true
        });
        res.send({status: "logged out"});
    }
    catch
    {
        res.send({status: "error"});
    }
})

router.post('/getLink', async (req, res) => 
{
    let resp = await resetLink(req.body);
    res.send(resp);
})

router.post('/verify', async (req, res) => 
{
    let resp = await verifyToken(req.body);
    res.send(resp);
})


export default router;