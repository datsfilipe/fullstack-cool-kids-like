<script setup lang="ts">
import { ref } from "vue";

type User = {
  id: string;
  name: string;
  email: string;
  banned: boolean;
};


function handleBanUser(id: string) {
  const mutation = `
    mutation {
      banUser(id: "${id}") {
      }
    }
  `;

  fetch('http://localhost:8080/graphql', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: mutation }),
  });
}

function openDialog() {
  const dialog = document.querySelector("dialog");
  dialog?.showModal();
}

function closeDialog() {
  const dialog = document.querySelector("dialog");
  dialog?.close();
}

function handleAddUser(event: MouseEvent) {
  event.preventDefault();

  const form = document.querySelector("form");
  const formData = new FormData(form as HTMLFormElement);
  const name = formData.get("name");
  const email = formData.get("email");

  const mutation = `
    mutation {
      createUser(name: "${name}", email: "${email}") {
        id
        name
        email
        banned
      }
    }
  `;

  fetch('http://localhost:8080/graphql', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: mutation }),
  });
}

const users = ref<User[]>([]);

const fetchUsers = async () => {
  const query = `
    query {
      user {
        id
        name
        email
        banned
      }
    }
  `;

  const response = await fetch(`http://localhost:8080/graphql?query=${query}`);
  const { data } = await response.json();
  users.value = data.user;
};

fetchUsers();
</script>

<template>
  <div>
    <h1>Users</h1>
    <table v-if="users.length">
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>email</th>
          <th>banned</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td
            @click="handleBanUser(user.id)"
          >{{ user.banned }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <dialog>
    <form>
      <label for="name">Name</label>
      <input
        type="text"
        id="name"
        name="name"
      />
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
      />
      <div>
        <button
          type="button"
          @click="closeDialog"
        >Cancel</button>
        <button
          type="submit"
          @click="(event) => handleAddUser(event)"
        >Add User</button>
      </div>
    </form>
  </dialog>
  <button
    type="button"
    @click="openDialog"
  >Add User</button>
</template>

<style scoped>
table {
  border-collapse: collapse;
}

td, th {
  border: 1px solid black;
  padding: 0.5rem;
}

dialog {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

form {
  width: 50%;
  height: 50%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1rem;
}

form > div {
  display: flex;
  justify-content: flex-end;
}

form > div > button {
  margin-left: 1rem;
}

form > label {
  display: block;
  margin-bottom: 0.5rem;
}

form > input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
}

form > input:focus {
  outline: none;
}
</style>
