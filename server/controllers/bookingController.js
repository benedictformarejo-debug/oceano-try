import { supabase } from '../config/supabase.js';

export const createBooking = async (req, res) => {
  try {
    const { roomId, roomName, checkIn, checkOut, guests, totalPrice } = req.body;

    // Validation
    if (!roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create booking in Supabase
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: req.userId,
          room_id: roomId,
          room_name: roomName,
          check_in: checkIn,
          check_out: checkOut,
          guests,
          total_price: totalPrice,
          status: 'confirmed'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase booking error:', error);
      return res.status(500).json({ message: 'Failed to create booking', error: error.message });
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: booking.id,
        userId: booking.user_id,
        roomId: booking.room_id,
        roomName: booking.room_name,
        checkIn: booking.check_in,
        checkOut: booking.check_out,
        guests: booking.guests,
        totalPrice: booking.total_price,
        status: booking.status,
        createdAt: booking.created_at
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase get bookings error:', error);
      return res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }

    res.json({
      bookings: bookings.map(b => ({
        id: b.id,
        userId: b.user_id,
        roomId: b.room_id,
        roomName: b.room_name,
        checkIn: b.check_in,
        checkOut: b.check_out,
        guests: b.guests,
        totalPrice: b.total_price,
        status: b.status,
        createdAt: b.created_at
      }))
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase get all bookings error:', error);
      return res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }

    res.json({
      bookings: bookings.map(b => ({
        id: b.id,
        userId: b.user_id,
        roomId: b.room_id,
        roomName: b.room_name,
        checkIn: b.check_in,
        checkOut: b.check_out,
        guests: b.guests,
        totalPrice: b.total_price,
        status: b.status,
        createdAt: b.created_at
      }))
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
