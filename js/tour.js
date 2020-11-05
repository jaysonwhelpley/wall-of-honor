

  const speed = 500
  var mis_json = {}
  localStorage.section = 'index'
  var muted = false
  var duration
  var progress
  var slug
  var scroll_progress
  var which_image
  var being_replaced

  audio_bed = new Howl({
    src: ['audio/beds/bed1.mp3']
  });

  mis_container_ids = []
  mir_container_ids = []

  reload_taps = 0

  var bgs = []

  function loadBGs() {
    let   fileExt = [".png", ".jpg", ".gif"]
    $.ajax({
      //This will retrieve the contents of the folder if the folder is configured as 'browsable'
      url: 'images/bgs/',
      success: function (data) {
         $(data).find("a:contains(" + fileExt[0] + "),a:contains(" + fileExt[1] + "),a:contains(" + fileExt[2] + ")").each(function () {
            var filename = this.href.replace(window.location.host, "").replace("http:///", 'images/bgs/');
            // console.log("filename: " + filename);
            elurl = `url('${filename}')`
            // console.log("   elurl: " + elurl);
            elcss = `<div class='bg-image'><div style="background-image: ${elurl}""></div></div>`
            // console.log("   elcss: " + elcss);
            $("#bgImage").before(elcss)
            bgs.push(filename)
         });
       }
    });

  }

  function newBG() {

    let replacement_image = Math.floor((Math.random())*bgs.length)
    being_replaced = which_image

    while (replacement_image == which_image) {
      replacement_image = Math.floor((Math.random())*bgs.length)
      console.log(replacement_image)
    }

    which_image = replacement_image

    the_bg = bgs[which_image]

    console.log("replacement_image :" + replacement_image);
    console.log("   being_replaced :" + being_replaced);
    console.log("      which_image :" + which_image);

    // MAYBE TRY CHANGING Z-INDEX ALSO.

    $(".bg-image:eq(" + which_image + ")").fadeIn(speed*2, function() {
      $(".bg-image:eq(" + being_replaced + ")").fadeOut(100)
    })






  }

  function reload_tap_count() {
    reload_taps++

    if (reload_taps >= 8) {
      location.reload(true)
    }

    if (reload_taps >= 1) {
      $('.size-guide').hide()
    }

  }


  function render_menu() {

    let data = {}

    let template = $('#menuTemplate').html()
    let html = Mustache.render(template,data)
    $('.container').not('#index').append(html)

    $(".section-menu .menu_button, .section-menu .next_button, .section-menu .previous_button, .section-menu .play_pause_button, .detail_mir:last .next_button, .detail_mir:first .previous_button, .detail_mis:last .next_button, .detail_mis:first .previous_button, .menu .floating-menu .play_pause_button, .section-menu .restart_button").addClass("inactive")


    }

  function  play_css() {
    $('body').removeClass('paused').addClass('playing')
  }

  function pause_css() {
    $('body').removeClass('playing').addClass('paused')
  }


  function missionaryAudioAndScroll(slug) {
    if (muted == false) {
      duration = eval(slug+"_audio.duration()")*1000

      audio_bed.seek(0).volume(1).play()
      eval(slug+"_audio.seek(0).volume(1).play()")

      play_css()
      scrollStart(duration)

    }
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
    $('h1').each(function() {
      var w = this.textContent.split(" ");
      if (w.length > 1) {
        w[w.length - 2] += "&nbsp;" + w[w.length - 1];
        w.pop();
        this.innerHTML = (w.join(" "));
      }
    });
  }

  function get_container_slug() {
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

  function scrollStart(anim_duration) {
    $('.detail-content:visible').stop().animate({scrollTop: ($('.scroller:visible').height() - $('.detail-content:visible').height() + 83)}, anim_duration, 'linear');
  }

  function scrollReset(slug) {

    if (slug != "missionaries" && slug != "miracles" && slug != "index") {
      $('.detail-content:visible').stop()
      $('html,body').stop().animate({scrollTop: $(".container:visible").offset().top},speed,'swing')
      $('.detail-content:visible').animate({scrollTop: $(".container:visible").offset().top},speed,'swing',
        setTimeout(function () {
          missionaryAudioAndScroll(slug)
        },speed)
      )
    } else {
      $('html,body').stop().animate({scrollTop: $(".container:visible").offset().top},speed,'swing')
    }

  }

  function scrollPause() {
    $('html,body').stop()
    $('.detail-content:visible').stop()
    scroll_progress = $('.detail-content:visible').scrollTop()
    $('.scroller:visible').stop()
    progress = eval(slug+"_audio.seek()")*100
    remaining = duration - progress
  }

  function scrollUnpause() {
    $('.detail-content:visible').stop().animate({scrollTop: scroll_progress}, speed, 'swing')
    setTimeout(function() {
      scrollStart(remaining)
    },speed)

  }

  function setScrollerHeight() {
    $('.detail-content:visible').height( $(window).height() - $('.detail-header:visible').outerHeight() - $('.bottom-logo:visible').outerHeight() )
  }

  // Fade in Missionaries

  function missionaries_in() {
    $("#missionaries").fadeIn(speed)
    scrollReset(slug)
    localStorage.section = 'missionaries'
  }

  // Fade in Miracles

  function miracles_in() {
    $("#miracles").fadeIn(speed)
    scrollReset(slug)
    localStorage.section = 'miracles'
  }

  // Fade out Index

  function index_out() {
    $('#index').fadeOut(speed);
  }


  $(document).ready(function() {


    loadBGs()
    $('#loader').fadeIn(500);

    $(function() {

      var misJSON = "js/mis.json"

      $.getJSON(misJSON, function(data){

        mis_json = data

        let template = $('#missionary-menu-template').html()
        let html = Mustache.render(template,data)
        $('body').append(html);

        template = $('#misTemplate').html()
        html = Mustache.render(template,data)
        $('body').append(html);

        $('.mis_link').each(function() {
          slug = $(this).attr('id').split('_link').join('')

          eval(slug+"_audio= new Howl({src:['audio/stories/"+slug+".mp3'],onend: function(){setTimeout(audio_bed.fade(1.0,0.0,6000),3000);}})")

        });


      });

      var mirJSON = "js/mir.json"

      $.getJSON(mirJSON, function(data){

        mir_json = data

        let template = $('#miracles-menu-template').html()
        let html = Mustache.render(template,data)
        $('body').append(html);

        template = $('#mirTemplate').html()
        html = Mustache.render(template,data)
        $('body').append(html);

        $('.mir_link').each(function() {
          slug = $(this).attr('id').split('_link').join('')

          eval(slug+"_audio= new Howl({src:['audio/stories/"+slug+".mp3'],onend: function(){setTimeout(audio_bed.fade(1.0,0.0,6000),3000);}})")
        });

        // mir_audio = new Howl({
        //   src: mir_stories
        // });


      populate_ids_for_previous_and_next_nav()
      render_menu()
      kill_orphans()

      $.fn.preload = function() {
          this.each(function(){
              let new_image = (new Image()).src = this;
          });
      }

      $(bgs).preload();

      newBG()
      slug = "index"
      $('#loader').fadeOut(speed*2, function() {
        $('#overlay').animate({"opacity": 0.5}, 500, function() {
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

    $('body').on('click', '.mute_status', function(event) {
      if (muted==false) {
        muted = true
        Howler.mute(true)
        $('body').addClass('muted').removeClass('unmuted')
      } else {
        muted = false
        get_container_slug()
        if ( slug != "missionaries" && slug != "miracles" && slug != "index"  ) {
          Howler.mute(false)
          eval(slug+"_audio.volume(1)")
          audio_bed.volume(1)
        }
        $('body').removeClass('muted').addClass('unmuted')
      }
    });

    $('body.unmuted').on('click', '.detail .play_pause_button', function(event) {
      get_container_slug()
      if (eval(slug+"_audio.playing()")) {
        eval(slug+"_audio.pause()")
        audio_bed.pause()
        scrollPause()
        pause_css()
      } else {
        if (eval(slug+"_audio.seek()") > 2) {
          eval(slug+"_audio.volume(1).play()")
          audio_bed.volume(1).play()
          scrollUnpause()
          play_css()
        } else {
          eval(slug+"_audio.volume(1).seek(0).play()")
          audio_bed.volume(1).seek(0).play()
          scrollReset(slug)
          play_css()
        }
      }
    });

    $('body.unmuted').on('click', '.detail .restart_button', function(event) {
      get_container_slug()
      if(eval(slug+"_audio.playing()")) {
        Howler.stop()
        $('html,body').stop()
      }

      $('.detail-content:visible').stop().animate({scrollTop: $(".container:visible").offset().top},speed, 'linear',
        setTimeout(function () {
          eval(slug+"_audio.volume(1).seek(0).play()")
          audio_bed.volume(1).seek(0).play()
          duration = eval(slug+"_audio.duration()")*1000
          play_css()
          scrollStart(duration)
        },speed)
      )
    });

    // Click Missionaries Button

    $("#missionaries_button").click(function(event) {
      slug = "missionaries"
      $('#index').fadeOut(speed, function() {
        newBG()
        missionaries_in()
      });
    });

    // Click miracles button

    $('#miracles_button').click(function(event) {
      slug = "miracles"
      $('#index').fadeOut(speed, function() {
        newBG()
        miracles_in()
      });
    });

    // Specific Missionary Button

    $('body').on('click', '.mis_link', function(event) {
      slug = $(this).attr('id').split('_link').join('');
      $(missionaries).fadeOut(speed, function() {
        newBG()
        $("#"+slug).fadeIn(speed)
        setScrollerHeight()
        scrollReset(slug);
      });
    });

    // Specific Miracle Button

    $('body').on('click', '.mir_link', function(event) {
      slug = $(this).attr('id').split('_link').join('');
      $(miracles).fadeOut(speed, function() {
        newBG()
        $("#"+slug).fadeIn(speed)
        setScrollerHeight()
        scrollReset(slug);
      });
    });


    $('body').on('click','.detail .next_button:not(".inactive")', function() {
      $('.detail-content:visible').scrollTop(0)
      $(this).parents('.container').fadeOut(speed, function() {
        Howler.stop()
        pause_css()
        newBG()
        $(this).next().fadeIn(speed, function() {
          get_container_slug()
          Howler.stop() // Preventing errors from people hitting button multiple times.
          scrollReset(slug);
        });
        setScrollerHeight()
      });
    })

    $('body').on('click','.detail .previous_button:not(".inactive")', function() {
      $('.detail-content:visible').scrollTop(0)
      $(this).parents('.container').fadeOut(speed, function() {
        Howler.stop()
        pause_css()
        newBG()
        $(this).prev().fadeIn(speed, function() {
          get_container_slug()
          Howler.stop() // Preventing errors from people hitting button multiple times.
          scrollReset(slug);
        });
        setScrollerHeight()
      });
    })

    // Menu Click

    $('body').on('click', '.detail .menu_button', function(event) {
      let destination = localStorage.section
      slug = localStorage.section
      Howler.stop()
      $(this).parents('.container').fadeOut(speed,function(){
        newBG()
        $(`#${destination}`).fadeIn(speed, function() {
        });
        scrollReset()
      });
    })

    // Home click

    $('body').on('click', '.home_button', function(event) {
      Howler.stop()
      slug = index
      $(this).parents('.container').fadeOut(speed*1,function(){
        newBG()
        $(`#index`).fadeIn(speed, function() {
        });
      });
      localStorage.section = "index"
    })


  });
