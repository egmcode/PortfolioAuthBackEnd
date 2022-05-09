import UserServices from "../services/UserServices.js";
import mailgun from "../services/MailServices.js";
import { 
    getUser,
    getEUser,
    postUser,
    updateItem,
    deleteUser,
    loggedIn
 } from "../services/UserDBServices.js";

export const createUser = async (body) =>
{
    try
    {
        let userResp = await getUser(body["user_name"], false);
        let emailResp = await getEUser(body["email"], false);

        body["pass_word"] = UserServices.processPW(body["pass_word"]);

        if(!userResp["found"] && !emailResp["found"])
            return await postUser(body);
        else if(userResp["found"] && emailResp["found"])
            return ({status: "Username and Email Exists"});
        else if(!userResp["found"] && emailResp["found"])
            return ({status: "Email Exists"});
        else 
            return ({status: "Username Exists"});
    }
    catch
    {
        return ({status: "error"});
    }
}

export const updateUser = async (body, tokenVal) =>
{
    try
    {
        let authenticated = false;
        let token = "";
        let noDuplicate = true;

        if(body["type"] === "reset")
            token = body["JWT"];
        else if(body["type"] === "normal")
            token = tokenVal;
        else
            token = "";

        let loginResp = await loggedIn(token);

        if(loginResp["status"] === "AUTH")
            authenticated = true;
        else
            return ({status: "NOAUTH"});

        if(body["item"] === "email")
        {
            let emailResp = await getEUser(body["value"], false);

            if(emailResp["found"])
            {
                noDuplicate = false;
                return ({status: "duplicate email"});
            }
        }
        else if(body["item"] === "pass_word")
        {
            body["value"] = UserServices.processPW(body["value"]);
        }
        
        if(authenticated && noDuplicate)
            return await updateItem(body["item"], body["value"], body["user_name"]);
    }
    catch
    {
        return ({status: "error"});
    }
}

export const deleteUserAct = async (body, token) =>
{
    try
    {
        let authenticated = false;
        let loginResp = await loggedIn(token);

        if(loginResp["status"] === "AUTH")
        {
            authenticated = true;
            return await deleteUser(body["user_name"]);
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

export const userLoggedIn = async (token) =>
{
    try
    {
        return await loggedIn(token);
    }
    catch
    {
        return ({status: "error"});
    }
}

export const userLogin = async (body, type) =>
{
    try
    {
        let matchingPW = false;
        let userResp = {};

        if(type === "email")
            userResp = await getEUser(body["email"], true);
        else
            userResp = await getUser(body["user_name"], true);

        if(userResp["found"])
        {
            matchingPW = UserServices.comparePW(body["pass_word"], userResp["respBody"]["pass_word"]);

            if(matchingPW)
            {
                type === "email" ? body["user_name"] = userResp["respBody"]["user_name"] : body["user_name"] = body["user_name"];
                let token = UserServices.genToken({user_name: body["user_name"]});
                return({status: "AUTH", respBody: userResp["respBody"], jwt: token});
            }
            else
            {
                return({status: "incorrect password"});
            }
        }
        else
        {
            return ({status: "user not found"});
        }
    }
    catch
    {
        return ({status: "error"});
    }
}

export const resetLink = async (body) =>
{
    try
    {
        let userResp = await getEUser(body["email"], false);

        if(userResp["found"])
        {
            try
            {
                mailgun.mailsvc(body["email"], {user_name: userResp["respBody"]["user_name"]});
                return ({status: "link sent"});
            }
            catch
            {
                return ({status: "error"});
            }
        }
    }
    catch
    {
        return ({status: "error"});
    }
}

export const verifyToken = async (body) =>
{
    try
    {
        let userResp = await getUser(UserServices.verifyToken(body["JWT"])["user_name"], false);

        if(userResp["found"])
            return ({status: "AUTH", respBody: userResp["respBody"]});
        else
            return ({status: "NOAUTH"});
    }
    catch
    {
        return ({status: "error"});
    }

}
