Contact form + mailer for Meteor
===============

__NO LONGER MAINTAINED__

This module will install a link at the bottom of your page. When the user clicks the link, the contact form will slide up from the bottom. See demo at http://contact-demo.meteor.com/

Simply 3 fields for subject, email and content.

![Screenshot](https://github.com/udondan/meteor-contact/raw/master/docs/screenshot.png)

All form elements are styled via [Bootstrap 3](http://getbootstrap.com/).

If you use [trail](https://atmospherejs.com/package/trail) it will be used for logging. Otherwise all messages will be simply `console.log`´ed.

Mails are sent from server. Of course recipient email addresses and any transport options such as mail server or password are never exposed to the client.

##Status
Tested on:
 - **OS X**
     - **Chrome** 36.0
     - **Firefox** 29.0.1
     - **Safari** 7.0.4
 - **iOS**
     - **Chrome** 35.0
     - **Safari** (Current version as of May 31, 2014 - Not possible to see any version information...)
     - **Opera Mini** 7.0.5 (Glyphicon of demo is invisible, but that's not a problem with this package)
     - **Opera Coast** 3.0.2
 - **Windows 7**
     - **Internet Explorer** 9.0 (no button animation)
     - **Safari** 5.1.7

Due to lack of a newer Windows machine not yet tested on IE 9+ or other Win browsers. You're welcome to test and send feedback or pull requests.

##Installation
```
mrt add contact
```

`less` is required. If you haven't added it yet, run
```
mrt add less
```

##Usage
This module uses configuration form your [Meteor.settings](http://docs.meteor.com/#meteor_settings):

```
{
...
  "contact": {
    "email": {
      "to": "<YOUR RECIPIENT ADDDRESS>",
      "type": "SMTP",
      "options": {
        "service": "Gmail",
        "auth": {
          "user": "<MAIL ACCOUNT TO SEND FROM>",
          "pass": "<PASSWORD>"
        }
      }
    }
  },
...
}
```
For sending mails I use [Nodemailer](http://www.nodemailer.com/). Please see the [Transports section](http://www.nodemailer.com/docs/transports) for all available options like [SMTP](http://www.nodemailer.com/docs/smtp), [Sendmail](http://www.nodemailer.com/docs/sendmail), [Amazon SES](http://www.nodemailer.com/docs/ses), [Direct](http://www.nodemailer.com/docs/direct) and [Pickup](http://www.nodemailer.com/docs/pickup).

The `options` object from the settings will be passed to the `createTransport` method of Nodemailer. So you're free to configure what you need.


To place the link, simply add this to your template:
```
{{> contact title='Contact'}}
```

The `title` parameter can contain whatever you like. You can place a [Glyphicon](http://getbootstrap.com/components/#glyphicons) from Bootstrap there as well:
```
{{> contact title='<i class="glyphicon glyphicon-envelope"></i>'}}
```

The link is positioned absolute at the bottom center of your page. Make sure surrounding HTML/CSS has no conflicting definitions or override the [CSS/LESS definitions](https://github.com/udondan/meteor-contact/blob/master/lib/contact.less) to fit your needs.

If the textarea is too small for your needs you can adjust the height. The form height is flexible and will grow with the textarea. 
```css
#contact form textarea {
  height: 400px;
}
```
Maybe consider working with media queries or you end up having too big forms for mobile devices.

##Todo:
 - Option to change all text elements via settings:
     - Error/success messages
     - Button text
     - Form labels
 - Client side form validation, to prevent roundtrip to server, just to find out form is empty

###License
[MIT](https://github.com/udondan/meteor-contact/blob/master/LICENSE)
