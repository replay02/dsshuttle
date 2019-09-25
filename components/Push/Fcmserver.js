var FCM = require('fcm-node');
var serverKey = 'AAAAL5ktxjw:APA91bHFtNkZ8fEd63R2lNMYyjO7MdVN8twORNgb8kNI1SaooIWlSGXuwq2Rhmvwfbe-NKMdYHrv3b_0-U3eTmy1icmDmKozY440d4gao8ElAKvp6R5-G2BnQD3aybE7yPtMwT1cqBrv'; //put your server key here
var fcm = new FCM(serverKey);

// var client_token = 'dfip14KVzaU:APA91bFC1CLQ1yu-8pEMDDTYS3v9Cge2cNCWMdepEAKgzxhez0_YyHakoj7cGL5xMakJAgO1FKn5CnbIsgzkjkKn1Q54zZ1JPygXqOg_GOfhpcpXXiypBNifqGa_myLTZquWa5IodJ8K';
var client_token = 'cEi40TSrPnw:APA91bGJAL5HGcYFzRtOc_GI4RoPJNlPM5UFZoQW0XpxiEy0_YipVl8-4iNunYEEuv8g_B1zktUeXzjhJRo1qkKc5Q0Qqd7abPNR0bPq8nKlR5SCyz1WdK1nTYmYX3dUGEHyJPQkSqRr';


var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: client_token, //안드로이드 단말에서 추출한 token값

    notification: {
        title: 'Hello dsshuttle', 
        body: 'dsshuttle Push 메시지입니다.',
        sound: "default",
        click_action: "FCM_PLUGIN_ACTIVITY",
        icon: "fcm_push_icon"
    },
    priority:"high",
    // App 패키지 이름
    restricted_package_name: "com.dsshuttle",
    //App에게 전달할 데이터
    data: {  //you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value'
    }
};

fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log('Push메시지 발송!');
        console.log("Successfully sent with response: ", response);
    }
}); 