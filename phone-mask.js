// Маска ввода телефона: +7 (XXX) XXX-XX-XX
const mynumber = document.getElementById('idnumber');

mynumber.addEventListener('input', (e) => {
    let value = mynumber.value.replace(/\D/g, '');
    if (value.length > 0 && value[0] !== '7') {
        value = '7' + value.slice(0, 10);
    }
    value = value.slice(0, 11);
    let formatted = '+7';
    if (value.length > 1) formatted += ' (' + value.slice(1, 4);
    if (value.length > 4) formatted += ') ' + value.slice(4, 7);
    if (value.length > 7) formatted += '-' + value.slice(7, 9);
    if (value.length > 9) formatted += '-' + value.slice(9, 11);
    mynumber.value = formatted;
});
