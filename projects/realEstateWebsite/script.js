 // steps to making the real estate website
// in hero section the first button should be #properties and the second #contact
// color the default text color set it to #333
// create a container in each section with a max-width: 1200px margin: 0 auto
// make the header fixed and style it nicely
// when scrolling add a box shadow

// thuis is the signature blue color - color: #2c5aa0;
// add an udnerlne on hover to the nav links
// this s the backeground color for hover on button - background-color: #1e3f73;

// stees for the hero image

// give the features section a background color of - #f8f9fa

// for features grid - grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
// oringal box shadow for cards - box-shadow: 0px 5px 20px rgba(0,0,0,0.1)
// box shadow on hover - box-shadow: 0px 20px 40px rgba(0,0,0,0.15)

// for h2 and content under it set margin-bottom: 48px;

// this is for the prperties grid - grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));

// stats grid - grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))

// in the contact form do this for both input and textarea - outline: none; border-color: #2c5aa0

// add this background color to the footer - background-color: #1a1a1a;
// add this to the footer grid. grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

// steps for the animation

// stpesi n javascript
// set a media qeury with a max-width: 768px
// show the mobile icon and hide the nnav links
window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    if(window.scrollY > 100){
        header.classList.add("header-scrolled");
    }
    else {
        header.classList.remove("header-scrolled");
    }
});

// add active class to navLinks to toggle hte mobile menu
let navLinks = document.getElementById("navLinks");
let mobileMenuBtn = document.getElementById("mobileMenuBtn");
let closeIcon = document.getElementById("closeIcon");

mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.add("active");
});

document.querySelector(".close-icon i").addEventListener("click", () => {
    navLinks.classList.remove("active");
});

// fade in anmation
const fadeElements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    }); 
});
fadeElements.forEach(el => observer.observe(el));

// steps to making  
function animateCounter(){
    let updateNumber = document.querySelectorAll(".updateNumber");
    updateNumber.forEach((currNum) => {
        let counter = 0;
        let targetValue = 100;
        let timer = setInterval(() => {
            if(counter < targetValue){
                counter++;
                currNum.innerHTML = counter;
            }
            if(counter === targetValue){
                clearInterval(timer);
            }
        }, 20);
    });
}

// animation for the h1
document.addEventListener("DOMContentLoaded", function(){
    let heroFadeInElements = document.querySelectorAll(".hero-fade-in");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting){
                entry.target.classList.add("show");
            }
            else {
                entry.target.classList.remove("show");
            }
        });
    });
    heroFadeInElements.forEach((el) => {
        observer.observe(el);
    });
});

// intersection observer to show stats on scroll
const observerStats = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            animateCounter();
            observerStats.unobserve(entry.target);
        }
    });
});
const statsSection = document.querySelector(".stats");
observerStats.observe(statsSection);
