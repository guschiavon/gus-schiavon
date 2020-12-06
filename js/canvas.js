// Animate image on scroll
const canvas = document.getElementById("shaka");
const context = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 1350;

const frameCount = 40;
const currentFrame = (index) =>
  `/assets/images/stopmotion/${(index + 1).toString().padStart(4, "0")}.jpg`;

const images = [];
const gesture = {
  frame: 0,
};

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

gsap.to(gesture, {
  frame: frameCount - 1,
  snap: "frame",
  scrollTrigger: {
    // markers: true,
    trigger: ".atf-content",
    duration: 1,
    scrub: 0.5,
    start: "top 20%",
  },
  onUpdate: render, // use animation onUpdate instead of scrollTrigger's onUpdate
});

images[0].onload = render;

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[gesture.frame], 0, 0);
}
