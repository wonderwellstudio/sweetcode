// Copyright start
// © Code by T.RICKS, https://www.tricksdesign.com/
// You have the license to use this code in your projects but not redistribute it to others

// Find all text with .tricks class and break each letter into a span
var tricksWord = document.getElementsByClassName("tricks");
for (var i = 0; i < tricksWord.length; i++) {
  var wordWrap = tricksWord.item(i);
  wordWrap.innerHTML = wordWrap.innerHTML.replace(
    /(^|<\/?[^>]+>|\s+)([^\s<]+)/g,
    '$1<span class="tricksword">$2</span>'
  );
}

var tricksLetter = document.getElementsByClassName("tricksword");
for (var i = 0; i < tricksLetter.length; i++) {
  var letterWrap = tricksLetter.item(i);
  letterWrap.innerHTML = letterWrap.textContent.replace(
    /\S/g,
    "<span class='letter'>$&</span>"
  );
}
// Copyright end

// Fade Up Animation
var fadeUp = anime.timeline({
  loop: false,
  autoplay: false
});
fadeUp.add({
  targets: ".fade-up .letter",
  translateY: [100, 0],
  translateZ: 0,
  opacity: [0, 1],
  easing: "easeOutExpo",
  duration: 1500,
  delay: (el, i) => 300 + 30 * i
});

// Fade Up 2 Animation
var fadeUp2 = anime.timeline({
  loop: false,
  autoplay: false
});
fadeUp2.add({
  targets: ".fade-up2 .letter",
  translateY: [100, 0],
  translateZ: 0,
  opacity: [0, 1],
  easing: "easeOutExpo",
  duration: 1500,
  delay: (el, i) => 300 + 30 * i
});

// Play your animation with these

// Wait before playing animation
setTimeout(() => {
  // Put the play below this line
  fadeUp.play();
}, 500);

// Play animaton when something is clicked
$(".your-button-class").click(function () {
  // Put the play below this line
});

// Play animaton when hovered in
$(".your-button-class").mouseenter(function () {
  // Put the play below this line
});

// Play animation when scrolled into view
$("#text-container").on("inview", function (event, isInView) {
  if (isInView) {
    // Put the play below this line
    fadeUp2.play();
  } else {
  }
});
