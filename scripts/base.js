

//==================================================================================================Begin monstrosity
//--------------
  // Web Audio
  //--------------
var audio = {
    buffer: {},
    compatibility: {},
    files: [ '/music/' + catName + '.ogg',],
    proceed: true,
    source_loop: {},
    source_once: {}
};

//-----------------
// Audio Functions
//-----------------
audio.findSync = function(n) {
    var first = 0,
        current = 0,
        offset = 0;

    // Find the audio source with the earliest startTime to sync all others to
    for (var i in audio.source_loop) {
        current = audio.source_loop[i]._startTime;
        if (current > 0) {
            if (current < first || first === 0) {
                first = current;
            }
        }
    }

    if (audio.context.currentTime > first) {
        offset = (audio.context.currentTime - first) % audio.buffer[n].duration;
    }

    return offset;
};

audio.play = function(n) {
    if (audio.source_loop[n]._playing) {
        audio.stop(n);
    } else {
        audio.source_loop[n] = audio.context.createBufferSource();
        audio.source_loop[n].buffer = audio.buffer[n];
        audio.source_loop[n].loop = true;
        audio.source_loop[n].connect(audio.context.destination);

        var offset = audio.findSync(n);
        audio.source_loop[n]._startTime = audio.context.currentTime;

        if (audio.compatibility.start === 'noteOn') {
            /*
            The depreciated noteOn() function does not support offsets.
            Compensate by using noteGrainOn() with an offset to play once and then schedule a noteOn() call to loop after that.
            */
            audio.source_once[n] = audio.context.createBufferSource();
            audio.source_once[n].buffer = audio.buffer[n];
            audio.source_once[n].connect(audio.context.destination);
            audio.source_once[n].noteGrainOn(0, offset, audio.buffer[n].duration - offset); // currentTime, offset, duration
            /*
            Note about the third parameter of noteGrainOn().
            If your sound is 10 seconds long, your offset 5 and duration 5 then you'll get what you expect.
            If your sound is 10 seconds long, your offset 5 and duration 10 then the sound will play from the start instead of the offset.
            */

            // Now queue up our looping sound to start immediatly after the source_once audio plays.
            audio.source_loop[n][audio.compatibility.start](audio.context.currentTime + (audio.buffer[n].duration - offset));
        } else {
            audio.source_loop[n][audio.compatibility.start](0, offset);
        }

        audio.source_loop[n]._playing = true;
    }
};

audio.stop = function(n) {
    if (audio.source_loop[n]._playing) {
        audio.source_loop[n][audio.compatibility.stop](0);
        audio.source_loop[n]._playing = false;
        audio.source_loop[n]._startTime = 0;
        if (audio.compatibility.start === 'noteOn') {
            audio.source_once[n][audio.compatibility.stop](0);
        }
    }
};

//-----------------------------
// Check Web Audio API Support
//-----------------------------
try {
    // More info at http://caniuse.com/#feat=audio-api
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audio.context = new window.AudioContext();
} catch(e) {
    audio.proceed = false;
    alert('Web Audio API not supported in this browser.');
}

if (audio.proceed) {
    //---------------
    // Compatibility
    //---------------
    (function() {
        var start = 'start',
            stop = 'stop',
            buffer = audio.context.createBufferSource();

        if (typeof buffer.start !== 'function') {
            start = 'noteOn';
        }
        audio.compatibility.start = start;

        if (typeof buffer.stop !== 'function') {
            stop = 'noteOff';
        }
        audio.compatibility.stop = stop;
    })();

    //-------------------------------
    // Setup Audio Files and Buttons
    //-------------------------------
    for (var a in audio.files) {
        (function() {
            var i = parseInt(a) + 1;
            var req = new XMLHttpRequest();
            req.open('GET', audio.files[i - 1], true); // array starts with 0 hence the -1
            req.responseType = 'arraybuffer';
            req.onload = function() {
                audio.context.decodeAudioData(
                    req.response,
                    function(buffer) {
                        audio.buffer[i] = buffer;
                        audio.source_loop[i] = {};
                        var button = document.getElementById('button-loop-' + i);
                        button.addEventListener('click', function(e) {
                            e.preventDefault();
                            audio.play(this.value);
                        });
                    },
                    function() {
                        console.log('Error decoding audio "' + audio.files[i - 1] + '".');
                    }
                );
            };
            req.send();
        })();
    }
}


//==================================================================================================End monstrosity


if ((navigator.userAgent.indexOf('iPhone') != -1) ||(screen.width <=699) || (navigator.userAgent.indexOf('iPod') != -1) || (navigator.userAgent.indexOf('iPad') != -1)) {
  document.getElementById("muctr").style.visibility = "visible";
}

function closePlay(){
  soundManager.play('nyan');
  $('div.muctr').hide();
}

// Changes the language using language values provided

function changeLanguage(language){
    var values = languages[language];
    for (var key in values) {
         document.getElementById(key).innerHTML = values[key];
    }
    document.getElementById('flav').src = '/images/languages/' + language + '/button.png';
}

// Big chunk of scary JS

var paid = 0;$(window).keypress(function (e) {
    if (e.keyCode == 115) {
        showMenu();
    }
});
$("#showr").click(function () {
    $("#flavors").show("fast", function () {
        $(this).next("div").show("fast", arguments.callee);
    });
});
$("#hidr").click(function () {
    $("#flavors").hide(2000);
});

function getValue(NameOfValue) {
    if (document.cookie.length > 0) {
        begin = document.cookie.indexOf(NameOfValue + "=");
        if (begin != -1) {
            begin += NameOfValue.length + 1;
            end = document.cookie.indexOf(";", begin);
            if (end == -1) end = document.cookie.length;
            return unescape(document.cookie.substring(begin, end));
        }
    }
    return null;
}

function setValue(NameOfValue, value, expiredays) {
    var ExpireDate = new Date();
    ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000));
    document.cookie = NameOfValue + "=" + escape(value) + ((expiredays == null) ? "" : "; expires=" + ExpireDate.toGMTString());
}

function remValue(NameOfValue) {
    if (getValue(NameOfValue)) {
        document.cookie = NameOfValue + "=" +
            "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}

function animateStars() {
    $('.star').each(function () {
        thisFrame = $(this).attr('class');
        thisFrame = thisFrame.split(' ');
        thisFrame = thisFrame[1].split('-');
        thisFrame = parseInt(thisFrame[1]);
        if (thisFrame == 6) {
            //6
            $(this).remove();
        } else {
            $(this).removeClass("frame-" + String(thisFrame)).addClass("frame-" + String(parseInt(thisFrame) + 1));
        }
    })
} //400
animateStarsTimer = setInterval(animateStars, 60);

function toast() {
    window.location = "toaster.php"
}

function placeStar() {
    var newStar = $("<div class='star frame-1'><div class='wrapper'><div class='dot dot-1'></div><div class='dot dot-2'></div><div class='dot dot-3'></div><div class='dot dot-4'></div><div class='dot dot-5'></div><div class='dot dot-6'></div><div class='dot dot-7'></div><div class='dot dot-8'></div><div class='dot dot-9'></div></div></div>");
    newStar.css({ //1600
        top: Math.floor(Math.random() * 1200),
        left: Math.floor(Math.random() * 2000)
    }); //1200

    $('body').append(newStar);
} //100
placeStarTimer = setInterval(placeStar, 20);

function animateRainbow() {
    $('.rainbows').toggleClass("shift")
}
animateRainbowTimer = setInterval(animateRainbow, 300);
var startTime = new Date;
var currentTime = new Date;
var seconds;

function timeOnSite() {
    currentTime = new Date;
    seconds = parseFloat((currentTime - startTime) / 1000).toFixed(1);
    $("#timer .seconds").text(seconds);
    if (seconds == "1000.0") {
        pushThousnyan();
    } /* 1000 Seconds */
    if (seconds == "9001.0") {
        nyanThousand();
    } /* 9001 Seconds */
    if (seconds == "100000.0") {
        oneHundred();
    } /* 100,000 Seconds */
    if (seconds == "500000.0") {
        fiveHundred();
    } /* 500,000 Seconds */
    if (seconds == "1000000.0") {
        oneMillinyan();
    } /* 1,000,000 Seconds */
    if (seconds == "5000000.0") {
        fiveMillinyan();
    } /* 5,000,000 Seconds */
}
setTimeOnSite = setInterval(timeOnSite, 100);
/*
function timeTilDeath() {
	now      = new Date();
	kickoff  = Date.parse("December 21, 2012 00:00:00");
	diff = kickoff - now;

	days  = Math.floor( diff / (1000*60*60*24) );
	hours = Math.floor( diff / (1000*60*60) );
	mins  = Math.floor( diff / (1000*60) );
	secs  = Math.floor( diff / 1000 );

	dd = days;
	hh = hours - days  * 24;
	mm = mins  - hours * 60;
	ss = secs  - mins  * 60;

        document.getElementById("doomtime").innerHTML =dd + ' Days  ' +hh + ' Hours ' +mm + ' Minutes ' +ss + ' seconds';
}
setTimeTilDeath = setInterval(timeTilDeath, 100);
*/

function checkViews() {
    var score_original = eval(getValue('score_original'));
    var score_gb = eval(getValue('score_gb'));
    var score_technyancolor = eval(getValue('score_technyancolor'));
    var score_jazz = eval(getValue('score_jazz'));
    var score_mexinyan = eval(getValue('score_mexinyan'));
    var score_j5 = eval(getValue('score_j5'));
    var score_porkanyan = eval(getValue('score_porkanyan'));
    var score_nyaninja = eval(getValue('score_nyaninja'));
    var score_elevator = eval(getValue('score_elevator'));
    var score_wtf = eval(getValue('score_wtf'));
    var score_jamaicnyan = eval(getValue('score_jamaicnyan'));
    var score_america = eval(getValue('score_america'));
    var score_retro = eval(getValue('score_retro'));
    var score_vday = eval(getValue('score_vday'));
    var score_snarf = eval(getValue('score_snarf'));
    var score_sad = eval(getValue('score_sad'));
    var score_tacnayn = eval(getValue('score_tacnayn'));
    var score_dub = eval(getValue('score_dub'));
    var score_slomo = eval(getValue('score_slomo'));
    var score_xmas = eval(getValue('score_xmas'));
    var score_newyear = eval(getValue('score_newyear'));
    var score_fiesta = eval(getValue('score_fiesta'));
    var score_easter = eval(getValue('score_easter'));
    var score_bday = eval(getValue('score_bday'));
    var score_paddy = eval(getValue('score_paddy'));
    var score_breakfast = eval(getValue('score_breakfast'));
    var score_melon = eval(getValue('score_melon'));
    var score_star = eval(getValue('score_star'));
    var score_balloon = eval(getValue('score_balloon'));
    var score_daft = eval(getValue('score_daft'));
    if (score_original >= 1) {
        if (score_gb >= 1) {
            if (score_technyancolor >= 1) {
                if (score_jazz >= 1) {
                    if (score_mexinyan >= 1) {
                        if (score_j5 >= 1) {
                            if (score_porkanyan >= 1) {
                                if (score_nyaninja >= 1) {
                                    if (score_elevator >= 1) {
                                        if (score_wtf >= 1) {
                                            if (score_jamaicnyan >= 1) {
                                                if (score_america >= 1) {
                                                    if (score_retro >= 1) {
                                                        if (score_vday >= 1) {
                                                            if (score_snarf >= 1) {
                                                                if (score_sad >= 1) {
                                                                    if (score_tacnayn >= 1) {
                                                                        if (score_dub >= 1) {
                                                                            if (score_slomo >= 1) {
                                                                                if (score_xmas >= 1) {
                                                                                    if (score_newyear >= 1) {
                                                                                        if (score_fiesta >= 1) {
                                                                                            if (score_easter >= 1) {
                                                                                                if (score_bday >= 1) {
                                                                                                    if (score_paddy >= 1) {
                                                                                                        if (score_breakfast >= 1) {
                                                                                                            if (score_melon >= 1) {
                                                                                                                if (score_star >= 1) {
                                                                                                                    if (score_balloon >= 1) {
                                                                                                                        if (score_daft >= 1) {
                                                                                                                            pushNyanfan()
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
	    if (score_original >= 100) {
        if (score_gb >= 100) {
            if (score_technyancolor >= 100) {
                if (score_jazz >= 100) {
                    if (score_mexinyan >= 100) {
                        if (score_j5 >= 100) {
                            if (score_porkanyan >= 100) {
                                if (score_nyaninja >= 100) {
                                    if (score_elevator >= 100) {
                                        if (score_wtf >= 100) {
                                            if (score_jamaicnyan >= 100) {
                                                if (score_america >= 100) {
                                                    if (score_retro >= 100) {
                                                        if (score_vday >= 100) {
                                                            if (score_snarf >= 100) {
                                                                if (score_sad >= 100) {
                                                                    if (score_tacnayn >= 100) {
                                                                        if (score_dub >= 100) {
                                                                            if (score_slomo >= 100) {
                                                                                if (score_xmas >= 100) {
                                                                                    if (score_newyear >= 100) {
                                                                                        if (score_fiesta >= 100) {
                                                                                            if (score_easter >= 100) {
                                                                                                if (score_bday >= 100) {
                                                                                                    if (score_paddy >= 100) {
                                                                                                        if (score_breakfast >= 100) {
                                                                                                            if (score_melon >= 100) {
                                                                                                                if (score_star >= 100) {
                                                                                                                    if (score_balloon >= 100) {
                                                                                                                        if (score_daft >= 100) {
                                                                                                                            pushNyanfan()
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}/*endviews*/

function load404(){
checkViews();
pushMissingnyan();
}

var ach_1 = eval(getValue('ach_1'));
var ach_2 = eval(getValue('ach_2'));
var ach_3 = eval(getValue('ach_3'));
var ach_4 = eval(getValue('ach_4'));
var ach_5 = eval(getValue('ach_5'));
var ach_6 = eval(getValue('ach_6'));
var ach_7 = eval(getValue('ach_7'));
var ach_8 = eval(getValue('ach_8'));
var ach_9 = eval(getValue('ach_9'));
var ach_10 = eval(getValue('ach_10'));

function pushThousnyan() {
    if (!ach_1) {
        $('div.ach1').toggle();
        setValue('ach_1', '1337', 365);
    }
}

function nyanThousand() {
    if (!ach_2) {
        $('div.ach2').toggle();
        setValue('ach_2', '1337', 365);
    }
}

function oneHundred() {
    if (!ach_3) {
        $('div.ach3').toggle();
        setValue('ach_3', '1337', 365);
    }
}

function fiveHundred() {
    if (!ach_4) {
        $('div.ach4').toggle();
        setValue('ach_4', '1337', 365);
    }
}

function oneMillinyan() {
    if (!ach_5) {
        $('div.ach5').toggle();
        setValue('ach_5', '1337', 365);
    }
}

function fiveMillinyan() {
    if (!ach_6) {
        $('div.ach6').toggle();
        setValue('ach_6', '1337', 365);
    }
}

function pushMissingnyan() {
    if (!ach_7) {
        $('div.ach7').toggle();
        setValue('ach_7', '1337', 365);
    }
}

function pushRainyan() {
    if (!ach_8) {
        $('div.ach8').toggle();
        setValue('ach_8', '1337', 365);
    }
}

function pushNyanfan() {
    if (!ach_9) {
        $('div.ach9').toggle();
        setValue('ach_9', '1337', 365);
    }
}

function pushObsessed() {
    if (!ach_10) {
        $('div.ach10').toggle();
        setValue('ach_10', '1337', 365);
    }
}

$(document).ready(function () {
    $('div.view').hide();
    $('div.view').height(80)
    $('div.view').width(80)
    $('div.slide').toggle(function () {
        $(this).siblings('div.view').fadeIn('slow');
    }, function () {
        $(this).siblings('div.view').fadeOut('fast');
        return false;
    });
});



$(document).ready(function () {
    $('div.ach1').hide();
    $('div.ach1').toggle(function () {
        $(this).siblings('div.ach1').fadeIn('slow');
    }, function () {
        $(this).siblings('div.ach1').fadeOut('fast');
        return false;
    });
});
$(document).ready(function () {
    $('div.ach2').hide();
    $('div.ach2').toggle(function () {
        $(this).siblings('div.ach2').fadeIn('slow');
    }, function () {
        $(this).siblings('div.ach2').fadeOut('fast');
        return false;
    });
});
$(document).ready(function () {
    $('div.ach3').hide();
    $('div.ach3').toggle(function () {
        $(this).siblings('div.ach3').fadeIn('slow');
    }, function () {
        $(this).siblings('div.ach3').fadeOut('fast');
        return false;
    });
});
$(document).ready(function () {
    $('div.ach4').hide();
    $('div.ach4').toggle(function () {
        $(this).siblings('div.ach4').fadeIn('slow');
    }, function () {
        $(this).siblings('div.ach4').fadeOut('fast');
        return false;
    });
});
$(document).ready(function () {
    $('div.ach5').hide();
    $('div.ach5').toggle(function () {
        $(this).siblings('div.ach5').fadeIn('slow');
    }, function () {
        $(this).siblings('div.ach5').fadeOut('fast');
        return false;
    });
});
$(document).ready(function () {
    $('div.ach6').hide();
    $('div.ach6').toggle(function () {
        $(this).siblings('div.ach6').fadeIn('slow');
    }, function () {
        $(this).siblings('div.ach6').fadeOut('fast');
        return false;
    });
});
$(document).ready(function () {
    $('div.ach7').hide();
    $('div.ach7').toggle(function () {
        $(this).siblings('div.ach7').fadeIn('slow');
    }, function () {
        $(this).siblings('div.ach7').fadeOut('fast');
        return false;
    });
});
$(document).ready(function () {
    $('div.ach8').hide();
    $('div.ach8').toggle(function () {
        $(this).siblings('div.ach8').fadeIn('slow');
    }, function () {
        $(this).siblings('div.ach8').fadeOut('fast');
        return false;
    });
});
$(document).ready(function () {
    $('div.ach9').hide();
    $('div.ach9').toggle(function () {
        $(this).siblings('div.ach9').fadeIn('slow');
    }, function () {
        $(this).siblings('div.ach9').fadeOut('fast');
        return false;
    });
});
$(document).ready(function () {
    $('div.ach10').hide();
    $('div.ach10').toggle(function () {
        $(this).siblings('div.ach10').fadeIn('slow');
    }, function () {
        $(this).siblings('div.ach10').fadeOut('fast');
        return false;
    });
});

$(document).ready(function () {
    $('div.view2').hide();
    $('div.slide2').toggle(function helpMe() {
        $(this).siblings('div.view2').fadeIn('slow');
    }, function () {
        $(this).siblings('div.view2').fadeOut('fast');
        return false;
    });
});

function popitup(url) {
    newwindow = window.open(url, 'Credits', 'height=600,width=800');
    if (window.focus) {
        newwindow.focus()
    }
    return false;
}

function popitup(url) {
    newwindow = window.open(url, 'Store', 'height=600,width=800');
    if (window.focus) {
        newwindow.focus()
    }
    return false;
}

function popitup500(url) {
    newwindow = window.open(url, 'Store', 'height=500,width=500');
    if (window.focus) {
        newwindow.focus()
    }
    return false;
}konami = new Konami()
konami.load("javascript:konamiNyan()");
function konamiNyan(){
	showsnow();
	pushRainyan();
}
       startVolume = 50
        if (document.location.hostname == "localhost") {
          startVolume = 0
        }


        soundManager.preferFlash = true;
		soundManager.useHTML5Audio = true;
        soundManager.url = 'swf/';
        soundManager.flashVersion = 9;
        soundManager.useFlashBlock = false;
        soundManager.onready(function() {
          soundManager.createSound({
            id: 'nyan',
            url: '/music/' + catName + '.ogg',
            url: '/music/' + catName + '.mp3',
            autoLoad: true,
            autoPlay: true,
            loops: 9999999,
            onload: function() {
            },
            onfinish: function() {
              // if($.browser.SafariMobile){
              //   this.play();
              // }
            },
            volume: startVolume
          });
        });

function preReq() {
    var deflang = getValue('deflang');

    if (!(deflang in languages)) {
    	deflang = 'eng';
    	setValue('language', 'eng', 365);
	}

	changeLanguage(deflang);
	checkViews();
}

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-23159891-17']);
  _gaq.push(['_trackPageview']);
  (function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();


// Facebook button?

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Random chunk of JS

var score=eval(getValue('score_' + catName))+1;
setValue('score_' + catName,score,365);
var tweetPrefix = {
  en: "DEJE ABIERTA LA VALVULA POR",
  cat: "DEJE ABIERTA LA VALVULA POR",
  nyan: "NYAN NYANED NYA",
  jp: ""
}
var tweetSuffix = {
  en: "SEGUNDOS",
  cat: "SEGUNDOS",
  nyan: "NYANS",
  jp: "??????!"
}
var tweetPrefixActive = tweetPrefix.en;
var tweetSuffixActive = tweetSuffix.en;
var lang = "en";


//JS at the end

$(function(){
  $(".tweet-score").click(function() {
    var href = "http://twitter.com/share?_=1303084972176&count=horizontal&text=" + encodeURIComponent(tweetPrefixActive) + "%20" + seconds + "%20" + encodeURIComponent(tweetSuffixActive) + "!&url=http%3A%2F%2Fnyan.cat&via=nyannyancat"
    window.open(href, '_blank')
  })
  $(".facebook-score").click(function() {
    var href = "https://www.facebook.com/dialog/feed?app_id=345907258806762&link=https://www.nyan.cat/original.php&picture=http://www.nyan.cat/images/flavors/original.png&name=" + encodeURIComponent(tweetPrefixActive) + "%20" + seconds + "%20" + encodeURIComponent(tweetSuffixActive) + "%20AT%20NYAN.CAT!&caption=Think you can beat me?&description=See%20if%20you%20have%20what%20it%20takes.&redirect_uri=http://www.nyan.cat/close.php"
    window.open(href, '_blank')
  })
  $(".follow").click(function() {
    var href = "http://twitter.com/nyannyancat"
    window.open(href, '_blank')
  })
  if($.browser.SafariMobile){
    $(".i18n-pane").hide();
    $("#timer").css("font-size","40em").append("<div id='play'>I WANT NYAN<span>(click me)</span></div>")
    $("#play").click(function() {
      soundManager.play('loop', { onfinish: function() {
        soundManager.play('loop')
      }})
      $(this).fadeOut();
    })
  }
})

// more inline JS

function showMenu() {
  $("#flavors").show("fast")
;}

function hideMenu() {
  $("#flavors").hide(2000)
;}


if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 	document.getElementById("muctr").style.visibility = "visible";
}

function blowUpBackground() {

  var hyperColors = ["#0f4d8f", "#0f8f2a", "#8f5a0f", "#8f0f0f", "#840f8f"]

  $("body").css("background-color", hyperColors[Math.floor(Math.random()*hyperColors.length)])

}

var currentVolume = 50;

function volumeDown() {
  currentVolume = currentVolume + 15
  if (currentVolume >= 150) {
    soundManager.setVolume('nyan',200);
    var setSiteOnFire = setInterval( blowUpBackground, 150);
    $("#volume").hide();
    _gaq.push(['_trackEvent', 'Background Blew', seconds]);
  } else {
    soundManager.setVolume('nyan',currentVolume);
  }
}

$("#volume").click(function() {
  _gaq.push(['_trackEvent', 'Lower Volume', currentVolume]);
  if (currentVolume == 95) {
    $(this).text("OMG!!!!!!")
  } else if (currentVolume == 110) {
    $(this).text("OMG!!!!!!!!!!!!!!")
  } else if (currentVolume == 125) {
    $(this).text("OMG!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  }
  volumeDown();
})

// Might re-introduce this if I can find the old code for it. Remind me.
function lala() {
  if($.Storage.get("troubadourMode") == "1") {
    $("body").append('<div class="troubadour-button">Enable Nyanaoke Mode</div>')
    $(".troubadour-button").click(function() {
      $(this).hide()
      troubadourMode()
    })
  }
}