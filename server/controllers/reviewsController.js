import { supabase } from '../config/supabase.js';

export const createReview = async (req, res) => {
  try {
    const { bookingId, roomId, roomName, guestName, rating, comment } = req.body;
    const userId = req.userId;

    if (!bookingId || !roomId || !rating) {
      return res.status(400).json({ message: 'Booking ID, room ID and rating are required.' });
    }

    // Check booking belongs to this user and is checked-out
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', userId)
      .eq('status', 'checked-out')
      .single();

    if (bookingError || !booking) {
      return res.status(403).json({ message: 'You can only review completed stays.' });
    }

    // Check if already reviewed
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('booking_id', bookingId)
      .single();

    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this stay.' });
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert([{
        booking_id: bookingId,
        user_id:    userId,
        room_id:    roomId,
        room_name:  roomName,
        guest_name: guestName,
        rating:     parseInt(rating),
        comment:    comment || '',
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ message: 'Failed to create review.', error: error.message });

    res.status(201).json({ message: 'Review submitted!', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getReviewsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ message: 'Failed to fetch reviews.' });
    res.json({ reviews: data || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const userId = req.userId;
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ message: 'Failed to fetch reviews.' });
    res.json({ reviews: data || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ message: 'Failed to fetch reviews.' });
    res.json({ reviews: data || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) return res.status(500).json({ message: 'Failed to delete review.' });
    res.json({ message: 'Review deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};