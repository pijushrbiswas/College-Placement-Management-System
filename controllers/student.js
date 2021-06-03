const Drive = require('../models/drive');

exports.getHome = (req, res) => {
	res.render('student-index.ejs', {
		morris: true,
		float: false,
        tables: false,
        csrfToken: req.csrfToken()
	});
};

exports.getViewDrives = (req, res) => {
	Drive.find()
    .then(drives => {
      res.render('student-viewDrives.ejs', {
        morris: true,
        float: false,
        tables: false,
        drives: drives,
        csrfToken: req.csrfToken()
      });
    })
    .catch(err => console.log(err));
};

exports.video = (req, res) => {
	res.redirect('http://localhost:3000');
};

exports.predict = (req, res) => {
	res.redirect('http://localhost:5000');
};

exports.postApplyDrive = (req,res) => {
	const driveId = req.body.driveId;
	Drive.findById(driveId)
		.then(drive => {
			
			var updatedCartItems = [...drive.cart.items];
			updatedCartItems.push({
			  studentId: req.user._id
			});
			
			var updatedCart = {
			  items: updatedCartItems
			};
			drive.cart = updatedCart;
			drive.save();


			  updatedCartItems = [...req.user.cart.items];
			  updatedCartItems.push({
				driveId: drive._id
			  });
			  
			  updatedCart = {
				items: updatedCartItems
			  };
			  req.user.cart = updatedCart;
			  return req.user.save();
		})
		.then(result => {
			Drive.find()
			.then(drives => {
			res.render('student-viewDrives.ejs', {
				morris: true,
				float: false,
				tables: false,
				drives: drives,
				csrfToken: req.csrfToken()
			});
			})
			.catch(err => console.log(err));
		})
		.catch(err => {
			console.log(err);
		});
}

exports.getViewDrive = (req, res) => {
    
	Drive.findById(req.params.id)
	.then(drive => {
	  res.render('student-viewDrive.ejs', {
		morris: true,
		float: false,
		tables: false,
		drive: drive,
		csrfToken: req.csrfToken()
	  });
	})
	.catch(err => console.log(err));
  
};

exports.postViewAppliedDrives = (req,res) => {
	
		  req.user
		  .populate('cart.items.driveId')
		  .execPopulate()
		  .then(user => {
			const drives = user.cart.items
			res.render('viewAppliedDrives.ejs', {
			  morris: true,
			  float: false,
			  tables: false,
			  drives: drives,
			  csrfToken: req.csrfToken()
			});
		  })
		  .catch(err => console.log(err));	
};

exports.deleteAppliedDrive = (req, res) => {

	const updatedCartItems = req.user.cart.items.filter(item => {
		return item.driveId.toString() !== req.params.id.toString();
	  });
	req.user.cart.items = updatedCartItems;
	return req.user.save()
	.then(result => {
		res.redirect('/viewAppliedDrives');
	})
	.catch(err => console.log(err));   
};