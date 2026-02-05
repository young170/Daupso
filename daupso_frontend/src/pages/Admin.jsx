import { useEffect, useState } from "react";

const API_BASE = "http://localhost:3000";

export default function Admin() {
  const [users, setUsers] = useState([]);

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    isAdmin: false,
  });

  const [editingUser, setEditingUser] = useState(null);

  // 🔑 admin user id (set this after login)
  const adminUserId = localStorage.getItem("userId");

  const headers = {
    "Content-Type": "application/json",
    "x-user-id": adminUserId,
  };

  // -------------------------
  // FETCH USERS
  // -------------------------
  const fetchUsers = async () => {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers,
    });

    if (!res.ok) {
      alert("Admin access required");
      return;
    }

    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  });

  // -------------------------
  // CREATE USER
  // -------------------------
  const createUser = async () => {
    if (!newUser.email || !newUser.password) {
      alert("Email and password required");
      return;
    }

    await fetch(`${API_BASE}/admin/users`, {
      method: "POST",
      headers,
      body: JSON.stringify(newUser),
    });

    setNewUser({ email: "", password: "", isAdmin: false });
    fetchUsers();
  };

  // -------------------------
  // UPDATE USER
  // -------------------------
  const updateUser = async () => {
    await fetch(`${API_BASE}/admin/users/${editingUser._id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        email: editingUser.email,
        isAdmin: editingUser.isAdmin,
      }),
    });

    setEditingUser(null);
    fetchUsers();
  };

  // -------------------------
  // DELETE USER
  // -------------------------
  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;

    await fetch(`${API_BASE}/admin/users/${id}`, {
      method: "DELETE",
      headers,
    });

    fetchUsers();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Panel – Users</h2>

      {/* CREATE USER */}
      <h3>Create User</h3>
      <input
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      />
      <label>
        <input
          type="checkbox"
          checked={newUser.isAdmin}
          onChange={(e) =>
            setNewUser({ ...newUser, isAdmin: e.target.checked })
          }
        />
        Admin
      </label>
      <button onClick={createUser}>Create</button>

      <hr />

      {/* USERS TABLE */}
      <h3>Existing Users</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Email</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>
                {editingUser?._id === u._id ? (
                  <input
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        email: e.target.value,
                      })
                    }
                  />
                ) : (
                  u.email
                )}
              </td>

              <td>
                {editingUser?._id === u._id ? (
                  <input
                    type="checkbox"
                    checked={editingUser.isAdmin}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        isAdmin: e.target.checked,
                      })
                    }
                  />
                ) : u.isAdmin ? (
                  "Yes"
                ) : (
                  "No"
                )}
              </td>

              <td>
                {editingUser?._id === u._id ? (
                  <>
                    <button onClick={updateUser}>Save</button>
                    <button onClick={() => setEditingUser(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingUser(u)}>Edit</button>
                    <button onClick={() => deleteUser(u._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
