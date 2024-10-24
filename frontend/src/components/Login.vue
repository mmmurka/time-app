<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="loginUser">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await axios.post('http://localhost:8000/api/login', {
          username: this.username,
          password: this.password,
        });

        if (response.data.access_token) {
          localStorage.setItem('token', response.data.access_token);
          this.$router.push('/dashboard');
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.detail || 'Login failed';
        } else {
          this.errorMessage = 'An error occurred';
        }
      }
    },
  },
};
</script>

<style scoped>
.login {
  text-align: center;
}

input {
  display: block;
  margin: 10px auto;
  padding: 10px;
}

button {
  padding: 10px;
}

.error {
  color: red;
}
</style>
