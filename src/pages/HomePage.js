import React, { useState, useEffect } from 'react';

function UserList({ data, handleDelete, handleEdit }) {
  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>
          {item.name} - {item.age} - {item.email}
          <button onClick={() => handleDelete(item.id)}>Delete</button>
          <button onClick={() => handleEdit(item)}>Edit</button>
        </li>
      ))}
    </ul>
  );
}

const HomePage = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetch('https://64307682b289b1dec4c8c113.mockapi.io/users')
      .then((response) => response.json())
      .then((json) => setData(json));
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isEdit) {
      // Perform update operation
      fetch(`https://64307682b289b1dec4c8c113.mockapi.io/users/${formData.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => setData(data.map((item) => (item.id === json.id ? json : item))))
        .then(() => setIsEdit(false))
        .then(() => setFormData({ name: '', age: '', email: '' }));
    } else {
      // Perform create operation
      fetch('https://64307682b289b1dec4c8c113.mockapi.io/users', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => setData([...data, json]))
        .then(() => setFormData({ name: '', age: '', email: '' }));
    }
  };

  const handleDelete = (id) => {
    // Perform delete operation
    fetch(`https://64307682b289b1dec4c8c113.mockapi.io/users/${id}`, {
      method: 'DELETE',
    }).then(() => setData(data.filter((item) => item.id !== id)));
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setFormData(item);
  };

  return (
    <div>
      <h1>Users</h1>
      <UserList data={data} handleDelete={handleDelete} handleEdit={handleEdit} />
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input type="text" name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

export default HomePage;
