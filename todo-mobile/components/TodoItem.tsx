import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface TodoItemProps {
  todo: { _id: string; title: string; completed: boolean };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onToggle(todo._id)}>
        <Text style={[styles.text, todo.completed && styles.completed]}>
          {todo.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(todo._id)}>
        <Text style={styles.delete}>❌</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TodoItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  text: {
    fontSize: 18,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  delete: {
    fontSize: 18,
    color: "red",
  },
});
