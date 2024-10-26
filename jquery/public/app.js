$(document).ready(function() {
    let currentTime = moment().format('HH:mm');
    $('#currentTime').text(currentTime);

    // Установка текста кнопки на сегодняшнюю дату
    const todayDate = moment().format('DD.MM.YYYY'); // Формат даты
    $('#fullScreenButton').text(todayDate);

    // Обновление времени каждую секунду
    setInterval(function() {
        currentTime = moment().format('HH:mm');
        $('#currentTime').text(currentTime);
    }, 1000);

    // Обработчик для кнопки на весь экран
    $('#fullScreenButton').click(function() {
        if (document.fullscreenElement) {
            document.exitFullscreen(); // Выход из полноэкранного режима
        } else {
            document.documentElement.requestFullscreen(); // Вход в полноэкранный режим
        }
    });

    // Вебсокет соединение (остальная часть вашего кода)
    const socket = new WebSocket("ws://185.253.218.8/chat/ws");
    let messageTimeout = null;  // Таймер для удаления сообщения

    socket.onopen = function() {
        console.log("[open] Connection established");
    };

    socket.onmessage = function(event) {
        handleNewMessage(event.data);
        console.log(`[message] Data received from server: ${event.data}`);
    };

    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            console.error('[close] Connection died');
        }
    };

    socket.onerror = function(error) {
        console.error(`[error] ${error.message}`);
    };

    // Получение сохраненных времен
    $.get('http://185.253.218.8:5555/times', function(json) {
        if (json.length) {
            json.forEach(function(time) {
                $('#messagesList').append($('<li>').text(time));
            });
        }
    });

    function handleNewMessage(newMessage) {
        const messageItem = $('<li>').text(newMessage);
        $('#messagesList').empty().append(messageItem);

        // Проверяем, если текст длиннее ширины экрана
        if (messageItem[0].scrollWidth > window.innerWidth) {
            messageItem.addClass('scroll');
        } else {
            messageItem.removeClass('scroll');
        }

        // Если уже был таймер, очищаем его
        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }

        // Устанавливаем таймер на 30 секунд для удаления сообщения
        messageTimeout = setTimeout(function() {
            $('#messagesList').empty();  // Очищаем сообщение через 30 секунд
        }, 1000 * 60); // 30000 миллисекунд = 30 секунд
    }
});
