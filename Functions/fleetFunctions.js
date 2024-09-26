const RegisterVehicles = require("../models/registerVehiclesModel");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// This is the function to return the loginErrors
const loginErrorFunction = ()=>{

    let loginError = {
        emailError : '', passwordError: '', wrongEmailOrPassword: 'Wrong Email or Password'
    };

    return loginError;

}





const checkLoginDetails = async (UserModel, requestBody, res, req) => {
    const email = requestBody.email;
    const password = requestBody.passwordValue;
    const value = await tryLoginIn(email, password, res, UserModel, req);
    return value;
};

// Function to try login
const tryLoginIn = async (email, password, res, UserModel, req) => {    
    try {

        const user = await UserModel.findOne({ email });
     
   if(!user){
      return loginErrorFunction();

   }


//   continue to check the password 
if(user['Password'] != password){

       return loginErrorFunction();
     } 
// Sign the token with a secret key (keep this secret!)
const token = jwt.sign({ data: 'tokenization' }, 'fleet', { expiresIn: '1d' });

// Set the JWT in the cookie
res.cookie('authorized', token, {
    maxAge: 1000 * 60 * 60 * 24, 
    httpOnly: true,              
    secure: true                 
});

  return false; //return false boolean so we redirect from the frontend.

    } catch (err) {

        return loginErrorFunction();
    }
};



const checkPasswordAndEmail = (userModel, UserModel, res, req, values) => {
    let errors = "";
    if (values.Password === values.confirmPassword) {
        userModel.save()
            .then((result) => {
                res.json({ anything: "redirect" });
            })
            .catch((err) => {
                if (err.code === 11000) {
                    errors = {
                         email: 'This email is already registered', password: '', phone: '',
            confirmPassword: ''
                    }
                    res.json({errors});
                }// plan on sending 404 later
            });
    } else {
        errors = {
            email: '', password: 'Passwords do not match', phone: '',
            confirmPassword: ''
        };
        res.json({ errors });
    }
};


// Function to generate token
const generateToken = (res) => {
    const tokenValue = Math.random().toString(36).substr(2, 10);
    res.cookie('token', tokenValue, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
    return tokenValue;
};


// Function to send email
const sendEmail = async (userEmail, id, token) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'akiniesamuel77@gmail.com',
            pass: 'izlu mvpe iwxo mdcd'
        },
        tls: { ciphers: 'SSLv3' }
    });

    const mailOptions = {
        from: 'akiniesamuel77@gmail.com',
        to: userEmail,
        subject: 'Password Reset from Fleet ',
        text: `https://fleetmanagementsystems1.onrender.com/createPassword/${id}/${token}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.log(error);
    }
};





module.exports = {
 checkLoginDetails,
 tryLoginIn,
 checkPasswordAndEmail,
 generateToken,
 sendEmail,
}