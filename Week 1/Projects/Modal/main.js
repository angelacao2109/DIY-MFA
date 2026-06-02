//Open on button click · Close on overlay click · Close on Escape key · Focus trap (Tab stays inside)

const btn=document.getElementById("btn")
const modal=document.getElementById("modal")


//WHEN CLICK ON BUTTON ADD ACTIVE CLASS
btn.addEventListener("click",(e)=>{  
modal.classList.add("active");
});


//WHEN CLICK ON MODAL
modal.addEventListener("click", handleExit)
document.addEventListener("keydown", handleExitEscape)

function handleExit(){
modal.classList.remove("active");
}


function handleExitEscape(e){
    if (e.key === 'Escape'){
 modal.classList.remove("active");   

}
}
