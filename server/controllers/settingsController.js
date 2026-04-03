import { supabase } from '../config/supabase.js';

export const getSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error || !data) {
      // Return defaults if no settings row exists yet
      return res.json({
        settings: {
          resortName:   "O'ceano Con Vista Mountain Resort",
          email:        'oceanoconvista@gmail.com',
          phone:        '0926 113 4714',
          address:      'Purok 6, Barangay Aumbay, Island Garden City of Samal, Philippines, 8119',
          checkInTime:  '14:00',
          checkOutTime: '11:00',
          currency:     'PHP',
          taxRate:      '12',
        }
      });
    }

    res.json({
      settings: {
        resortName:   data.resort_name,
        email:        data.email,
        phone:        data.phone,
        address:      data.address,
        checkInTime:  data.check_in_time,
        checkOutTime: data.check_out_time,
        currency:     data.currency,
        taxRate:      data.tax_rate,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { resortName, email, phone, address, checkInTime, checkOutTime, currency, taxRate } = req.body;

    const payload = {
      resort_name:    resortName,
      email,
      phone,
      address,
      check_in_time:  checkInTime,
      check_out_time: checkOutTime,
      currency,
      tax_rate:       taxRate,
      updated_at:     new Date().toISOString(),
    };

    // Check if a settings row exists
    const { data: existing } = await supabase.from('settings').select('id').single();

    let result;
    if (existing) {
      result = await supabase.from('settings').update(payload).eq('id', existing.id).select().single();
    } else {
      result = await supabase.from('settings').insert([payload]).select().single();
    }

    if (result.error) {
      return res.status(500).json({ message: 'Failed to save settings', error: result.error.message });
    }

    res.json({ message: 'Settings saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};