import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import axios from "axios";
import TodoItem from "../components/TodoItem";

const API_URL = "http://localhost:4000/todos"; // backend runs on port 4000

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  // Add new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const res = await axios.post(API_URL, { title: newTodo });
      setTodos([...todos, res.data]); // push new todo
      setNewTodo("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // Toggle todo
  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find((t) => t._id === id);
      if (!todo) return;
      const res = await axios.put(`${API_URL}/${id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Error toggling todo:", err);
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo App</Text>

      {/* Input for new todo */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new todo"
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Todo List */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} />
        )}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addText: {
    color: "#fff",
    fontSize: 20,
  },
});
