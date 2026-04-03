import { supabase } from '../config/supabase.js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const generateRefCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `OCV-${code}`;
};

const sendConfirmationEmail = async (booking) => {
  try {
    await resend.emails.send({
      from:    'Oceano Con Vista <no-reply@oceanoconvista.com>',
      to:      booking.email,
      subject: `Booking Confirmation – ${booking.refCode}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#0e7490;margin-bottom:4px;">Booking Confirmed! 🎉</h2>
          <p style="color:#6b7280;margin-bottom:24px;">Thank you for choosing Oceano Con Vista, ${booking.fullName}!</p>
          <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
            <p style="color:#6b7280;font-size:12px;margin:0 0 4px;">Your Booking Reference</p>
            <p style="color:#0e7490;font-size:28px;font-weight:bold;margin:0;letter-spacing:2px;">${booking.refCode}</p>
            <p style="color:#9ca3af;font-size:11px;margin:8px 0 0;">Keep this code to manage your booking</p>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 0;color:#6b7280;">Room</td>
              <td style="padding:10px 0;font-weight:600;text-align:right;">${booking.roomName}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 0;color:#6b7280;">Check-In</td>
              <td style="padding:10px 0;font-weight:600;text-align:right;">${booking.checkIn}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 0;color:#6b7280;">Check-Out</td>
              <td style="padding:10px 0;font-weight:600;text-align:right;">${booking.checkOut}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 0;color:#6b7280;">Guests</td>
              <td style="padding:10px 0;font-weight:600;text-align:right;">${booking.guests}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#6b7280;">Total</td>
              <td style="padding:10px 0;font-weight:700;color:#0e7490;text-align:right;">₱${Number(booking.totalPrice).toLocaleString()}</td>
            </tr>
          </table>
          <div style="margin-top:24px;padding:16px;background:#fefce8;border-radius:8px;font-size:13px;color:#92400e;">
            💡 To view or cancel your booking, visit our website and click <strong>"Manage Booking"</strong> — enter your reference code and email.
          </div>
          <p style="margin-top:24px;font-size:12px;color:#9ca3af;text-align:center;">
            Oceano Con Vista · We look forward to hosting you!
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
};

export const createBooking = async (req, res) => {
  try {
    const {
      roomId, roomName, checkIn, checkOut, guests, totalPrice,
      fullName, email, phone, specialRequest, paymentType, status,
      userId, arrivalTime, // ← ADD arrivalTime
    } = req.body;

    if (!roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const refCode = generateRefCode();

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([{
        room_id:         roomId,
        room_name:       roomName,
        check_in:        checkIn,
        check_out:       checkOut,
        guests,
        total_price:     totalPrice,
        full_name:       fullName,
        email,
        phone,
        special_request: specialRequest,
        payment_type:    paymentType,
        status:          status || 'pending',
        ref_code:        refCode,
        user_id:         userId || null, // ← save user_id if logged in
        arrival_time:    arrivalTime || '14:00',
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase booking error:', error);
      return res.status(500).json({ message: 'Failed to create booking', error: error.message });
    }

    if (email) {
      await sendConfirmationEmail({ fullName, email, roomName, checkIn, checkOut, guests, totalPrice, refCode });
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id:          booking.id,
        roomId:      booking.room_id,
        roomName:    booking.room_name,
        checkIn:     booking.check_in,
        checkOut:    booking.check_out,
        guests:      booking.guests,
        totalPrice:  booking.total_price,
        fullName:    booking.full_name,
        email:       booking.email,
        phone:       booking.phone,
        paymentType: booking.payment_type,
        status:      booking.status,
        refCode:     booking.ref_code,
        createdAt:   booking.created_at,
        arrivalTime: booking.arrival_time,
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBookingByRef = async (req, res) => {
  try {
    const { refCode, email } = req.query;

    if (!refCode || !email) {
      return res.status(400).json({ message: 'Reference code and email are required' });
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('ref_code', refCode.toUpperCase())
      .eq('email',    email.toLowerCase())
      .single();

    if (error || !booking) {
      return res.status(404).json({ message: 'Booking not found. Please check your reference code and email.' });
    }

    res.json({
      booking: {
        id:             booking.id,
        roomName:       booking.room_name,
        checkIn:        booking.check_in,
        checkOut:       booking.check_out,
        guests:         booking.guests,
        totalPrice:     booking.total_price,
        fullName:       booking.full_name,
        email:          booking.email,
        phone:          booking.phone,
        paymentType:    booking.payment_type,
        specialRequest: booking.special_request,
        status:         booking.status,
        refCode:        booking.ref_code,
        createdAt:      booking.created_at,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const cancelBookingByRef = async (req, res) => {
  try {
    const { refCode, email } = req.body;

    if (!refCode || !email) {
      return res.status(400).json({ message: 'Reference code and email are required' });
    }

    const { data: existing, error: findError } = await supabase
      .from('bookings')
      .select('*')
      .eq('ref_code', refCode.toUpperCase())
      .eq('email',    email.toLowerCase())
      .single();

    if (findError || !existing) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (existing.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled.' });
    }

    if (['checked-in', 'checked-out'].includes(existing.status)) {
      return res.status(400).json({ message: 'Cannot cancel a booking that is already checked in.' });
    }

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', existing.id);

    if (updateError) {
      return res.status(500).json({ message: 'Failed to cancel booking.' });
    }

    res.json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.userId;

    // Get the logged-in user's email as fallback
    const { data: userRow } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    // Match by user_id OR email — catches bookings made before login too
    if (userRow?.email) {
      query = query.or(`user_id.eq.${userId},email.eq.${userRow.email}`);
    } else {
      query = query.eq('user_id', userId);
    }

    const { data: bookings, error } = await query;

    if (error) return res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });

    res.json({
      bookings: bookings.map(b => ({
        id:             b.id,
        userId:         b.user_id,
        roomId:         b.room_id,
        roomName:       b.room_name,
        checkIn:        b.check_in,
        checkOut:       b.check_out,
        guests:         b.guests,
        totalPrice:     b.total_price,
        fullName:       b.full_name,
        email:          b.email,
        paymentType:    b.payment_type,
        specialRequest: b.special_request,
        status:         b.status,
        refCode:        b.ref_code,
        createdAt:      b.created_at,
        arrivalTime:    b.arrival_time,
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });

    res.json({
      bookings: bookings.map(b => ({
        id:             b.id,
        userId:         b.user_id,
        roomId:         b.room_id,
        roomName:       b.room_name,
        checkIn:        b.check_in,
        checkOut:       b.check_out,
        guests:         b.guests,
        totalPrice:     b.total_price,
        fullName:       b.full_name,
        email:          b.email,
        phone:          b.phone,
        paymentType:    b.payment_type,
        specialRequest: b.special_request,
        status:         b.status,
        refCode:        b.ref_code,
        createdAt:      b.created_at,
        arrivalTime:    b.arrival_time,
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const modifyBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, guests, specialRequest } = req.body;

    const { data: existing } = await supabase
      .from('bookings').select('room_id').eq('id', id).single();

    if (!existing) return res.status(404).json({ message: 'Booking not found.' });

    const { data: conflicts } = await supabase
      .from('bookings').select('id')
      .eq('room_id', existing.room_id).neq('id', id)
      .in('status', ['pending', 'confirmed', 'checked-in'])
      .or(`check_in.lte.${checkOut},check_out.gte.${checkIn}`);

    if (conflicts && conflicts.length > 0)
      return res.status(409).json({ message: 'Selected dates are not available. Please choose different dates.' });

    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ check_in: checkIn, check_out: checkOut, guests, special_request: specialRequest })
      .eq('id', id).select().single();

    if (error) return res.status(500).json({ message: 'Failed to modify booking.' });
    res.json({ message: 'Booking modified successfully.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'checked-in', 'checked-out'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const { data: booking, error } = await supabase
      .from('bookings').update({ status }).eq('id', id).select().single();

    if (error) return res.status(500).json({ message: 'Failed to update booking', error: error.message });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({ message: 'Booking status updated', booking: { id: booking.id, status: booking.status } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) return res.status(500).json({ message: 'Failed to delete booking', error: error.message });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBookedDates = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { data, error } = await supabase
  .from('bookings')
  .select('check_in, check_out')
  .eq('room_id', roomId)
  .in('status', ['pending', 'confirmed', 'checked-in']);

    if (error) return res.status(500).json({ message: 'Failed to fetch booked dates' });

    const bookedDates = [];
    data.forEach(booking => {
      const start = new Date(booking.check_in);
      const end   = new Date(booking.check_out);
      const curr  = new Date(start);
      while (curr <= end) {
        bookedDates.push(curr.toISOString().split('T')[0]);
        curr.setDate(curr.getDate() + 1);
      }
    });

    res.json({ bookedDates });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};