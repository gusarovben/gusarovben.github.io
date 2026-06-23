// Модальное окно подтверждения
const overlay = document.getElementById('confirmOverlay');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');

function showConfirm() {
    return new Promise((resolve) => {
        overlay.classList.add('active');

        btnYes.onclick = () => {
            overlay.classList.remove('active');
            resolve(true);
        };

        btnNo.onclick = () => {
            overlay.classList.remove('active');
            resolve(false);
        };
    });
}
