document.addEventListener('DOMContentLoaded', init);

let splash, loadedMessage;

function init() {
	splash = document.querySelector('#splash-screen');
	loadedMessage = document.querySelector('.loaded-message')

    setTimeout(() => {
        console.log(`yo`);
        splash.style.display = `none`;
    },2000);
    
    
}
