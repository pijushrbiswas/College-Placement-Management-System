const Admin = require('../models/admin');
const Student = require('../models/student');
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const config = require('../config');
const nodemailer = require('nodemailer');
//const sendgridTransport = require('nodemailer-sendgrid-transport');

// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth:{
//         api_key:'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'
//     }
// }));

const transporter = nodemailer.createTransport(config.mailer);

exports.getLogin =  (req, res) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
	res.render('login.ejs', {
		morris: true,
		float: false,
        tables: false,
        csrfToken: req.csrfToken(),
        errorMessage: message
	});
};
exports.postAdminLogin =  (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
     Admin.findOne({email : email})
        .then(user => {
           if(!user){
               req.flash('error','Invlaid Email.');
               return res.redirect('/');
           }
           bcrypt.compare(password,user.password)
                .then(result => {
                    if(result){
                        req.session.isLoggedIn = true;
                        req.session.admin = true;
                        req.session.user = user;
                        return req.session.save(result => {
                            res.render('admin-index.ejs', {
                                morris: true,
                                float: false,
                                tables: false,
                                csrfToken: req.csrfToken()
                            });
                        });
                    }
                    req.flash('error','Invlaid Password.');
                    res.redirect('/');
                })
        })
        .catch(err => {
            res.redirect('/');
        });
	
};
exports.postAdminSignup =  (req, res) => {
    const name = req.body.name;
	const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if(password != confirmPassword){
        req.flash('error','Password and Confirm Password Mismatch.');
        return res.redirect('/admin-signup');
    }
    Admin.findOne({ email: email })
        .then(err => {
        if (err) {
            req.flash('error','User Already Exists.');
            return res.redirect('/admin-signup');
        }
        return bcrypt.hash(password,12)
            .then(hashedPassword => {
                const user = new Admin({
                    email: email,
                    password: hashedPassword,
                    name: name
                });
                return user.save();
            })
            .then(result => {
                req.flash('error','User Registered Succesfully');
                res.redirect('/');
                var mailOptions = {
                    from: 'Code4Share <no-reply@code4share.com>',
                    to: email,
                    subject: 'signup Succesfull!',
                    html: '<h1>You succesfully signed up!</h1>'
                  };
                return transporter.sendMail(mailOptions);
                
            })
            .catch(err => {
                console.log(err);
            });
        })
        .catch(err => {
            console.log(err);
        });
};
exports.getAdminSignup =  (req, res) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
	res.render('admin-signup.ejs', {
		morris: true,
		float: false,
        tables: false,
        csrfToken: req.csrfToken(),
        errorMessage: message
	});
};

exports.getAdminLogout =  (req, res) => {
    req.session.destroy(result => {
        res.redirect('/');
    })
}



exports.getAdminUserProfile = (req, res) => {
    
    res.render('admin-userProfile.ejs', {
        morris: true,
        float: false,
        tables: false,
        user: req.user,
        csrfToken: req.csrfToken()
    });
}

exports.postAdminUserProfile = (req, res) => {

    req.user.name=req.body.name;
    req.user.email=req.body.email;
    req.user.save()
     .then(result => {
        res.render('admin-index.ejs', {
            morris: true,
            float: false,
            tables: false,
            csrfToken: req.csrfToken()
        });
     })
    .catch(err => console.log(err));
}

exports.getAdminReset = (req,res) => {
   
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
    res.render('admin-reset.ejs', {
		morris: true,
		float: false,
        tables: false,
        csrfToken: req.csrfToken(),
        errorMessage: message
	});
}

exports.postAdminReset =  (req, res) => {
    crypto.randomBytes(32,(err,buffer) => {
        if(err){
            return res.redirect('/admin-reset');
        }
        const token = buffer.toString('hex');
        Admin.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                req.flash('error','Invalid Email.');
                return res.redirect('/admin-reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        })
        .then(result => {
            var mailOptions = {
                    from: 'Code4Share <no-reply@code4share.com>',
                    to: req.body.email,
                    subject: 'Password Reset!',
                    html: `
                    <h1>You requested for password reset!</h1>
                    <p> Click this to reset the password</p>
                    <a href="http://localhost:3000/admin-newPassword/${token}">link</a>
                    `
                  };
            transporter.sendMail(mailOptions);
            req.flash('error','Password Reset Link sent to registered Email.');
            res.redirect('/admin-reset');
        })
        .catch(err => {
            console.log(err);
        });
    })
}


exports.getAdminNewPassword = (req, res) => {
    const token = req.params.token;
    Admin.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
        
            res.render('admin-newPassword.ejs', {
                morris: true,
                float: false,
                tables: false,
                csrfToken: req.csrfToken(),
                userId: user._id.toString(),
                token: token,
                passwordToken: token
            });
        })
        .catch(err => {
        console.log(err);
        });
}

exports.postAdminNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.token;
    let resetUser;
    
  
    Admin.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    })
      .then(user => {
      
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
      })
      .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then(result => {
        req.flash('error','Password Reset Succesfull.')
        res.redirect('/');
      })
      .catch(err => {
        console.log(err);
      });
  };
//------------------------------------------------------------------------

exports.getStudentReset = (req,res) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
    res.render('student-reset.ejs', {
		morris: true,
		float: false,
        tables: false,
        csrfToken: req.csrfToken(),
        errorMessage: message
	});
}

exports.postStudentReset =  (req, res) => {
    crypto.randomBytes(32,(err,buffer) => {
        if(err){
            return res.redirect('/student-reset');
        }
        const token = buffer.toString('hex');
        Student.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                req.flash('error','Invlaid Email.');
                return res.redirect('/student-reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        })
        .then(result => {
            var mailOptions = {
                    from: 'Code4Share <no-reply@code4share.com>',
                    to: req.body.email,
                    subject: 'Password Reset!',
                    html: `
                    <h1>You requested for password reset!</h1>
                    <p> Click this to reset the password</p>
                    <a href="http://localhost:3000/student-newPassword/${token}">link</a>
                    `
                  };
            transporter.sendMail(mailOptions);
            req.flash('error','Password Reset link sent to registered Email.');
            res.redirect('/student-reset');
        })
        .catch(err => {
            console.log(err);
        });
    })
}


exports.getStudentNewPassword = (req, res) => {
    const token = req.params.token;
    Student.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
        
            res.render('student-newPassword.ejs', {
                morris: true,
                float: false,
                tables: false,
                csrfToken: req.csrfToken(),
                userId: user._id.toString(),
                token: token,
                passwordToken: token
            });
        })
        .catch(err => {
        console.log(err);
        });
}

exports.postStudentNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.token;
    let resetUser;
    
  
    Student.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    })
      .then(user => {
        console.log(userId);
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
      })
      .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then(result => {
        req.flash('error','Password Reset Succesfull.');
        res.redirect('/');
      })
      .catch(err => {
        console.log(err);
      });
  };

exports.getStudentUserProfile = (req, res) => {
    
    res.render('student-userProfile.ejs', {
        morris: true,
        float: false,
        tables: false,
        user: req.user,
        csrfToken: req.csrfToken()
    });
}

exports.postStudentUserProfile = (req, res) => {

    req.user.name=req.body.name;
    req.user.email=req.body.email;
    req.user.department=req.body.department;
    req.user.ssc=req.body.ssc;
    req.user.hsc=req.body.hsc;
    req.user.be=req.body.be;
    req.user.save()
     .then(result => {
        res.render('student-index.ejs', {
            morris: true,
            float: false,
            tables: false,
            csrfToken: req.csrfToken()
        });
     })
    .catch(err => console.log(err));
}
exports.postStudentLogin =  (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    Student.findOne({email : email})
        .then(user => {
           if(!user){
               req.flash('error','Invlaid Email.');
               return res.redirect('/')
           }
           bcrypt.compare(password,user.password)
                .then(result => {
                    if(result){
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(result => {
                            res.render('student-index.ejs', {
                                morris: true,
                                float: false,
                                tables: false,
                                csrfToken: req.csrfToken()
                            });
                        });
                    }
                    req.flash('error','Invlaid Password.');
                    res.redirect('/');
                })
        })
        .catch(err => {
            res.redirect('/');
        });
};

exports.getStudentSignup =  (req, res) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
	res.render('student-signup.ejs', {
		morris: true,
		float: false,
        tables: false,
        csrfToken: req.csrfToken(),
        errorMessage: message
	});
};

exports.postStudentSignup =  (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const be = req.body.be;
    const ssc = req.body.ssc;
    const hsc = req.body.hsc;
    const department = req.body.department;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if(password != confirmPassword){
        req.flash('error','Password and Confirm Password Mismatch.');
        res.redirect('/student-signup');
    }
    
    Student.findOne({ email: email })
        .then(err => {
        if (err) {
            req.flash('error','Email already exists.');
            return res.redirect('/student-signup');
        }
        return bcrypt.hash(password,12)
            .then(hashedPassword => {
                const user = new Student({
                    email: email,
                    password: hashedPassword,
                    name: name,
                    be: be,
                    ssc: ssc,
                    hsc: hsc,
                    department: department
                });
                return user.save();
            })
            .then(result => {
                req.flash('error','User Registered Succesfully');
                res.redirect('/');
                var mailOptions = {
                    from: 'Code4Share <no-reply@code4share.com>',
                    to: email,
                    subject: 'signup Succesfull!',
                    html: '<h1>You succesfully signed up!</h1>'
                  };
                return transporter.sendMail(mailOptions);
            })
            .catch(err => {
                console.log(err);
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getStudentLogout =  (req, res) => {
    req.session.destroy(result => {
        res.redirect('/');
    })
}