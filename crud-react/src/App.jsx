import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const USER_API = "http://localhost:5000/users";
const TODO_API = "http://localhost:5000/todos";

function App() {
  const [users, setUsers] = useState([]);
  const [todos, setTodos] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [title, setTitle] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchTodos();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(USER_API);
    setUsers(res.data);
  };

  const fetchTodos = async () => {
    const res = await axios.get(TODO_API);
    setTodos(res.data);
  };

  // ADD USER
  const addUser = async () => {
    if (!name || !email) return;

    const res = await axios.post(USER_API, {
      name,
      email
    });

    setUsers([...users, res.data]);
    setName("");
    setEmail("");
  };

  // ADD TODO
  const addTodo = async () => {
    if (!title || !selectedUser) return;

    const res = await axios.post(TODO_API, {
      title,
      completed: false,
      userId: Number(selectedUser)
    });

    setTodos([...todos, res.data]);
    setTitle("");
  };

  return (
    <div className="container">
      <h1>User & Todo Management</h1>

      {/* Add User */}
      <h2>Add User</h2>
      <div className="form-section">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={addUser}>Add User</button>
      </div>

      {/* Users Table */}
      <h2>Users List</h2>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Total Todos</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const userTodos = todos.filter(
              (todo) => todo.userId === user.id
            );

            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{userTodos.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add Todo */}
      <h2>Add Todo</h2>
      <div className="form-section">
        <input
          placeholder="Todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <button onClick={addTodo}>Add Todo</button>
      </div>

      {/* Todo Table */}
      <h2>Todo Details</h2>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Completed</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => {
            const user = users.find(
              (u) => u.id === todo.userId
            );

            return (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.title}</td>
                <td>{todo.completed ? "Yes" : "No"}</td>
                <td>{user ? user.name : "Unknown"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;