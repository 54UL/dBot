

class FcmNotificationPayLoad {
    constructor(token, title, message, image, nav, navPayLoad) {
        this.message = {
            "token": token,
            "notification": {
                "title": title,
                "body": message,
                "image": image
            },
            "data": {
                "nav": nav,
                "navPayLoad": navPayLoad
            }
        }
    }
}

module.exports = { FcmNotificationPayLoad };
