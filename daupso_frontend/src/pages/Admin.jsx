import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3000";

export default function Admin() {
  const [users, setUsers] = useState([]);

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    isAdmin: false,
  });

  const [editingUser, setEditingUser] = useState(null);

  const navigate = useNavigate();

  const adminUserId = localStorage.getItem("userId");
  const userIsAdmin = localStorage.getItem("userIsAdmin") === "true";

  const authHeaders = {
    "Content-Type": "application/json",
    "x-user-id": adminUserId,
  };

  // -------------------------
  // FETCH USERS
  // -------------------------
  const fetchUsers = async () => {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: authHeaders,
    });

    if (!res.ok) {
      alert("Admin access required");
      return;
    }

    const data = await res.json();
    setUsers(data);
  };

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
      headers: authHeaders,
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
      headers: authHeaders,
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
      headers: authHeaders,
    });

    fetchUsers();
  };

  // -------------------------
  // PRODUCTS STATE
  // -------------------------
  const [products, setProducts] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);

  // -------------------------
  // FETCH PRODUCTS
  // -------------------------
  const fetchProducts = async () => {
    const res = await fetch(`${API_BASE}/admin/products`, {
      headers: authHeaders,
    });

    if (!res.ok) {
      alert("Failed to fetch products");
      return;
    }

    const data = await res.json();
    setProducts(data);
  };

  // -------------------------
  // CREATE PRODUCT
  // -------------------------
  const createProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert("Name and price required");
      return;
    }

    const res = await fetch(`${API_BASE}/admin/products`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        ...newProduct,
        price: Number(newProduct.price),
      }),
    });

    if (!res.ok) {
      alert("Failed to create product");
      return;
    }

    setNewProduct({
      name: "",
      price: "",
      category: "",
      description: "",
    });

    fetchProducts();
  };

  // -------------------------
  // UPDATE PRODUCT
  // -------------------------
  const updateProduct = async () => {
    const res = await fetch(
      `${API_BASE}/admin/products/${editingProduct._id}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          name: editingProduct.name,
          price: Number(editingProduct.price),
          category: editingProduct.category,
          description: editingProduct.description,
        }),
      }
    );

    if (!res.ok) {
      alert("Failed to update product");
      return;
    }

    setEditingProduct(null);
    fetchProducts();
  };

  // -------------------------
  // DELETE PRODUCT
  // -------------------------
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    if (!res.ok) {
      alert("Failed to delete product");
      return;
    }

    fetchProducts();
  };

  useEffect(() => {
    if (!adminUserId || !userIsAdmin) {
      navigate("/login");
      return;
    }

    fetchUsers();
    fetchProducts();
  }, []);

  return (
    <>
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
                      <button onClick={() => setEditingUser(null)}>
                        Cancel
                      </button>
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
        <hr />
        <h3>Products</h3>

        {/* CREATE PRODUCT */}
        <input
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <input
          placeholder="Price"
          type="number"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
        <input
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
        />
        <input
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />
        <button onClick={createProduct}>Create Product</button>

        <br />
        <br />

        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  {editingProduct?._id === p._id ? (
                    <input
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    p.name
                  )}
                </td>

                <td>
                  {editingProduct?._id === p._id ? (
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: e.target.value,
                        })
                      }
                    />
                  ) : (
                    `$${p.price}`
                  )}
                </td>

                <td>
                  {editingProduct?._id === p._id ? (
                    <input
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value,
                        })
                      }
                    />
                  ) : (
                    p.category
                  )}
                </td>

                <td>
                  {editingProduct?._id === p._id ? (
                    <input
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    p.description
                  )}
                </td>

                <td>
                  {editingProduct?._id === p._id ? (
                    <>
                      <button onClick={updateProduct}>Save</button>
                      <button onClick={() => setEditingProduct(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditingProduct({ ...p })}>
                        Edit
                      </button>
                      <button onClick={() => deleteProduct(p._id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
