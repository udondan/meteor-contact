Package.describe({
  summary: "Contact form + mailer",
  version: "0.4.0",
  git: "https://github.com/udondan/meteor-contact.git",
});

Package.on_use(function(api, where){
  api.versionsFrom("METEOR@0.9.0");
  api.use(["less", "templating", "simison:bootstrap3-less"], "client");
  api.use("mrt:meteor-nodemailer", "server");
  api.use("mrt:trail", ["client", "server"], {weak: true});
  api.add_files(["lib/contact.html", "lib/contact.js", "lib/contact.less"], "client");
  api.add_files("lib/mailer.js", "server");
});
