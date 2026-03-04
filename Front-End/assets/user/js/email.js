/* EmailJS SDK */
(() => { "use strict"; var e = { d: (t, r) => { for (var i in r) e.o(r, i) && !e.o(t, i) && Object.defineProperty(t, i, { enumerable: !0, get: r[i] }) }, o: (e, t) => Object.prototype.hasOwnProperty.call(e, t), r: e => { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 }) } }, t = {}; e.r(t), e.d(t, { default: () => l, init: () => i, send: () => a, sendForm: () => d }); const r = { _origin: "https://api.emailjs.com" }, i = function (e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "https://api.emailjs.com"; r._userID = e, r._origin = t }, s = (e, t, r) => { if (!e) throw "The public key is required. Visit https://dashboard.emailjs.com/admin/account"; if (!t) throw "The service ID is required. Visit https://dashboard.emailjs.com/admin"; if (!r) throw "The template ID is required. Visit https://dashboard.emailjs.com/admin/templates"; return !0 }; class o { constructor(e) { this.status = e ? e.status : 0, this.text = e ? e.responseText : "Network Error" } } const n = function (e, t) { let i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}; return new Promise(((s, n) => { const a = new XMLHttpRequest; a.addEventListener("load", (e => { let { target: t } = e; const r = new o(t); 200 === r.status || "OK" === r.text ? s(r) : n(r) })), a.addEventListener("error", (e => { let { target: t } = e; n(new o(t)) })), a.open("POST", r._origin + e, !0), Object.keys(i).forEach((e => { a.setRequestHeader(e, i[e]) })), a.send(t) })) }, a = (e, t, i, o) => { const a = o || r._userID; s(a, e, t); const d = { lib_version: "3.12.1", user_id: a, service_id: e, template_id: t, template_params: i }; return n("/api/v1.0/email/send", JSON.stringify(d), { "Content-type": "application/json" }) }, d = (e, t, i, o) => { const a = o || r._userID, d = (e => { let t; if (t = "string" == typeof e ? document.querySelector(e) : e, !t || "FORM" !== t.nodeName) throw "The 3rd parameter is expected to be the HTML form element or the style selector of form"; return t })(i); s(a, e, t); const l = new FormData(d); return l.append("lib_version", "3.12.1"), l.append("service_id", e), l.append("template_id", t), l.append("user_id", a), n("/api/v1.0/email/send-form", l) }, l = { init: i, send: a, sendForm: d }; self.emailjs = t })();

(function () {
    // Initialize EmailJS with Public Key
    // Replace 'YOUR_PUBLIC_KEY' with the key from EmailJS Account > API Keys
    emailjs.init("YOUR_PUBLIC_KEY");

    document.getElementById('contact-submit-btn').addEventListener('click', function (event) {
        event.preventDefault();

        // Collect form data from the input fields
        var templateParams = {
            title: document.getElementById('contact-title').value,
            first_name: document.getElementById('contact-first-name').value,
            last_name: document.getElementById('contact-last-name').value,
            email: document.getElementById('contact-email').value,
            country: document.getElementById('contact-country').value,
            message: document.getElementById('contact-message').value
        };

        // Basic validation to ensure required fields are not empty
        if (!templateParams.first_name || !templateParams.email || !templateParams.message) {
            alert('Please fill in all required fields (First Name, Email, Message).');
            return;
        }

        // Send email using EmailJS
        // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with IDs from the EmailJS dashboard
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Message sent successfully!');
                
                // Clear form fields after successful submission
                document.getElementById('contact-first-name').value = '';
                document.getElementById('contact-last-name').value = '';
                document.getElementById('contact-email').value = '';
                document.getElementById('contact-message').value = '';
            }, function (error) {
                console.log('FAILED...', error);
                alert('Failed to send message. Please try again later. Error: ' + JSON.stringify(error));
            });
    });
})();
