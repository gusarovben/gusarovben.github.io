// Главный обработчик отправки
sendbutton.addEventListener('click', async () => {
    sendbutton.disabled = true;
    statusDiv.style.color = 'white';
    statusDiv.textContent = "Проверяю всё...";

    try {
        // Проверка: сообщение не пустое
        const newPost = mypost.value;
        if (newPost.trim() === '') {
            statusDiv.style.color = 'red';
            statusDiv.textContent = 'Нельзя отправить пустое сообщение.';
            sendbutton.disabled = false;
            return;
        }

        // Проверка: формат телефона
        const number = mynumber.value;
        const checkphone = number.trim();
        const phoneMask = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        if (!phoneMask.test(checkphone)) {
            statusDiv.style.color = 'red';
            statusDiv.textContent = 'Введите 10 цифр.';
            sendbutton.disabled = false;
            return;
        }

        // Проверка: телефон зарегистрирован
        const checkNumderResponse = await fetch(checkNumderUrl);
        const numberkeys = await checkNumderResponse.json();
        const checknumber = number.trim().toLowerCase();
        if (numberkeys === null || !(checknumber in numberkeys)) {
            statusDiv.style.color = 'red';
            statusDiv.textContent = 'Пользователь с таким номером не зарегистрирован.';
            sendbutton.disabled = false;
            return;
        }

        // Текущий месяц
        const now = new Date();
        const monthName = months[now.getMonth()];
        const year = now.getFullYear();
        const datePrefix = monthName + year;

        // Создать месяц, если его ещё нет
        const checkDateUrl = dbUrl + '/' + encodeURIComponent(number) + '.json?shallow=true';
        const checkDateResponse = await fetch(checkDateUrl);
        const datekeys = await checkDateResponse.json();
        const checkdate = datePrefix.trim().toLowerCase();
        if (!(checkdate in datekeys)) {
            statusDiv.textContent = "Добавляю новый месяц...";
            const dateUrl = dbUrl + '/' + encodeURIComponent(number) + '/' + encodeURIComponent(datePrefix) + '.json';
            const putResponse = await fetch(dateUrl, {
                method: 'PUT',
                body: JSON.stringify({ status: true }),
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Поиск свободного слота (count1, count2, ..., count100)
        let i = 1;
        let countcount = 0;
        while (i <= maxcount + 1) {
            const checkCountUrl = dbUrl + '/' + encodeURIComponent(number) + '/' + encodeURIComponent(datePrefix) + '.json?shallow=true';
            const checkCountResponse = await fetch(checkCountUrl);
            const countkeys = await checkCountResponse.json();
            const countPrefix = 'count' + i;
            const checkcount = countPrefix.trim().toLowerCase();
            if (!(checkcount in countkeys)) {
                countcount = i;
                break;
            }
            i++;
        }

        const countPrefix = 'count' + countcount;

        // Лимит исчерпан
        if (countcount === maxcount + 1) {
            statusDiv.style.color = 'red';
            statusDiv.textContent = 'Вы исчерпали свой лимит на этот месяц ' + maxcount + ' штук.';
            sendbutton.disabled = false;
            const klvUrl = dbUrl + '/' + encodeURIComponent(number) + '/' + encodeURIComponent(datePrefix) + '/status.json';
            const putResponse = await fetch(klvUrl, {
                method: 'PUT',
                body: JSON.stringify(false),
                headers: { 'Content-Type': 'application/json' }
            });
            return;
        }

        // Подтверждение
        const confirmed = await showConfirm();
        if (!confirmed) {
            sendbutton.disabled = false;
            statusDiv.textContent = "";
            return;
        }

        // Отправка
        const userUrl = dbUrl + '/' + encodeURIComponent(number) + '/' + encodeURIComponent(datePrefix) + '/' + encodeURIComponent(countPrefix) + '.json';
        statusDiv.style.color = 'white';
        statusDiv.textContent = "Отправляю письмо...";
        const putResponse = await fetch(userUrl, {
            method: 'PUT',
            body: JSON.stringify({
                text: newPost,
                time: new Date().toLocaleString()
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (putResponse.ok) {
            statusDiv.style.color = 'green';
            statusDiv.textContent = 'Сообщение успешно отправлено! Вы можете отправить ещё ' + (maxcount - countcount) + '.';
        } else {
            throw new Error('Ошибка сохранения');
        }
    } catch (error) {
        statusDiv.style.color = 'red';
        statusDiv.textContent = 'Ошибка связи с сервером.';
        console.error(error);
    }

    sendbutton.disabled = false;
});
