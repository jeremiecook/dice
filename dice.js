
function Dice (id, color1, color2) {
  this.color1 = '#FF8D47';
  this.color1 = color1;
  this.color2   = '#FFC647';
  this.color2   = color2;
  this.framerate = 13;

  this.dice = $(id);
  this.faces = this.dice.find('.faces li');
  this.drag  = this.dice.find('.drag-container');

  this.totalWidth = this.faces.length * this.faces.outerWidth(true);
  this.timer = null;

  this.init();
}


Dice.prototype.init = function () {

    // On place chaque face
  for (var i = 0; i < this.faces.length; i++) {

    // Initial position
    this.faces[i].style.transform =
      "translateX(" + i * this.faces.outerWidth(true) + "px)";

    // Color gradient
    this.faces[i].style.background = blend (
      this.color1,
      this.color2,
      i / this.faces.length // Percentage
    );

  }

  // Left and right duplicates ("shadows")
  f = this.dice.find('.faces');
  var left = f.clone().appendTo( this.drag );
    left[0].style.transform = "translateX(" + (- this.totalWidth) + "px)";
  var right = f.clone().appendTo( this.drag );
    right[0].style.transform = "translateX(" + this.totalWidth + "px)";


  this.events();

}

Dice.prototype.move = function ( toX ) {

  // Bounds
  toX = ((toX % this.totalWidth) + this.totalWidth) % this.totalWidth;
  //toX %= this.totalWidth; // Peut être amélioré

  // Move
  this.drag[0].style.transform = "translateX(" + toX + "px)";

  return toX;
}



Dice.prototype.events = function () {

  var sX = 0,
      desX = 0,
      tX = 0,
      vX = 0,
      initialX = 0;

  var that = this;

// cài đặt events
if (mobilecheck()) {
  // ==================== Touch Events ====================
  this.dice[0].ontouchstart = function(e) {
    clearInterval(that.timer);
    that.drag[0].style.transition = "";
    that.dice.removeClass("zoom");
    e = e || window.event;
    var sX = e.touches[0].clientX;
    desX = tX;
    initialX = tX;

    document.ontouchmove = function(e) {
      e = e || window.event;
      var nX = e.touches[0].clientX;
      desX = nX - sX; // Différence entre positions
      tX = initialX + desX;
      vX = desX * 10;
      tX = that.move(tX); // Position actuelle + variance
    }

    document.ontouchend = function(e) {
      document.ontouchmove = document.ontouchend = null;
      that.timer = setInterval(function() {

        // Calcul de vélocité
        vX *= .99;
        tX += vX * .4;
        tX = that.move(tX);

        // Stop
        if (Math.abs(vX) < 1) {
          clearInterval(that.timer);
          var stop = Math.round(tX / that.faces.outerWidth(true)) * that.faces.outerWidth(true);
          tX = stop;
          that.drag[0].style.transition = "all .1s ease-in";
          that.dice.addClass("zoom");
          tX = that.move(tX);
        }

      }, this.framerate);
    }

    // return false;
  }
} else {


  this.dice[0].onmousedown = function(e) {
    clearInterval(that.timer);
    that.drag[0].style.transition = "";
    that.dice.removeClass("zoom");
    e = e || window.event;
    sX = e.clientX;
    desX = tX;
    initialX = tX;


    window.onmousemove = function(e) {
      e = e || window.event;
      var nX = e.clientX;
      desX = nX - sX; // Différence entre positions
      tX = initialX + desX ;
      vX = desX * 5;
      that.move(tX); // Position actuelle + variance

    }

  window.onmouseup = function(e) {
      window.onmousemove = window.onmouseup = null;
      that.timer = setInterval(function() {

        // Calcul de vélocité
        vX *= .99;
        tX += vX * .1;
        that.move(tX);

        // Stop
        if (Math.abs(vX) < 5) {
          clearInterval(that.timer);
          var stop = Math.round(tX / that.faces.outerWidth(true)) * that.faces.outerWidth(true);
          tX = stop;
          that.drag[0].style.transition = "all .1s ease-in";
          that.dice.addClass("zoom");
          that.move(tX);
        }

      }, 9);
    }

  }

  };

}


/**
 * Colors utils
 */

function blend (color1, color2, percentage) {

    color1 = [parseInt(color1[1] + color1[2], 16), parseInt(color1[3] + color1[4], 16), parseInt(color1[5] + color1[6], 16)];
    color2 = [parseInt(color2[1] + color2[2], 16), parseInt(color2[3] + color2[4], 16), parseInt(color2[5] + color2[6], 16)];

    var color = [
        (1 - percentage) * color1[0] + percentage * color2[0],
        (1 - percentage) * color1[1] + percentage * color2[1],
        (1 - percentage) * color1[2] + percentage * color2[2]
    ];

    color = '#' + toHex(color[0]) + toHex(color[1]) + toHex(color[2]);

  return color;

}

function toHex(int)
{
    var hex = Math.round(int).toString(16);
    if (hex.length == 1)
        hex = '0' + hex;
    return hex;
}

/**
 * Mobile utils
 */


// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
function mobilecheck() {
  var check = false;
  (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}
