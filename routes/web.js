const express = require('express');
const router = express.Router();


const admin = require('../controllers/admin');
const auth = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const student = require('../controllers/student');

router.get('/adminHome', isAuth, admin.getHome);
router.get('/addDrives', isAuth, admin.getAddDrive);
router.post('/addDrives', isAuth, admin.postAddDrive);
router.get('/viewDrives', isAuth, admin.viewDrives);
router.get('/viewDrive/:id', isAuth, admin.viewDrive);
router.get('/editDrive/:id', isAuth, admin.getEditDrive);
router.post('/editDrive', isAuth, admin.postEditDrive);
router.get('/deleteDrive/:id', isAuth, admin.deleteDrive);
router.get('/viewEligibleStudents', isAuth, admin.viewEligibleStudents);
router.get('/viewStudents', isAuth, admin.viewStudents);
router.get('/video', isAuth, admin.video);


router.get('/', auth.getLogin);
router.post('/admin-login', auth.postAdminLogin);
router.get('/admin-signup', auth.getAdminSignup);
router.post('/admin-signup', auth.postAdminSignup);
router.get('/admin-logout', auth.getAdminLogout);
router.get('/admin-reset', auth.getAdminReset);
router.get('/admin-newPassword/:token', auth.getAdminNewPassword);
router.post('/admin-newPassword',auth.postAdminNewPassword);
router.post('/admin-reset', auth.postAdminReset);
router.get('/admin-userProfile', auth.getAdminUserProfile);
router.post('/admin-userProfile', auth.postAdminUserProfile);



//----------------------------------STUDENT ROUTES-------------------------------------------------------



router.post('/student-login', auth.postStudentLogin);
router.get('/student-signup', auth.getStudentSignup);
router.post('/student-signup', auth.postStudentSignup);
router.get('/student-logout', auth.getStudentLogout);
router.get('/student-userProfile', auth.getStudentUserProfile);
router.post('/student-userProfile', auth.postStudentUserProfile);
router.get('/student-reset', auth.getStudentReset);
router.get('/student-newPassword/:token', auth.getStudentNewPassword);
router.post('/student-newPassword',auth.postStudentNewPassword);
router.post('/student-reset', auth.postStudentReset);

router.get('/studentHome', isAuth, student.getHome);
router.get('/student-video', isAuth, student.video);
router.get('/student-predict', isAuth, student.predict);
router.get('/student-viewDrives', isAuth, student.getViewDrives);
router.get('/student-viewDrive/:id', isAuth, student.getViewDrive);
router.post('/applyDrive', isAuth, student.postApplyDrive);
router.get('/viewAppliedDrives', isAuth, student.postViewAppliedDrives);
router.get('/deleteAppliedDrive/:id', isAuth, student.deleteAppliedDrive);
// router.get('/flot', (req, res) => {
// 	res.render('flot.hbs', {
// 		flot: true
// 	});
// });

// router.get('/morris', (req, res) => {
// 	res.render('morris.hbs', {
// 		morris: true
// 	});
// });

// router.get('/tables', (req, res) => {
// 	res.render('tables.hbs', {
// 		tables: true
// 	});
// });

// router.get('/forms', (req, res) => {
// 	res.render('forms.hbs', {
// 		morris: true
// 	});
// });

// router.get('/panels-wells', (req, res) => {
// 	res.render('forms.hbs', {
// 		morris: true
// 	});
// });

// router.get('/buttons', (req, res) => {
// 	res.render('buttons.hbs', {
// 		morris: true
// 	});
// });

// router.get('/notifications', (req, res) => {
// 	res.render('notifications.hbs', {
// 		morris: true
// 	});
// });

// router.get('/typography', (req, res) => {
// 	res.render('typography.hbs', {
// 		morris: true
// 	});
// });

// router.get('/icons', (req, res) => {
// 	res.render('icons.hbs', {
// 		morris: true
// 	});
// });

// router.get('/grid', (req, res) => {
// 	res.render('grid.hbs', {
// 		morris: true
// 	});
// });

// router.get('/blank', (req, res) => {
// 	res.render('blank.hbs', {
// 		morris: true
// 	});
// });

// router.get('/login', (req, res) => {
// 	res.render('login.hbs', {
// 		morris: true
// 	});
// });

module.exports = router;