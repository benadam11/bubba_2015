/* Your scripts go here */


$('.intro').hide();

$(document).ready(function(){
    
  $('.hero').fadeIn("slow");

  setTimeout(function() {
    $('.intro').show().addClass('slideUp');
  }, 800);

  var sticky = new Waypoint.Sticky({
    element: $('.navigation')[0]
  })

  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });



  // Form
  var name, email, subject, message; 

  function getValues () {
    name = $('#contact-name').val();
    email = $('#contact-email').val();
    subject = $('#contact-subject').val();
    message = $('#contact-message').val()
    
    console.log(name,email,subject,message)
  }


  $('#submit-form').on('submit', function(e){
    e.preventDefault();
    getResponse();
  });

  function resetForm(){
    $('#submit-form')[0].reset();
  }

  // Form Ajax Request
  function getResponse(){

    getValues();

    $.ajax({
      type:"POST",
      url: "https://mandrillapp.com/api/1.0/messages/send.json" ,
      data:{
        'key':'rRlpJG5kZCxInUggWA8QWA',
        'message':{
          'from_email': email,
          'to': [
              {
                'email': 'benjamin.mark.adam@gmail.com',
                'name': 'Prosport Management',
                'type': 'to'
              }
            ],
          'autotext': 'true',
          'subject': subject,
          'html': '<p>Name: '+ name +
                    '<br>' + 'Email: ' + email + 
                    '<br>' + 'Message: ' + message +
                  '</p>'
        }
      },
      beforeSend: function (){

        $('#submit-button')
          .addClass('sending')
          .html('<i class="fa fa-circle-o-notch fa-spin"></i> Sending');
      },
      error: function (data) {
        
        $('#submit-button')
          .removeClass('sending')
          .addClass('error')
          .html('<i class="fa fa-times"></i> Try again.');

        $('.response-container').html('Looks like something went wrong. Click the reset button and try again.');

        $('#submit-button').on('click', function(e){
          e.preventDefault();
          resetForm();
          $('#submit-button').removeClass('error');
        });

      },
      success: function (data){
        //Send GA Converstion
        
        //Update Button
        $('#submit-button')
          .removeClass('sending')
          .addClass('sent')
          .html('<i class="fa fa-check"></i> Sent')
          .prop("disabled", true);
        //Add Success Message
        // $('.response-container').html('Thank you! We will contact you shortly with some more information about our programs.');
        resetForm();
      }
    });

  }

});