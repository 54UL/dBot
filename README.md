# ms-node-sms
Micro servicio para el envió de SMS

DB de prueba MongoDB Atlas:
Link: https://account.mongodb.com/account/login
Hospedaje en Heroku:

certbot-auto certonly --standalone -d apiv1.sms.urbanissa.net --pre-hook 'service nginx stop' --post-hook 'service nginx start'

apiv1.users.urbanissa.net.	14400	IN	A	
201.163.73.130