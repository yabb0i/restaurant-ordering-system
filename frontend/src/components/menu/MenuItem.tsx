import { MenuItem as MenuItemType } from '../../types';
import { Button, Card } from '../common';
import { useCart } from '../../context/CartContext';

interface MenuItemProps {
  item: MenuItemType;
}

export function MenuItem({ item }: MenuItemProps) {
  const { addItem } = useCart();

  return (
    <Card className="flex flex-col h-full">
      {item.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img src={item.imageUrl} alt={item.name} className="menu-item-image" />
        </div>
      )}
      <div className="menu-item-content">
        <div className="menu-item-header">
          <h3 className="menu-item-name">{item.name}</h3>
          <span className="menu-item-price">${item.price.toFixed(2)}</span>
        </div>
        <p className="menu-item-description">{item.description}</p>
        <div className="menu-item-actions">
          {item.available ? (
            <Button variant="primary" className="w-full" onClick={() => addItem(item)}>
              Add to Cart
            </Button>
          ) : (
            <Button variant="outline" className="w-full" disabled>
              Unavailable
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
