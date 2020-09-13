let buttons = document.querySelectorAll('.big-btn .btn');

Array.prototype.forEach.call(buttons, function (b) {
    b.addEventListener('click', createRipple);
    b.onauxclick = createRipple;
});

function createRipple (e) {
    let x = e.clientX - e.target.offsetLeft;
    let y = e.clientY - e.target.offsetTop;

    let ripple = document.createElement("span");

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    this.appendChild(ripple);
    
    setTimeout(function(){
        deleteRipple(ripple);
    }, 600); // 1second = 1000ms
}

function deleteRipple(ripple) {
    ripple.parentNode.removeChild(ripple);
}