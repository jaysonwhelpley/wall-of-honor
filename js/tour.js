

  const speed = 500
  var mis_json = {}
  localStorage.section = 'home'
  var muted = false

  audio_bed = new Howl({
    src: ['audio/beds/bed1.mp3']
  });

  mis_container_ids = []
  mir_container_ids = []

  reload_taps = 0

  function reload_tap_count() {
    reload_taps++
    console.log(reload_taps);

    if (reload_taps >= 8) {
      location.reload(true)
    }
  }


  function render_menu() {

    let data = {}

    let template = $('#menuTemplate').html()
    let html = Mustache.render(template,data)
    console.log(template);
    $('.container').not('#index').append(html)

    $(".menu .floating-menu .menu_button, .menu .floating-menu .next_button, .menu .floating-menu .back_button, .detail_mir:last .next_button, .detail_mir:first .back_button, .detail_mis:last .next_button, .detail_mis:first .back_button, .menu .floating-menu .play_pause_button, .menu .floating-menu .restart_button").addClass("inactive")

    console.log('render_menu');

    }

  function  play_css() {
    $('body').addClass('playing').removeClass('paused')
  }

  function pause_css() {
    $('body').addClass('paused').removeClass('playing')
  }


  function missionaryAudioAndScroll(slug) {
      let duration = eval(slug+"_audio.duration()")*1000
      console.log(duration)

      audio_bed.seek(0).volume(1).play()
      eval(slug+"_audio.seek(0).volume(1).play()")

      play_css()

      console.log('missionaryAudioAndScroll');
  }

  function kill_orphans() {
    $('p').each(function() {
      var w = this.textContent.split(" ");
      if (w.length > 1) {
        w[w.length - 2] += "&nbsp;" + w[w.length - 1];
        w.pop();
        this.innerHTML = (w.join(" "));
      }
    });
    console.log('all the orphans have been killed');
  }

  function get_container_slug() {
    console.log($('.container:visible').attr('id'));
    slug = $('.container:visible').attr('id')
  }

  function populate_ids_for_previous_and_next_nav() {
    $('.detail_mis').each(function(){
      mis_container_ids.push($(this).attr('id'))
    });
    $('.detail_mir').each(function(){
      mir_container_ids.push($(this).attr('id'))
    })
  }


  $(document).ready(function() {

    // Trasnform Loader
    svg_width = $('#loader #mount-jaysonwhelpley-GradientStrokeEminate').width()
    screen_width = screen.availWidth
    transform_scale = screen_width/svg_width
    $('#loader #mount-jaysonwhelpley-GradientStrokeEminate').css('transform','scale(0.3').css('transform-origin','0% 0% 0px')
    $('#loader').fadeIn(500);

    $(function() {

      var misJSON = "js/mis.json"

      $.getJSON(misJSON, function(data){

        console.log(data)
        mis_json = data

        let template = $('#missionary-menu-template').html()
        let html = Mustache.render(template,data)
        $('body').append(html);

        template = $('#misTemplate').html()
        html = Mustache.render(template,data)
        $('body').append(html);

        $('.mis_link').each(function() {
          let slug = $(this).attr('id').split('_link').join('')

          eval(slug+"_audio= new Howl({src:['audio/stories/"+slug+".mp3'],onend: function(){setTimeout(audio_bed.fade(1.0,0.0,6000),3000);}})")

        });

        console.log('missionaries');

      });

      var mirJSON = "js/mir.json"

      $.getJSON(mirJSON, function(data){

        console.log(data)
        mir_json = data

        let template = $('#miracles-menu-template').html()
        let html = Mustache.render(template,data)
        $('body').append(html);

        template = $('#mirTemplate').html()
        html = Mustache.render(template,data)
        $('body').append(html);

        $('.mir_link').each(function() {
          let slug = $(this).attr('id').split('_link').join('')

          eval(slug+"_audio= new Howl({src:['audio/stories/"+slug+".mp3'],onend: function(){setTimeout(audio_bed.fade(1.0,0.0,6000),3000);}})")
        });

        // mir_audio = new Howl({
        //   src: mir_stories
        // });

        console.log('miracles');

      populate_ids_for_previous_and_next_nav()
      render_menu()
      kill_orphans()
      $('#loader').fadeOut(speed*2, function() {
        $('#overlay').fadeOut(speed*2, function() {
          $("#index").fadeIn(speed*3, function() {
            // $('body').css({'padding-top':'80vh', 'padding-bottom':'80vh'})
          });
        });
      });

      });

    });

    $('body').on('click', '#reload', function(event) {
      reload_tap_count()
    });

    $('body').on('click', '.mute_button', function(event) {
      if (muted==false) {
        muted = true
        Howler.mute(true)
        $('body').addClass('muted').removeClass('unmuted')
      } else {
        muted = false
        get_container_slug()
        if ( slug != "missionaries" && slug != "miracles" && slug != "home"  ) {
          Howler.mute(false)
          eval(slug+"_audio.volume(1)")
          audio_bed.volume(1)
        }
        $('body').removeClass('muted').addClass('unmuted')
      }
      console.log(muted)
    });

    $('body.unmuted').on('click', '.detail .play_pause_button', function(event) {
      console.log("Playing/Pausing")
      get_container_slug()
      if (eval(slug+"_audio.playing()")) {
        eval(slug+"_audio.pause()")
        audio_bed.pause()
        pause_css()
        console.log("PAUSING IT.");
      } else {
        if (eval(slug+"_audio.seek()") > 2) {
          eval(slug+"_audio.volume(1).play()")
          audio_bed.volume(1).play()
          console.log("PLAYING FROM MIDDLE");
          play_css()
        } else {
          eval(slug+"_audio.volume(1).seek(0).play()")
          audio_bed.volume(1).seek(0).play()
          console.log("PLAYING FROM START");
          play_css()
        }
      }
    });

    $('body.unmuted').on('click', '.detail .restart_button', function(event) {
      get_container_slug()
      if(eval(slug+"_audio.playing()")) {
        Howler.stop()
      }
        eval(slug+"_audio.volume(1).seek(0).play()")
        audio_bed.volume(1).seek(0).play()
    });

    $('.home_button').click(function(event) {
      $('.container').fadeOut('slow/400/fast', function() {
        goto_home()
        pause_css()
      });
    });

    // Fade in Missionaries

    function missionaries_in() {
      $("#missionaries").fadeIn(speed)
      $('html,body').animate({scrollTop: $("#missionaries").offset().top},speed*2)
      localStorage.section = 'missionaries'
    }

    // Fade in Miracles

    function miracles_in() {
      $("#miracles").fadeIn(speed)
      $('html,body').animate({scrollTop: $("#miracles").offset().top},speed*2);
      localStorage.section = 'miracles'
    }

    // Fade out Index

    function index_out() {
      $('#index').fadeOut(speed);
    }

    // Click Missionaries Button

    $("#missionaries_button").click(function(event) {
      $('#index').fadeOut(speed, function() {
        missionaries_in()
      });
    });

    // Click miracles button

    $('#miracles_button').click(function(event) {
      $('#index').fadeOut(speed, function() {
        miracles_in()
      });
    });

    // Specific Missionary Button

    $('body').on('click', '.mis_link', function(event) {
      let slug = $(this).attr('id').split('_link').join('');
      console.log(slug)
      console.log($(`#${slug}`).attr("id"))
      $(missionaries).fadeOut(speed, function() {
        $("#"+slug).fadeIn(speed)
        $('html,body').animate({scrollTop: $('#'+slug).offset().top},speed*2,function() {
        });
        if (muted==false) {
          missionaryAudioAndScroll(slug)
        }
      });
    });

    $('body').on('click', '.mir_link', function(event) {
      let slug = $(this).attr('id').split('_link').join('');
      console.log(slug)
      console.log($(`#${slug}`).attr("id"))
      $(miracles).fadeOut(speed, function() {
        $("#"+slug).fadeIn(speed)
        $('html,body').animate({scrollTop: $('#'+slug).offset().top},speed*2,function() {
        if (muted==false) {
          missionaryAudioAndScroll(slug)
        }
        });
      });
    });


    $('body').on('click','.detail .next_button:not(".inactive")', function() {
      $(this).parents('.container').fadeOut(speed, function() {
        Howler.stop()
        pause_css()
        $(this).next().fadeIn(speed, function() {
          get_container_slug()
          if (muted==false) {
            missionaryAudioAndScroll(slug)
          }
        });
      });
    })

    $('body').on('click','.detail .previous_button:not(".inactive")', function() {
      $(this).parents('.container').fadeOut(speed, function() {
        Howler.stop()
        pause_css()
        $(this).prev().fadeIn(speed, function() {
          get_container_slug()
          if (muted==false) {
            missionaryAudioAndScroll(slug)
          }
        });
      });
    })

    // Menu Click

    $('body').on('click', '.detail .menu_button', function(event) {
      let destination = localStorage.section
      Howler.stop()
      $(this).parents('.container').fadeOut(speed*1,function(){
        $(`#${destination}`).fadeIn(speed, function() {
        });
      });
    })

    // Home click

    $('body').on('click', '.home_button', function(event) {
      Howler.stop()
      $(this).parents('.container').fadeOut(speed*1,function(){
        $(`#index`).fadeIn(speed, function() {
        });
      });
      localStorage.section = "home"
    })


  });
