<template>
  <center>
    <h3>Please login:</h3>
    <div class="modal-body edit-list">
      <label>Name:</label> <input v-model="name" /> <br />
      <label>Password:</label>
      <input type="password" v-model="pwd" />
    </div>
    <div class="error">{{ error }}</div>
    <button @click="login">Login</button>
  </center>
</template>

<script>
export default {
  data() {
    return { name: "", pwd: "", error: "" };
  },
  methods: {
    async login() {
      try {
        var response = await fetch(`http://localhost:9000/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: this.name, password: this.pwd }),
        });
        var data = await response.json();
        console.log(response.status, "Data: ", data);
        if (response.status == 200) { 
          this.$emit('updateUser', data);        
          alert(`User(${data.user.roles[0]}) ${this.name} login successful`);
          this.$router.push('/');
        } else {
          this.error = data.msg;
        }
      } catch (err) {
        console.log("Error: ", err);
      }
    },
  },
};
</script>

<style scoped></style>
