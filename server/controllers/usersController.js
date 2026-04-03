import { supabase } from '../config/supabase.js';

export const getAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }

    res.json({
      users: users.map(u => ({
        id:        u.id,
        name:      u.full_name || u.name || 'Unknown',
        email:     u.email,
        role:      u.role || 'guest',
        status:    u.status || 'active',
        joined:    u.created_at?.split('T')[0],
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['guest', 'staff', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to update role', error: error.message });
    }

    res.json({ message: 'Role updated', user: { id: user.id, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to update status', error: error.message });
    }

    res.json({ message: 'Status updated', user: { id: user.id, status: user.status } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};