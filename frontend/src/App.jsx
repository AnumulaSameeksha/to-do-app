import { useEffect, useState } from "react";
import API from "./api";

export default function App() {
  const [tasks, setTasks] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Low",
    due_date: "",
  });

  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  // 🔹 Fetch tasks
  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔹 Add Task
  const addTask = async () => {
    if (!form.title) return;

    await API.post("/tasks", {
      ...form,
    });

    resetForm();
    fetchTasks();
  };

  // 🔹 Update Task (Edit)
  const updateTask = async () => {
    await API.put(`/tasks/${editingId}`, {
      ...form,
      completed: false,
    });

    setEditingId(null);
    resetForm();
    fetchTasks();
  };

  // 🔹 Toggle Complete
  const toggleComplete = async (task) => {
    await API.put(`/tasks/${task.id}`, {
      ...task,
      completed: !task.completed,
    });

    fetchTasks();
  };

  // 🔹 Delete
  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  // 🔹 Reset Form
  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      priority: "Low",
      due_date: "",
    });
  };

  // 🔹 Filter Logic
  const filteredTasks = tasks.filter((task) => {
    if (filter === "Completed") return task.completed;
    if (filter === "Pending") return !task.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>To-Do App</h1>

      {/* 🔹 FORM */}
      <div className="form">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <select
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
          }
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        {/* ✅ Due Date */}
        <input
          type="date"
          value={form.due_date}
          onChange={(e) =>
            setForm({ ...form, due_date: e.target.value })
          }
        />

        <button onClick={editingId ? updateTask : addTask}>
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* 🔹 FILTERS */}
      <div className="filters">
        {["All", "Completed", "Pending"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* 🔹 TASK LIST */}
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className={`task ${task.completed ? "done" : ""}`}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>

          {/* ✅ Due Date Display */}
          {task.due_date && <p>📅 Due: {task.due_date}</p>}

          <span className={`priority ${task.priority}`}>
            {task.priority}
          </span>

          <div>
            <button onClick={() => toggleComplete(task)}>
              {task.completed ? "Undo" : "Done"}
            </button>

            <button
              onClick={() => {
                setEditingId(task.id);
                setForm({
                  title: task.title,
                  description: task.description || "",
                  priority: task.priority,
                  due_date: task.due_date || "",
                });
              }}
            >
              Edit
            </button>

            <button onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}