import { useState, useEffect } from 'react';
import { Table, Reservation } from '../../types';
import { tableApi, reservationApi } from '../../services/api';
import { Card, Button, Modal } from '../../components/common';

export function AssignTablePage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tablesData, reservationsData] = await Promise.all([
        tableApi.getAll(),
        reservationApi.getAll(),
      ]);
      setTables(tablesData);
      setReservations(reservationsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (tableId: string, status: Table['status']) => {
    try {
      const updated = await tableApi.updateStatus(tableId, status);
      setTables(prev => prev.map(t => (t.id === tableId ? updated : t)));
    } catch (error) {
      console.error('Failed to update table status:', error);
    }
  };

  const handleAssignTable = async (reservationId: string) => {
    if (!selectedTable) return;
    try {
      await tableApi.assignToReservation(selectedTable.id, reservationId);
      await loadData();
      setShowAssignModal(false);
      setSelectedTable(null);
    } catch (error) {
      console.error('Failed to assign table:', error);
    }
  };

  const pendingReservations = reservations.filter(
    r => r.status === 'pending' || (r.status === 'confirmed' && !r.tableId)
  );

  if (loading) {
    return (
      <div className="container py-8">
        <div className="loading-container"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Table Management</h1>
        <p className="text-gray-600 mt-1">Manage table status and assignments</p>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="table-status-dot table-status-available" style={{ margin: 0 }}></div>
          <span className="text-sm text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="table-status-dot table-status-occupied" style={{ margin: 0 }}></div>
          <span className="text-sm text-gray-600">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="table-status-dot table-status-reserved" style={{ margin: 0 }}></div>
          <span className="text-sm text-gray-600">Reserved</span>
        </div>
      </div>

      {/* Tables grid */}
      <div className="grid grid-cols-2 md-grid-cols-4 gap-6 mb-8">
        {tables.map(table => (
          <Card key={table.id} className="p-6 text-center" hover>
            <div className={`table-status-dot table-status-${table.status}`}></div>
            <h3 className="text-2xl font-bold text-gray-900">Table {table.number}</h3>
            <p className="text-gray-600 mb-4">Capacity: {table.capacity}</p>
            <p className="text-sm text-gray-500 capitalize mb-4">{table.status}</p>

            <div className="space-y-2">
              {table.status === 'available' && (
                <>
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full"
                    onClick={() => { setSelectedTable(table); setShowAssignModal(true); }}
                  >
                    Assign
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleStatusChange(table.id, 'occupied')}
                  >
                    Mark Occupied
                  </Button>
                </>
              )}
              {table.status === 'occupied' && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleStatusChange(table.id, 'available')}
                >
                  Mark Available
                </Button>
              )}
              {table.status === 'reserved' && (
                <>
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full"
                    onClick={() => handleStatusChange(table.id, 'occupied')}
                  >
                    Seat Guests
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleStatusChange(table.id, 'available')}
                  >
                    Release
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Assign Table Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => { setShowAssignModal(false); setSelectedTable(null); }}
        title={`Assign Table ${selectedTable?.number}`}
      >
        {pendingReservations.length > 0 ? (
          <div className="space-y-4">
            <p className="text-gray-600">Select a reservation to assign to this table:</p>
            {pendingReservations.map(res => (
              <div
                key={res.id}
                className="p-4 border rounded cursor-pointer"
                onClick={() => handleAssignTable(res.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{res.customerName}</p>
                    <p className="text-sm text-gray-600">{res.date} at {res.time}</p>
                    <p className="text-sm text-gray-600">{res.partySize} guests</p>
                  </div>
                  <Button size="sm" variant="primary">Assign</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No pending reservations to assign</p>
        )}
      </Modal>
    </div>
  );
}
