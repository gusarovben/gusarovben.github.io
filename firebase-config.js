// Конфигурация Firebase
//const dbUrl = "https://ne-dolgiy-yaschik-default-rtdb.europe-west1.firebasedatabase.app/yaschik";
const checkNumderUrl = dbUrl + '.json?shallow=true';

// DOM-элементы
const sendbutton = document.getElementById('idsendbutton');
const statusDiv = document.getElementById('idstatus');
const mypost = document.getElementById('idpost');

// Константы
const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
];
const maxcount = 100;

// Экспорт для других страниц
window.dbUrl = dbUrl;
