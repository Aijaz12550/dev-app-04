const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
var nodemailer = require('nodemailer');
const ejs = require('ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.set('view engine', 'ejs');

app.post('/randomCode', (req, res) => {
	console.log('req.body', req.body)
	// const accountSid = 'ACb63157e4c698f573fc96487cc2c9194f';
	// const accountSid = 'AC8a4cfc14ce301d9eb5dd6eb25fba0276';//latest
	const accountSid = req.body.userSid;//latest
	// const accountSid = 'ACfdaadcdbd126c82be496a83ae20b78af';//test accountSid
	// const authToken = 'df2e122e38e473fccbd8430d2c14b3a0';
	// const authToken = '296e9c31c5adcbbdf89b883eda9c8e78';//latest
	const authToken = req.body.userAuthToken;//latest
	// const authToken = '0f33c9248f6b799a2560d8078ba53045';//test authToken
	const client = require('twilio')(accountSid, authToken);
	let msg = req.body.msg;
	let contact = req.body.contact
	if (contact) {
		client.messages
			.create({
				body: msg,
				from: '+18704844740',
				to: contact,
			})
			.then(message => {
				console.log(message.sid)
				return message.sid
			}).catch(err => {
				console.log(err)
				return err
			})
	}
});

app.post("/balance", (req, res) => {
	// const accountSid = 'AC8a4cfc14ce301d9eb5dd6eb25fba0276';
	// const authToken = '296e9c31c5adcbbdf89b883eda9c8e78';
	console.log(req.body.userSid)
	console.log(req.body.userAuthToken)
	const accountSid = req.body.userSid;
	const authToken = req.body.userAuthToken;
	const client = require('twilio')(accountSid, authToken);
	client.balance.fetch()
		.then(response => res.send(response))
		.catch(err => res.send(err))
})

app.post('/exportTabel', (req, res) => {
	debugger
	let student = req.body.student;
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'safetoschoolsfb@gmail.com',
			pass: 'Sts#2020Sts',
		},
	});

	res.render('table', { student }, (err, data) => {
		if (err) {
			console.log(err);
		}
		let mailOptions = {
			from: 'safetoschoolsfb@gmail.com', // sender address
			to: req.body.email, // list of receivers
			subject: 'Student Alert', // Subject line
			text: 'This is the eamil from safetoschools', // plain text body
			html: data, // html body
		};
		let info = transporter
			.sendMail(mailOptions)
			.then((res) => {
				console.log(res, 'this is response');
				res.send(res.response);
			})
			.catch(errr => {
				console.log(errr, 'this is error');
				res.send(errr) 
			});
	});
});

app.post('/emailapi', (req, res) => {
	console.log(req.body);
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'safetoschoolsfb@gmail.com',
			pass: 'Sts#2020Sts',
		},
	});

	let data = req.body;
	data.map((text, index) => {
		console.log(text);
		if (text.absent === true) {
			console.log('absent');

			let mailOptions = {
				from: 'safetoschoolsfb@gmail.com', // sender address
				to: text.email, // list of receivers
				subject: 'Student Alert', // Subject line
				text: 'This is the eamil from safetoschools', // plain text body
				html: `<b>This is inform you that ${text.name} is absent today </b>`, // html body
			};
			let info = transporter
				.sendMail(mailOptions)
				.then((err, res) => {
					console.log(res, 'iuoeiwruoiw');
				})
				.catch(errr => {
					console.log(errr);
				});
		} else if (text.late === true) {
			console.log('late');
			let mailOptions = {
				from: 'safetoschoolsfb@gmail.com', // sender address
				to: text.email, // list of receivers
				subject: 'Student Alert', // Subject line
				text: 'This is the eamil from safetoschools', // plain text body
				html: `<b>This is inform you that ${text.firstname + ' ' + text.lastname} will late today </b>`, // html body
			};
			let info = transporter
				.sendMail(mailOptions)
				.then((err, res) => {
					console.log(res, 'iuoeiwruoiw');
				})
				.catch(errr => {
					console.log(errr);
				});
		}
	});
});


app.post('/sendShortMsg', (req, res) => {
	console.log(req.body);
	console.log(req.body.email);
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'safetoschoolsfb@gmail.com',
			pass: 'Sts#2020Sts',
		},
	});
	let data = req.body
	let mailOptions = {
		from: 'safetoschoolsfb@gmail.com', // sender address
		to: data.email, // receivers
		subject: 'Student Alert', // Subject line
		text: 'This is the email from a teacher of safetoschools', // plain text body
		html: `<b>${data.msg}</b><br/>${data.imgURL ? `<img src=${data.imgURL} alt="img" width="150px" height="150px"/>` : ''}`
	}
	let info = transporter.sendMail(mailOptions).then((err, res) => {
		console.log(res, 'res')
		res.send(res)
	}).catch(errr => {
		console.log(errr)
		res.send(errr.message)
	})
})




const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`server is running on port ${port}`);
});
