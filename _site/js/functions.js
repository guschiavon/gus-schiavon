// const themeSwitch = document.getElementById('switch');
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