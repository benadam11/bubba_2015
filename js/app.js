/* Your scripts go here */

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: '2rtxQARw0wA',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  console.log('player is ready to roll')
}

var done = false;

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    done = true;
  }
}
function playVideo(){
  player.playVideo();
}
function stopVideo() {
  player.stopVideo();
}


$(document).ready(function(){
    
  $('.hero').fadeIn("slow");

  var sticky = new Waypoint.Sticky({
    element: $('.navigation')[0]
  });

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

/*
 * Modal Interaction 
 */

  $('#js-modal-trigger').on('click', function(e){
    e.preventDefault();
    $('.modal-bg').fadeIn();
    playVideo();
  });

  $('.close-button, .modal-bg').on('click', function(e){
    e.preventDefault();
    $('.modal-bg').fadeOut();
    stopVideo();
  });

  $('.playBtn').click(function(){
    return false;
  });


  // Form
  var name, email, subject, message; 

  function getValues () {
    name = $('#contact-name').val();
    email = $('#contact-email').val();
    subject = $('#contact-subject').val();
    message = $('#contact-message').val()

  }


  $('#submit-form').on('submit', function(e){
    e.preventDefault();
    getResponse();
  });

  function resetForm(){
    $('#submit-form')[0].reset();
    $('#submit-button').html('Send');
  }

  // Form Ajax Request
  function getResponse(){

    getValues();

    $.ajax({
      type:"POST",
      url: "https://mandrillapp.com/api/1.0/messages/send.json" ,
      data:{
        'key':'X06ENjpgtIkr-uA23gO6NA',
        'message':{
          'from_email': email,
          'to': [
              {
                'email': 'kf@prosportmanagement.com',
                'name': 'Prosport Management',
                'type': 'to'
              }
            ],
          'autotext': 'true',
          'subject': subject,
          'html': '<p>Name: ' + name +
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

        
        $('#submit-button').on('click', function(e){
          e.preventDefault();
          resetForm();
          $('#submit-button').removeClass('error');
        });

      },
      success: function (data){
        
        ga('send', 'event', 'form', 'success');
        
        //Update Button
        $('#submit-button')
          .removeClass('sending')
          .addClass('sent')
          .html('<i class="fa fa-check"></i> Sent')
          setTimeout(function() {
            resetForm();
          }, 1200);
        
      }
    });

  }

});