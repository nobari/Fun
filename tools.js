
$(window).on('load', function () {
    var wow = new WOW({
        //disabled for mobile
        // mobile: false
    });
    wow.init();
});
const timeout = (ms) => new Promise((res) => setTimeout(res, ms));
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
const shuffle2 = array => array.sort(function (_, __) { return 0.5 - Math.random() })
// show notification popup
function showNotification(msg, type, reloadPage, redirect, time = 2000) {
    // defaults to false
    reloadPage = reloadPage || false;

    // defaults to null
    redirect = redirect || null;

    $('#notify_message').html(msg);
    if ($('#notify_message').hasClass("presenting")) return;
    console.log("show notif:", $('#notify_message').hasClass("presenting"))
    $('#notify_message').removeClass();
    $('#notify_message').addClass('alert-' + type);
    $('#notify_message').addClass("presenting");
    $('#notify_message')
        .slideDown(300)
        .delay(time)
        .slideUp(300, function () {
            $('#notify_message').removeClass("presenting");
            if (redirect) {
                window.location = redirect;
            }
            if (reloadPage === true) {
                location.reload();
            }
        });
}
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    var successful;
    try {
        successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
    return !!successful;
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        const res = fallbackCopyTextToClipboard(text);
        if (res) showNotification(`COPPIED`, 'success');
        else showNotification(`ERROR`, 'danger');
        return res;
    }
    return navigator.clipboard.writeText(text).then(
        function () {
            console.log('Async: Copying to clipboard was successful!');
            showNotification(`COPPIED`, 'success');
        },
        function (err) {
            console.error('Async: Could not copy text: ', err);
            showNotification(`ERROR`, 'danger');
        },
    );
}
const addScript = (
    url,
    place = document.head,
    options
) => {
    return new Promise((resolve) => {
        const sc = document.querySelector(`script[src="${url}"][data-loaded=""]`);
        if (sc) return resolve(sc);
        const script = document.createElement("script");
        if (options) {
            if (options.noModule) script.noModule = true;
            if (options.async) script.async = true;
        }
        function loader() {
            this.removeEventListener("load", loader);
            script.setAttribute("data-loaded", "");
            resolve(script);
        }
        place.appendChild(script);
        script.addEventListener("load", loader);
        script.src = url;
        // script.async = true;
    });
};
const remScript = (url) => {
    if (!url) return;
    const scs = document.querySelectorAll(`script[src="${url}"]`);
    scs?.forEach((sc) => sc.remove());
    if (url.includes("recaptcha")) {
        const badge = document.querySelector(".grecaptcha-badge");
        if (badge) badge.remove();
    }
};
const captchaKey = '6LdXJAIaAAAAANP-TTf1rV58RX4pE_2SALEeMFZf';
const captchaURL = 'https://www.google.com/recaptcha/api.js?hl=fa&&render=' + captchaKey;
const getCaptcha = () =>
    new Promise((r) => {
        grecaptcha.ready(function () {
            grecaptcha.execute(captchaKey, { action: 'submit' }).then((t) => r(t));
        });
    });