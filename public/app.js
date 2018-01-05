
var appId = document.querySelector('#signupButton').getAttribute('data-appId');
var civicSip = new civic.sip({ appId: appId });

var button = document.querySelector('#signupButton');
button.addEventListener('click', function () {
    civicSip.signup({ style: 'popup', scopeRequest: civicSip.ScopeRequests.BASIC_SIGNUP });
});

civicSip.on('auth-code-received', function (event) {
    var jwtToken = event.response;
    window.location = '/exchange-code?token=' + jwtToken
});