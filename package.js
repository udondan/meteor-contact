Package.describe({
  summary: "Contact form + mailer",
});

Package.on_use(function(api, where){
  api.use(["less", "templating", "bootstrap3-less"], "client");
  api.use("meteor-nodemailer", "server");
  api.add_files(["lib/contact.html", "lib/contact.js", "lib/contact.less"], "client");
  api.add_files("lib/mailer.js", "server");
});
