Template.contact.rendered = function() {
  // we need to clone the submit button, in order to fix it's width.
  // on submit we want to replace the content. since the width is not fixed, that would look ugly as the width would change
  // as the submit button is hidden on load JS can't fetch its width.
  // we clone it to a hidden location, read the width of the clone, set it to the button and then remove the clone from the DOM
  var button = $("#contact form button[type=submit]");
  var buttonClone = button.clone().css("margin-left", "-10000px");
  buttonClone.appendTo("body");
  button.css("width", buttonClone.outerWidth());
  button.css("height", buttonClone.outerHeight());
  buttonClone.remove();
}

// Hide or show form
var toggleForm = function(onComplete) {
  $("#contact a").slideToggle();
  $("#contact form").slideToggle(function() {
    resetForm();
    if($("#contact form").is(":visible")) { // Scroll to top of form. This is specifically for mobile clients as the form most probably is higher than the viewport
      document.getElementById("contact").scrollIntoView(true);
    }
    if(typeof onComplete === "function") {
      onComplete();
    }
  });
}

// Enable all form elements and show submit button
var resetForm = function() {
  $("#contact form button[type=submit], #contact form input, #contact form textarea").prop("disabled", false);
  $("#contact form button[type=submit] span").css("display", "block");
  $("#contact form button[type=submit] i").css("display", "none");
  $("#contact *").css("cursor", "default");
}

// clear the content from all form elements
var clearForm = function() {
  $("#contact form input[type=text], #contact form input[type=email], #contact form textarea").val("");
}

Template.contact.events({
  
  // Show form on click
  "click #contact>a": function() {
    toggleForm();
    $("#contact-subject").focus();
  },
  
  // Hide form on cancel
  "click #contact form button[type=button]": toggleForm,
  
  // Form submit handler
  "submit #contact form": function() {
    
    // Disable form elements to prevent submitting again and show loading icon
    $("#contact form button[type=submit], #contact form input, #contact form textarea").prop("disabled", true);
    $("#contact form button[type=submit] span").css("display", "none");
    $("#contact form button[type=submit] i").css("display", "block");
    $("#contact *").css("cursor", "wait");
    
    // Send mail on server
    Meteor.call("contact", {
      subject: $("#contact-subject").val(),
      from:    $("#contact-from").val(),
      body:    $("#contact-body").val()
    }, function(err, result) {
      if(err == null && result === true) { // Success
        $("#contact .modal-title").text("Thank you");
        $("#contact .modal-body").text("Your email was sent.");
        if($("#contact form").is(":visible")) { // Hide form if visible
          toggleForm(clearForm);
        }
        else {
          clearForm();
        }
      } else { // Failure
        $("#contact .modal-title").text("Failure");
        resetForm(); // Enable form elements
        switch(result) {
          case -1: // Invalid email
            $("#contact .modal-body").text("This is no valid email address.");
            break;
          case -2: // No subject
            $("#contact .modal-body").text("Please enter a subject for your message.");
            break;
          case -3: // No mail body
            $("#contact .modal-body").text("Please enter a message.");
            break;
          default: // Some mail server problem or whatever. The user doesn't care about the details.
            $("#contact .modal-body").text("Mail could not be sent. Please try again later.");
            break;
        }
      }
      $("#contact .modal").modal(); // Show response, which is either success or failure
    });
    return false; // Do not submit the form
  }
});
