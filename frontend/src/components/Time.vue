<script>
import moment from 'moment';
import { startInterval } from '../utils/time';

export default {
  props: {
    showSavedTimes: Boolean,
  },
  data() {
    return {
      currentTime: moment().format('HH:mm:ss'),
      savedTimes: [],
      messages: [],  // Массив для хранения входящих сообщений через WebSocket
      socket: null,  // WebSocket объект
      messageTimeout: null,  // Таймер для удаления сообщения
    };
  },
  mounted() {
    // Устанавливаем соединение с WebSocket при загрузке компонента
    this.socket = new WebSocket("ws://185.253.218.8/chat/ws");

    this.socket.onopen = () => {
      console.log("[open] Connection established");
    };

    this.socket.onmessage = (event) => {
      // Когда приходит сообщение от WebSocket, заменяем старое новым
      this.handleNewMessage(event.data);
      console.log(`[message] Data received from server: ${event.data}`);
    };

    this.socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        console.error('[close] Connection died');
      }
    };

    this.socket.onerror = (error) => {
      console.error(`[error] ${error.message}`);
    };
  },
  methods: {
    startInterval,
    handleNewMessage(newMessage) {
      // Очистка предыдущего сообщения
      this.messages = [newMessage];

      // Если уже был таймер, очищаем его
      if (this.messageTimeout) {
        clearTimeout(this.messageTimeout);
      }

      // Устанавливаем таймер на 1 минуту для удаления сообщения
      this.messageTimeout = setTimeout(() => {
        this.messages = [];  // Очищаем сообщение через минуту
      }, 1000 * 60); // 60000 миллисекунд = 1 минута
    },
  },
  created: async function () {
    this.startInterval();
    const res = await fetch('http://185.253.218.8:5555/times');
    const json = await res.json();
    if (json.length) this.savedTimes = json;
  },
  beforeDestroy() {
    // Очищаем таймер при уничтожении компонента
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
  }
};

</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ currentTime }}</h1>

    <ul>
      <li v-for="msg in messages" :key="msg">{{ msg }}</li>
    </ul>
  </div>

</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 20rem;
  top: -90px;
}



h3 {
  font-size: 2rem;
}

.greetings {
  text-align: center;
}

li {
  background-color: #333; /* Темный фон для контраста с белым текстом */
  padding: 10px;
  margin-bottom: 10px;
  top: -150px;
  border-radius: 3px;
  border: 1px solid #ccc; /* Светло-серая рамка */
  color: #fff; /* Белый цвет текста */
  font-size: 8rem; /* Увеличенный размер шрифта */
  max-width: 1200px; /* Максимальная ширина для рамки */
  word-wrap: break-word; /* Перенос слов для длинных сообщений */
  margin-left: auto;
  margin-right: auto;
}


textarea {
  width: 80%;
  height: 100px;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}
</style>
