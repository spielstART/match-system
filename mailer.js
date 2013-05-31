var nodemailer = require("nodemailer");


function sendMail (usermail, mailbody) {

	var smtpTransport = nodemailer.createTransport('SMTP', {
		service: 'Gmail',
		auth: {
						user: 'matchbracket@gmail.com',
						pass: 'bracketmatch'
					}
	});

	var mailOptions = {
		from: 'MatchSystem <matchbracket@gmail.com>',
		to: usermail,
		subject: 'register@MatchSystem',
		text:	mailbody,
		html: mailbody
	};

	smtpTransport.sendMail(mailOptions, function(err, res){
		if (err)
			console.log(err);
		else
			console.log("Message sent: " + res.message);
	});
}

exports.sendMail = sendMail;