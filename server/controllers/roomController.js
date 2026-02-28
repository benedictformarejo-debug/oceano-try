import { supabase } from '../config/supabase.js';

export const getAllRooms = async (req, res) => {
  try {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('*')
      .order('price', { ascending: true });

    if (error) {
      console.error('Supabase get rooms error:', error);
      return res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
    }

    res.json({
      rooms: rooms.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description,
        price: parseFloat(r.price),
        capacity: r.capacity,
        size: r.size,
        amenities: r.amenities,
        image: r.image
      }))
    });
  } catch (error) {
    console.error('Get all rooms error:', error);
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
        id: room.id,
        name: room.name,
        description: room.description,
        price: parseFloat(room.price),
        capacity: room.capacity,
        size: room.size,
        amenities: room.amenities,
        image: room.image
      }
    });
  } catch (error) {
    console.error('Get room by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
