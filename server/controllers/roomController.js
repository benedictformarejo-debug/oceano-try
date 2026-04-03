import { supabase } from '../config/supabase.js';

export const getAllRooms = async (req, res) => {
  try {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
    }

    res.json({
      rooms: rooms.map(r => ({
        id:          r.id,
        name:        r.name,
        capacity:    r.capacity,
        price:       r.price,
        status:      r.status,
        description: r.description,
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: room, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({
      room: {
        id:          room.id,
        name:        room.name,
        capacity:    room.capacity,
        price:       room.price,
        status:      room.status,
        description: room.description,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity, price, status, description } = req.body;

    const validStatuses = ['available', 'occupied', 'maintenance'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updates = {};
    if (name        !== undefined) updates.name        = name;
    if (capacity    !== undefined) updates.capacity    = Number(capacity);
    if (price       !== undefined) updates.price       = Number(price);
    if (status      !== undefined) updates.status      = status;
    if (description !== undefined) updates.description = description;

    const { data: room, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to update room', error: error.message });
    }

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({
      message: 'Room updated successfully',
      room: {
        id:          room.id,
        name:        room.name,
        capacity:    room.capacity,
        price:       room.price,
        status:      room.status,
        description: room.description,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};