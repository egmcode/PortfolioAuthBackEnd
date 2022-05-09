import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UserServices
{
    static processPW(password)
    {
        const salt = bcrypt.genSaltSync();
        return bcrypt.hashSync(password, salt);
    }

    static comparePW(inpPassword, hashPassword)
    {
        return bcrypt.compareSync(inpPassword, hashPassword);
    }

    static genToken(username)
    {
        let tokenSec = process.env.JWTSEC;
        return jwt.sign(username, tokenSec, {expiresIn: '3600s'});
    }

    static verifyToken(token)
    {
        let tokenSec = process.env.JWTSEC;
        return jwt.verify(token, tokenSec);
    }
}

export default UserServices;