/*
Multiple items; only ONE can be open at a time — opening one closes all others
Smooth height animation using the CSS max-height trick (no JS animation libraries)
Toggle the aria-expanded attribute on each trigger button (true/false)
Event delegation: ONE click listener on the container, not one per item

*/




const accordion = document.querySelector(".accordion")

accordion.addEventListener("click",  openPanel);


function openPanel(e){
const panels=document.querySelectorAll(".accordion-panel")
panels.forEach((panel, index) => {
    
    panel.classList.remove("active")

});

const buttons=document.querySelectorAll("button")
buttons.forEach((button, index) => {
    
    button.setAttribute('aria-expanded', "false");

});


    if( e.target.tagName=== "BUTTON"){
        e.target.parentElement.querySelector(".accordion-panel").classList.add("active")
        e.target.setAttribute('aria-expanded','true');
    
    }
        
    
}

