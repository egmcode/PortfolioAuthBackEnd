import pool from '../database/Database.js';
import user from './UserServices.js';

//GET by user_name helper function
export const getUser = (user_name, login) => 
{
    return new Promise((resolve, reject) => 
    {
        pool.query('select * from user where user_name = ?', user_name, function(error, rows) 
        {
            if(error)
            {
                return resolve({status: "error", found: false});
            }
            else
            {
                try 
                {
                    if(login)
                    {
                        return resolve({status: "successful", respBody: {
                            "user_name": rows[0]["user_name"],
                            "first_name": rows[0]["first_name"],
                            "pass_word": rows[0]["pass_word"],
                            "email": rows[0]["email"]
                        }, found: true});
                    }
                    else
                    {
                        return resolve(
                            {status: "successful", 
                            respBody: {
                                "user_name": rows[0]["user_name"],
                                "first_name": rows[0]["first_name"],
                                "email": rows[0]["email"]
                            },
                            found: true
                        });
                    }
                }
                catch(err)
                {    
                    return resolve({status: "error", found: false});
                }
            }
        })
    })
}

//GET by email helper function
export const getEUser = (email, login) => 
{
    return new Promise((resolve, reject) => 
    {
        pool.query('select * from user where email = ?', email, function(error, rows) 
        {
            if(error)
            {
                return resolve({status: "error", found: false});
            }
            else
            {
                try
                {
                    if(login)
                    {
                        return resolve({status: "successful", respBody: {
                            "user_name": rows[0]["user_name"],
                            "first_name": rows[0]["first_name"],
                            "pass_word": rows[0]["pass_word"],
                            "email": rows[0]["email"]
                        }, found: true});
                    }
                    else
                    {
                        return resolve({status: "successful", respBody: {
                            "user_name": rows[0]["user_name"],
                            "first_name": rows[0]["first_name"],
                            "email": rows[0]["email"]
                        }, found: true});
                    }
                }
                catch
                {
                    return resolve({status: "error", found: false});
                }
            }
        })
    })
}

//POST helper function
export const postUser = (user) =>
{
    return new Promise(async (resolve, reject) => 
    { 
        try
        {
            pool.query('insert into user set ?', user, function(error, rows) 
            {
                if(error)
                {
                    return reject({status: "error"});
                }
                else
                {
                    return resolve({status: "successful"});
                }
            })
        }
        catch
        {
            return reject({status: "error"});
        }
    })
}

//DEL helper function
export const deleteUser = (user_name) =>
{
    return new Promise((resolve, reject) => 
    {
        pool.query('delete from user where user_name = ?', user_name, function(error, rows) 
        {
            if(error)
            {
                return reject({status: "error"});
            }
            else
            {
                return resolve({status: "successful"});
            }
        })
    })
}

//UPDATE column helper function
export const updateItem = (item, value, username) =>
{
    try
    {
        return new Promise((resolve, reject) => 
        {
            pool.query('update user set ?? = ? where user_name = ?', [item, value, username], function(error, rows)
            {
                if(error)
                    return reject({status: "error"});
                else
                    return resolve({status: "successful"});
            })
        })
        
    }
    catch
    {
        return reject({status: "error"});
    }
}

//LogIn helper function
export const loggedIn = async (token) => 
{
    try 
    {
        let response = await getUser(user.verifyToken(token)["user_name"], false);
        
        if(response["status"] === "successful")
        {
            return ({status: "AUTH", respBody: response["respBody"]});
        }
        else
        {
            return ({status: "NOAUTH"});
        }
    }
    catch 
    {
        return ({status: "error"});
    }
}