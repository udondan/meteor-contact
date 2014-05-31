Meteor.startup(function () {
  Meteor.methods({
    contact: function(data) {
      
      //Defining log method, Meteor.log may come from package "trail"
      this.log = function(level, event) {
        if(typeof event === "object") {
          event = JSON.stringify(event);
        }
        Meteor.log && typeof Meteor.log[level] === "function" ? Meteor.log[level](event) : console.log("[" + level.toUpperCase() + "] " + event);
      }
      
      // Regex for validating mail addresses
      // Regex taken from https://github.com/chriso/validator.js
      var email = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
      
      // Validating user data
      if(!data.subject.length) {
        return -2;
      }
      if(!email.test(data.from)) {
        return -1;
      }
      if(!data.body.length) {
        return -3;
      }
      
      // Generating the transport only once...
      // See http://www.nodemailer.com/docs/transports for transport details
      if(!Meteor.mailer) {
        
        // Getting type of transport from settings, defaults to "direct"
        var type = typeof Meteor.settings.contact !== "undefined" &&
                   typeof Meteor.settings.contact.email !== "undefined" &&
                   Meteor.settings.contact.email.type || "direct";
        
        // Getting email options from settings
        var options = typeof Meteor.settings.contact !== "undefined" &&
                      typeof Meteor.settings.contact.email !== "undefined" &&
                      Meteor.settings.contact.email.options || {};
        
        Meteor.mailer = Nodemailer.createTransport(type, options);
      }
      
      
      // Defining mail object
      mail = {};
      
      // Getting TO address from settings
      mail.to = typeof Meteor.settings.contact !== "undefined" &&
                typeof Meteor.settings.contact.email !== "undefined" &&
                Meteor.settings.contact.email.to || false;
      
      if(mail.to === false || mail.to === null || typeof mail.to === "undefined") {
        this.log("error", "No TO address in settings!");
        return false;
      } else if(!email.test(mail.to)) {
        this.log("error", "Given TO address is invalid!");
        return false;
      }
      
      mail.replyTo = data.from;
      mail.subject = data.subject;
      mail.text    = data.body;
      
      this.unblock(); // Sending mail can take a while, unblock so the client can do something else meanwhile
      this.log("debug", "Sending email...");
      syncFunc = Meteor._wrapAsync(Meteor.mailer.sendMail);
      try {
        res = syncFunc(mail);
      }
      catch(e) {
        this.log("error", e);
      }
      
      if(typeof res !== "undefined") {
        this.log("info", res);
        return true;
      } else {
        return false;
      }
      
    }
  });
});
