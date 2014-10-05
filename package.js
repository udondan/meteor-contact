Package.describe({
  summary: "Contact form + mailer",
  version: "0.4.0",
  git: "https://github.com/udondan/meteor-contact.git",
});

Package.on_use(function(api, where){
  api.versionsFrom("METEOR@0.9.0");
  api.use(["less", "templating", "simison:bootstrap3-less@0.3.0"], "client");
  api.use("mrt:meteor-nodemailer@0.2.0", "server");
  api.use("mrt:trail@0.1.2", ["client", "server"], {weak: true});
  api.add_files(["lib/contact.html", "lib/contact.js", "lib/contact.less"], "client");
  api.add_files("lib/mailer.js", "server");
});
