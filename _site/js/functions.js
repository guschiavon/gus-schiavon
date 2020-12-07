// Dark/Light theme
const site = document.getElementById('body');
const themeSwitch = document.getElementById('switch')
let themePrefs = localStorage.getItem('theme')

const initTheme = function () {
  const darkThemeSelected = themePrefs !== null && themePrefs === "dark"; // checks if the dark theme is selected
  themeSwitch.checked = darkThemeSelected;
  // update body data-theme attribute
  darkThemeSelected
    ? site.setAttribute("data-theme", "dark")
    : site.removeAttribute("data-theme");
};

if(themeSwitch) {
  initTheme();
  themeSwitch.addEventListener('change', function(){
    setTheme()
  })
}
const darkTheme = function () {
  site.setAttribute("data-theme", "dark");
  localStorage.setItem("theme", "dark");
}
const lightTheme = function () {
  site.removeAttribute("data-theme");
  localStorage.removeItem("theme");
}
const setTheme = function (){
  if(themeSwitch.checked) {
    darkTheme()
  } else {
    lightTheme()
  }
}

document.getElementById('switch').addEventListener('change', function(e) {
    e.target.checked
      ? darkTheme()
      : lightTheme()
  });

// Mobile Nav Menu
const burger = document.getElementById('burger')
const nav = document.getElementById('nav')
const brand = document.getElementById('nav-brand')

burger.addEventListener('click', function(){
  this.classList.toggle('open')
  nav.classList.toggle('mobile-menu')
  brand.classList.toggle('push')
})


// GSAP animations
gsap.registerPlugin(ScrollTrigger, CSSRulePlugin, MotionPathPlugin)

const divider = document.getElementById("divider");
const headerGradient = document.getElementById("gradient");
const headerContent = document.getElementById("title-section");
const greenify = document.getElementsByClassName("greenify")
const greenLine = document.getElementsByClassName('portfolio-highlight-title-underline')
const frame = document.getElementsByClassName('portfolio-thumb-image')

const portfolioTl = gsap.timeline({
  scrollTrigger: {
    duration: 1,
    trigger: ".portfolio-highlight",
    start: "top center",
    end: "bottom center",
    scrub: 1,
  },
});
// const greenLine = CSSRulePlugin.getRule(".portfolio-highlight-title::before")

portfolioTl.to(greenLine, {
  width: "200%",
})
.to(frame, {
  transform: "scale(1.06)"
})

const navbar = document.getElementById('sticky-nav')

ScrollTrigger.matchMedia({
  "(max-width: 676px)": function() {
    let headerTl = gsap
      .timeline({
        scrollTrigger: {
          duration: 0.7,
          trigger: divider,
          start: "top 30%",
          end: "bottom 23%",
          toggleActions: "play none none reverse",
          scrub: true,
        },
      })
      .to(headerContent, {
        opacity: 0,
      })  
  },

  "(max-width: 768px)": function() {
    
    let navTl = gsap
      .timeline({
        scrollTrigger: {
          trigger: divider,
          start: "top 14%",
          endTrigger: "#footer",
          pin: true,
          pinSpacing: false,
          scrub: true,
        },
      })
  },

  "(max-width: 1023px)": function(){

    let headerTl = gsap
      .timeline({
        scrollTrigger: {
          duration: 1,
          trigger: divider,
          start: "top 25%",
          end: "bottom",
          toggleActions: "play none none reverse",
          scrub: true,
        },
      })
      .to(headerContent, {
        opacity: 0,
      })
      .to(headerGradient, {
        height: "100",
        backgroundImage: "linear-gradient(#111 30%, #333 66%, #0000 100%)",
      })
      .to(greenify, {
        color: "#1fc71f",
      })
},

  "(min-width: 1024px)": function(){
    let headerTl = gsap
      .timeline({
        scrollTrigger: {
          // markers: true,
          duration: 1,
          trigger: divider,
          start: "top 30%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
          scrub: true,
        },
      })
      .to(headerContent, {
        opacity: 0,
      })
    }, 
})

//  particles

function random(min, max) {
  return Math.floor(Math.random() * (1 + max - min) + min);
}

const container = document.getElementById('particles-container');
let html = "";
const count = 100;
let w = window.innerWidth;
let h = window.innerHeight;

const tl = gsap.timeline({
  repeat: -1
});
const tl2 = gsap.timeline({
  repeat: -1,
  // repeatDelay: 1
});

for (let i = 0; i < count; i++) {
  html += "<div></div>";
}
container.innerHTML = html;

const dots = document.querySelectorAll("#particles-container > div");

for (let d = 0; d < dots.length; d++) {
  tl.add(
    gsap.fromTo(
      dots[d],
      {
        x: random(-(w * 0.4), w * 0.4),
        y: random(-(h * 0.4), h * 0.4),
        z: random(-300, 0),
        opacity: random(1, 4) / 10,
      },
      {
        x: "+=" + random(-(w * 0.4), w * 0.4),
        y: "+=" + random(-(h * 0.4), h * 0.4),
        z: "+=" + random(-200, 200),
        repeat: 1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 3,
      }
    ),
    0
  );
}
tl2.fromTo(container, {
  perspective: 20
}, {
  perspective: 700,
  repeat: 1,
  repeatDelay: 2,
  yoyo: true,
  ease: "sine.inOut",
  duration: 3
});