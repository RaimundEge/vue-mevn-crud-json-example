<template>
  <center>
    <div v-if="isAdmin()">
      <h3>Manage Users:</h3>
      <div id="body">
        <div id="left">
          <div v-for="user in userList" :key="user._id">
            {{ user.name }} <button @click="editUser(user)">Edit</button> <button @click="deleteUser(user)">Delete</button>
          </div>
        </div>
        <div id="right" v-if="current">
          <label>Name:</label> {{ current.name }}<br>
          <label>New Password:</label><input type="password" v-model="pwd" id="pwd" />
          <label>Roles:</label>
          <div v-for="(role, index) in current.roles" :key="index">
          {{ role }} <button @click="removeRoll(role)" :disabled="current.roles.length==1">remove</button>
          </div>
           <label>New roles:</label><select v-model="role">
        <option value="admin">Administrator</option>
        <option value="cust">Customer</option>
        </select> <button @click="addRole">add role</button>
        <br>
          <button @click="updateUser">Update</button>
        </div>     
      </div>
    </div>
    <div v-else>
      <h3>Please register:</h3>
      <label>Name:</label> <input v-model="name" /> &nbsp;
      <label>Password:</label>
      <input type="password" v-model="pwd" id="pwd"/> &nbsp; 
      Main role:<select v-model="role">
        <option value="admin">Administrator</option>
        <option value="cust">Customer</option>
        </select> &nbsp;
      <button @click="register">Register</button>
      <div class="error">{{ error }}</div>
    </div>
  </center>
</template>

<script>
export default {
  props: {
    user: Object,
  },
  data() {
    return { name: "", pwd: "", role: "cust", error: "", list: null, current: null };
  },
  methods: {
    async register() {
      try {
        var response = await fetch(`http://localhost:9000/api/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: this.name,
            password: this.pwd,
            roles: [this.role],
          }),
        });
        var data = await response.json();
        if (response.status == 201) {
          console.log(response.status, "Data:", data);
          alert(`User(${this.role}) ${this.name} created`);
          this.name = "";
          this.pwd = "";
          this.role = "cust";
          this.error = "";
          this.$router.push("/");
        } else {
          this.error = data.msg;
        }
      } catch (err) {
        console.log("Error: ", err);
      }
    },
    isAdmin() {
      if (this.user && this.user.user.roles.includes("admin")) {
        return true;
      } else {
        return false;
      }
    },
    async getList() {
      try {
        var response = await fetch(`http://localhost:9000/api/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.user.token,
          },
        });
        this.list = await response.json();
      } catch (err) {
        console.log("Error: ", err);
      }
    },
    async deleteUser(user) {
      var response = await fetch(`http://localhost:9000/api/${user._id}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + this.user.token,
          },
        });
      if (response.status == 200) {
        alert(`user ${user.name} removed`);
        this.getList();
      }
      console.log(response)
    },
    editUser(user) {
      console.log(user)
      this.current = user
    },
    addRole() {
      if (!this.current.roles.includes(this.role)) {
        this.current.roles.push(this.role);
      }
    },
    removeRoll(role) {
      var index = this.current.roles.indexOf(role);
      if (index >= 0) {
        this.current.roles.splice(index, 1);
      }
    },
    async updateUser() {
      if (this.pwd != "") {
        this.current.password = "NEW:" + this.pwd;
      }
      console.log(this.current);
      try {
        var response = await fetch(`http://localhost:9000/api/${this.current._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.current),
        });
        var data = await response.json();       
        console.log(response.status, "Data:", data);
        this.pwd = "";
        this.current = null;
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  },
  computed: {
    userList() {
      if (this.list == null) {
        this.getList();
      }
      return this.list;
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
}
#body {
  display: flex;
  width: 500px;
}
#pwd {
  width: 150px;
}
#left {
  width: 200px;
}
#right {
  width: 300px;
  border: 2px solid black;
}
</style>
