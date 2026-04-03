import { supabase } from '../config/supabase.js';

export const getAllRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('guest_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
    }

    res.json({
      requests: data.map(r => ({
        id:        r.id,
        guest:     r.guest_name,
        room:      r.room_name,
        type:      r.type,
        message:   r.message,
        priority:  r.priority,
        status:    r.status,
        time:      new Date(r.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        createdAt: r.created_at,
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createRequest = async (req, res) => {
  try {
    const { guestName, roomName, type, message, priority } = req.body;

    if (!guestName || !roomName || !type || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const { data, error } = await supabase
      .from('guest_requests')
      .insert([{
        guest_name: guestName,
        room_name:  roomName,
        type,
        message,
        priority:   priority || 'normal',
        status:     'pending',
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to create request', error: error.message });
    }

    res.status(201).json({ message: 'Request created', request: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'in-progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('guest_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to update request', error: error.message });
    }

    res.json({ message: 'Request updated', request: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};