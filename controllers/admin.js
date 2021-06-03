
const Drive = require('../models/drive');
const Student = require('../models/student');

exports.getAddDrive = (req, res) => {
	res.render('addDrives.ejs', {
		morris: true,
		float: false,
    tables: false,
    editing: req.query.edit,
    csrfToken: req.csrfToken()
	});
};

exports.getHome = (req, res) => {
	res.render('admin-index.ejs', {
      morris: true,
      float: false,
      tables: false,
      csrfToken: req.csrfToken()
  });
};

exports.video = (req, res) => {
	res.redirect('http://localhost:3000');
};

exports.postAddDrive = (req, res) => {
  const drive = new Drive({
    name: req.body.name,
    cp: req.body.campool,
    date: req.body.date,
    website: req.body.website,
    ssc: req.body.ssc,
    hsc: req.body.hsc,
    be: req.body.be,
    cb: req.body.cb,
    hob: req.body.hob,
    yosb: req.body.yosb,
    description: req.body.description,
    batch: req.body.batch
  });
  drive
    .save()
    .then(result => {
      console.log("drive added succesfuuly");
    })
    .catch(err => {
      console.log(err);
    });
  

  res.render('admin-index.ejs', {
		morris: true,
		float: false,
    tables: false,
    csrfToken: req.csrfToken()
	});
};

exports.viewDrives = (req, res) => {
  Drive.find()
    .then(drives => {
      res.render('viewDrives.ejs', {
        morris: true,
        float: false,
        tables: false,
        drives: drives,
        csrfToken: req.csrfToken()
      });
    })
    .catch(err => console.log(err));
	
};

exports.viewDrive = (req, res) => {
    
  Drive.findById(req.params.id)
  .then(drive => {
    res.render('viewDrive.ejs', {
      morris: true,
      float: false,
      tables: false,
      drive: drive,
      csrfToken: req.csrfToken()
    });
  })
  .catch(err => console.log(err));

  };


  exports.getEditDrive = (req, res) => {
    Drive.findById(req.params.id)
    .then(drive => {
      res.render('addDrives.ejs', {
        morris: true,
        float: false,
        tables: false,
        drive: drive,
        editing: req.query.edit,
        csrfToken: req.csrfToken()
      });
    })
    .catch(err => console.log(err));

  };


  

  exports.postEditDrive = (req, res) => {
    
    Drive.findById(req.body.id)
    .then(drive => {
      drive.name = req.body.name;
      drive.cp = req.body.campool;
      drive.date = req.body.date;
      drive.website = req.body.website;
      drive.ssc = req.body.ssc;
      drive.hsc = req.body.hsc;
      drive.be = req.body.be;
      drive.cb = req.body.cb;
      drive.hob = req.body.hob;
      drive.yosb = req.body.yosb;
      drive.description = req.body.description;
      drive.batch = req.body.batch;
      return drive.save();
    })
    .then(result => {
      Drive.find()
      .then(drives => {
        res.render('viewDrives.ejs', {
          morris: true,
          float: false,
          tables: false,
          drives: drives,
          csrfToken: req.csrfToken()
        });
      })
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
    
    
  };

  exports.deleteDrive = (req, res) => {
    Drive.findByIdAndRemove(req.params.id)
    .then(result => {
      Drive.find()
      .then(drives => {
        res.render('viewDrives.ejs', {
          morris: true,
          float: false,
          tables: false,
          drives: drives,
          csrfToken: req.csrfToken()
        });
      })
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  };


  exports.viewStudents = (req, res) => {
   
    Student.find()
      .then(students => {
        res.render('viewStudents.ejs', {
          morris: true,
          float: false,
          tables: false,
          students: students,
          csrfToken: req.csrfToken()
        });
      })
      .catch(err => console.log(err));
  };

  exports.viewEligibleStudents = (req, res) => {

    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
      if(!req.query.name){
        return res.render('viewEligibleStudents.ejs', {
          morris: true,
          float: false,
          tables: false,
          students: [],
          csrfToken: req.csrfToken(),
          errorMessage: message
        });
      }
      else{
    
        Drive.findOne({
          name: req.query.name,
          batch: req.query.batch
        })
        .then(drive =>{

          if(!drive){
            req.flash('error','Comapny not Registered. Company name is case sensitive')
            res.redirect('/viewEligibleStudents');
          }
            drive
            .populate('cart.items.studentId')
            .execPopulate()
            .then(user => {
              const students = user.cart.items;
              //console.log(students);
              res.render('viewEligibleStudents.ejs', {
                morris: true,
                float: false,
                tables: false,
                students: students,
                company: req.query.name,
                batch: req.query.batch,
                csrfToken: req.csrfToken(),
                errorMessage: message
              });
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
      }
  };