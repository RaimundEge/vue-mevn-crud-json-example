<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> &nbsp;|&nbsp;
      <router-link to="/about">About</router-link> &nbsp;|&nbsp;
      <router-link to="/register">Registration</router-link> &nbsp;|&nbsp;
      <div v-if="user">
        <router-link to="/content">Content</router-link> &nbsp;|&nbsp;
      </div>
      <div v-if='user' class="logout-button" @click="logout">Logout</div>
      <router-link to="/login" v-else>Login</router-link>
    </div>
    <router-view :user=user @updateUser="updateUser"/>
  </div>
</template>

<script>
export default {
  data() {
    return { user: null };
  },
  methods: {
      updateUser(user) {
        this.user = user;
      },
      logout() {
        this.user = null;
        this.$router.push("/");
      }
    }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  display: inline-flex;
}

#nav a, .logout-button {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: underline;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
