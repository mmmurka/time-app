<template>
  <div class="dashboard">
    <h2>Send a Message to the Main Screen</h2>
    <textarea v-model="message" placeholder="Write your message here"></textarea>
    <button @click="sendMessage">Send Message</button>

    <h2>Incoming Messages</h2>
    <ul>
      <li v-for="msg in messages" :key="msg">{{ msg }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',  // Сообщение, которое пользователь введет
      messages: [],  // Массив для хранения входящих сообщений через WebSocket
      socket: null,  // WebSocket объект
    };
  },
  mounted() {
    // Устанавливаем соединение с WebSocket при загрузке компонента
    this.socket = new WebSocket("ws://185.253.218.8/chat/ws");

    this.socket.onopen = () => {
      console.log("[open] Connection established");
    };

    this.socket.onmessage = (event) => {
      // Когда приходит сообщение от WebSocket, добавляем его в список сообщений
      this.messages.push(event.data);
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
    async sendMessage() {
      const token = localStorage.getItem('token');  // Получаем JWT токен из локального хранилища

      if (!token) {
        alert('You need to be logged in to send a message.');
        return;
      }

      if (this.message.trim() === '') {
        alert('Message cannot be empty');
        return;
      }

      try {
        const response = await fetch('http://185.253.218.8/api/send-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Добавляем токен в заголовок
          },
          body: JSON.stringify({ message: this.message }),  // Отправляем сообщение
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const data = await response.json();
        console.log(data.message);  // В ответе от сервера приходит подтверждение
        this.message = '';  // Очищаем поле сообщения после отправки

      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.close();
    }
  },
};
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
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

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

ul {
  list-style-type: none;
  padding: 0;
  width: 80%;
  margin-top: 20px;
}

li {
  background-color: black;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}
</style>
