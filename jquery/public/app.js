$(document).ready(function() {
    let currentTime = moment().format('HH:mm:ss');
    $('#currentTime').text(currentTime);

    // Обновление времени каждую секунду
    setInterval(function() {
        currentTime = moment().format('HH:mm:ss');
        $('#currentTime').text(currentTime);
    }, 1000);

    // Вебсокет соединение
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

    function handleNewMessage(newMessage) {
        // Очистка предыдущего сообщения
        $('#messagesList').empty().append($('<li>').text(newMessage));

        // Если уже был таймер, очищаем его
        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }

        // Устанавливаем таймер на 1 минуту для удаления сообщения
        messageTimeout = setTimeout(function() {
            $('#messagesList').empty();  // Очищаем сообщение через минуту
        }, 1000 * 60); // 60000 миллисекунд = 1 минута
    }

    // Получение сохраненных времен
    $.get('http://185.253.218.8:5555/times', function(json) {
        if (json.length) {
            json.forEach(function(time) {
                $('#messagesList').append($('<li>').text(time));
            });
        }
    });
});
