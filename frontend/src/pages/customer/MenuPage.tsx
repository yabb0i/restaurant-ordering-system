import { useState, useEffect } from 'react';
import { MenuItem as MenuItemType } from '../../types';
import { menuApi } from '../../services/api';
import { MenuItem, MenuCategory } from '../../components/menu';

export function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [items, cats] = await Promise.all([
          menuApi.getAll(),
          menuApi.getCategories(),
        ]);
        setMenuItems(items);
        setCategories(cats);
      } catch (error) {
        console.error('Failed to load menu:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  if (loading) {
    return (
      <div className="container py-8">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Menu</h1>
        <p className="text-gray-600">Discover our delicious selection of dishes</p>
      </div>

      <MenuCategory
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found in this category.</p>
        </div>
      )}
    </div>
  );
}
