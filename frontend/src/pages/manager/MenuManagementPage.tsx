import { useState, useEffect } from 'react';
import { MenuItem } from '../../types';
import { menuApi } from '../../services/api';
import { Card, Button, Input, Modal } from '../../components/common';

export function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    available: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [items, cats] = await Promise.all([menuApi.getAll(), menuApi.getCategories()]);
      setMenuItems(items);
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: String(item.price),
        category: item.category,
        imageUrl: item.imageUrl || '',
        available: item.available,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: categories[0] || '',
        imageUrl: '',
        available: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      imageUrl: formData.imageUrl || undefined,
      available: formData.available,
    };

    try {
      if (editingItem) {
        const updated = await menuApi.update(editingItem.id, itemData);
        setMenuItems(prev => prev.map(item => (item.id === editingItem.id ? updated : item)));
      } else {
        const newItem = await menuApi.create(itemData);
        setMenuItems(prev => [...prev, newItem]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Failed to save item. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await menuApi.delete(id);
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const updated = await menuApi.update(item.id, { available: !item.available });
      setMenuItems(prev => prev.map(i => (i.id === item.id ? updated : i)));
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="loading-container"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-1">Add, edit, or remove menu items</p>
        </div>
        <Button onClick={() => handleOpenModal()}>Add New Item</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded object-cover" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500 max-w-xs truncate">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>{item.category}</td>
                  <td className="font-medium">${item.price.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`badge cursor-pointer ${item.available ? 'badge-confirmed' : 'badge-cancelled'}`}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpenModal(item)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {menuItems.length === 0 && (
          <div className="p-8 text-center text-gray-500">No menu items found. Add your first item!</div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal} title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />

          <div>
            <label className="input-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="textarea"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Price" name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} required />

            <div>
              <label className="input-label">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="select" required>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                <option value="new">+ Add New Category</option>
              </select>
            </div>
          </div>

          <Input label="Image URL (optional)" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="checkbox"
            />
            <label htmlFor="available" className="text-sm text-gray-700">Item is available</label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingItem ? 'Save Changes' : 'Add Item'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
