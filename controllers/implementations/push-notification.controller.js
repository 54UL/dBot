const { Promise } = require('mongoose');
const { google } = require('googleapis');

const pushToken = require('../../models/push-token');
const { FcmNotificationPayLoad } = require('../models/notification-payload');
const { ApiResponse } = require('../../foundation/models/api-response');

const axios = require('axios').create({
    baseURL: process.env.FIREBASE_PUSH_NOTIFICATION_ENDPOINT
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

class PushNotificationController {

    constructor(ctx) {
        this.logger = ctx.dependency.get("Logger");
        this.db = ctx.dependency.get("DataBase");
        this.rest = ctx.dependency.get("Rest");
        this.kafka = ctx.dependency.get("Kafka");

        //Kafka routes
        this.kafka.messagePattern("notification", "send_push_notification", this.SendPush.bind(this));
        //Rest routes
        this.rest.setBasePath("/PushNotification");
        this.rest.addRoute("post", "", false, this.SendPushRest.bind(this), [])
        this.rest.addRoute("post", "/AddToken", true, this.AddPushTokenRest.bind(this), [])
        this.rest.addRoute("delete", "/RemoveToken", true, this.RemovePushTokenRest.bind(this), [])

        //FMC Bearer token
        this.getAccessToken().then((val) => {
            this.google_access_token = val.replace(/\.+$/, '');;
        }).catch((err) => {
            this.logger.fatal(err);
        });

        this.logger.info("PUSH NOTIFICATION CONTROLLER READY");
    }

    dispose() {

    }

    getAccessToken() {
        return new Promise(function (resolve, reject) {
            const key = require('../../service-account.json');
            const jwtClient = new google.auth.JWT(
                key.client_email,
                null,
                key.private_key,
                ['https://www.googleapis.com/auth/firebase.messaging'],
                null
            );
            jwtClient.authorize(function (err, tokens) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(tokens.access_token);
            });
        });
    }

    async AddPushToken(payload) {
        const userId = payload.user._id;
        const { token } = payload;

        if (token === '' && userId == null) {
            return new ApiResponse(400, "message,title or user id missing in request body");
        }

        try {
            let findedPushToken = await pushToken.find({
                pushToken: token
            });

            if (findedPushToken.length > 0) return { status: 200, msg: "push token already exists" };

            await pushToken.create({
                pushToken: token, userId
            });
            return new ApiResponse(200, "push token added...");
        } catch (error) {
            return new ApiResponse(400, error);
        }
    }

    async AddPushTokenRest(req, res, next) {
        req.body.user = req.user;
        let response = await this.AddPushToken(req.body);
        res.status(response.status).json({ msg: response.msg });
    }

    async RemovePushToken(payload) {
        const { token } = payload;

        if (token === '') {
            return new ApiResponse(400, "invalid token");
        }
        try {
            await pushToken.findOneAndRemove({
                pushToken: token
            });
            return new ApiResponse(200, "push token removed...");
        } catch (error) {
            return new ApiResponse(400, error);
        }
    }

    async RemovePushTokenRest(req, res, next) {
        let response = await this.RemovePushToken(req.body);
        res.status(response.status).json({ msg: response.msg });
    }

    async SendPush(payload) {
        const { message, title, image = '', userId, nav = '/', navPayLoad = '{}' } = payload;

        if (message === '' && title === '' && userId === '') {
            return new ApiResponse(400, "message,title or user id missing in request body");
        }

        let requestOptions = {
            headers: {
                'Authorization': `Bearer ${this.google_access_token}`,
                'Content-Type': 'application/json;',
            }
        };

        const userTokens = await pushToken.find({ userId: userId });
        try {
            let promiseArray = [];
            userTokens.forEach(async (token) => {
                const notificationObj = new FcmNotificationPayLoad(token.pushToken, title, message, image, nav, navPayLoad);
                promiseArray.push(axios.post('/messages:send', notificationObj, requestOptions));
            });
            let responses = await Promise.all(promiseArray);
            return new ApiResponse(200, "push notifications sended....");
        } catch (error) {
            return new ApiResponse(error.response.status, error.response.data);
        }
    }

    async SendPushRest(req, res, next) {
        let response = await this.SendPush(req.body);
        response = await this.RetryIfFailed(response, this.SendPush.bind(this), req.body);
        res.status(response.status).json({ msg: response.msg });
    }

    async RetryIfFailed(response, handler, args) {
        switch (response.status) {
            case 401:
                //get auth token  
                let fetchedToken = await this.getAccessToken();
                this.google_access_token = fetchedToken.replace(/\.+$/, '');
                return await handler(args);
            default:
                return response;
        }
    }
}

module.exports = { PushNotificationController };
