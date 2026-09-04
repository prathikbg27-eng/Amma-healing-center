/**
 * Amma Healing Center - Supabase Integration Client
 * Handles Appointment Submissions, Supabase Authentication & Admin Operations
 */

(function (window) {
  // Read configuration from SITE_CONFIG, window.SITE_CONFIG, or environment variables
  const config = window.SITE_CONFIG || (typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {});
  const supabaseUrl = (
    config.supabaseUrl ||
    (typeof window !== 'undefined' && window.SUPABASE_URL) ||
    (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : '') ||
    ''
  ).trim();

  const supabaseAnonKey = (
    config.supabaseAnonKey ||
    (typeof window !== 'undefined' && window.SUPABASE_ANON_KEY) ||
    (typeof SUPABASE_ANON_KEY !== 'undefined' ? SUPABASE_ANON_KEY : '') ||
    ''
  ).trim();

  let supabaseClient = null;

  /**
   * Check if Supabase credentials are validly configured
   */
  function isConfigured() {
    return Boolean(
      supabaseUrl &&
      supabaseAnonKey &&
      supabaseUrl.startsWith('https://') &&
      !supabaseUrl.includes('your-supabase-project-id') &&
      !supabaseAnonKey.includes('your-supabase-anon-key-placeholder')
    );
  }

  /**
   * Get or initialize Supabase Client
   */
  function getClient() {
    if (supabaseClient) return supabaseClient;

    if (window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        if (isConfigured()) {
          supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
              persistSession: true,
              autoRefreshToken: true,
              detectSessionInUrl: true,
              storage: window.localStorage
            }
          });
        }
      } catch (err) {
        console.error('[Amma Healing Center] Supabase client initialization error:', err);
      }
    }
    return supabaseClient;
  }

  /**
   * Indian Mobile Number Validation
   */
  function validateIndianPhone(phone) {
    if (!phone) return { isValid: false, message: 'Phone number is required.' };
    const cleaned = phone.replace(/[\s\-()]/g, '');
    const regex = /^(?:(?:\+|0{0,2})91|0)?[6-9]\d{9}$/;
    if (!regex.test(cleaned)) {
      return {
        isValid: false,
        message: 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210 or +91 9876543210).'
      };
    }
    const last10 = cleaned.slice(-10);
    return { isValid: true, standardized: `+91 ${last10}`, raw10: last10 };
  }

  /**
   * Appointment Date Validation
   */
  function validateAppointmentDate(dateStr) {
    if (!dateStr) return { isValid: false, message: 'Preferred appointment date is required.' };
    const selectedDate = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
      return { isValid: false, message: 'Please select a valid calendar date.' };
    }
    if (selectedDate < today) {
      return { isValid: false, message: 'Appointment date cannot be in the past.' };
    }
    return { isValid: true, date: dateStr };
  }

  /**
   * Submit Appointment (Public Booking Form)
   */
  async function submitAppointment(data) {
    const name = (data.full_name || '').trim();
    if (!name || name.length < 2) {
      return { success: false, error: 'Please enter your full name (at least 2 characters).' };
    }

    const phoneValidation = validateIndianPhone(data.phone);
    if (!phoneValidation.isValid) {
      return { success: false, error: phoneValidation.message };
    }

    const therapy = (data.therapy || '').trim();
    if (!therapy) {
      return { success: false, error: 'Please select a therapy or consultation.' };
    }

    const dateValidation = validateAppointmentDate(data.appointment_date);
    if (!dateValidation.isValid) {
      return { success: false, error: dateValidation.message };
    }

    const preferred_time = (data.preferred_time || '').trim();
    if (!preferred_time) {
      return { success: false, error: 'Please select a preferred time slot.' };
    }

    const concern = (data.concern || '').trim();

    const payload = {
      full_name: name,
      phone: phoneValidation.standardized,
      therapy: therapy,
      appointment_date: dateValidation.date,
      preferred_time: preferred_time,
      concern: concern || 'None specified',
      status: 'pending'
    };

    const client = getClient();
    if (!client || !isConfigured()) {
      return {
        success: false,
        error: 'Database connection is not configured. Please set your Supabase credentials in js/config.js.'
      };
    }

    try {
      const { data: insertedData, error } = await client
        .from('appointments')
        .insert([payload])
        .select();

      if (error) {
        console.error('[Supabase Insert Error]', error);
        return {
          success: false,
          error: error.message || 'Failed to save appointment to the database.'
        };
      }

      return {
        success: true,
        data: insertedData && insertedData[0] ? insertedData[0] : payload
      };
    } catch (err) {
      console.error('[Supabase Submission Exception]', err);
      return {
        success: false,
        error: err.message || 'A network error occurred while submitting your appointment.'
      };
    }
  }

  /**
   * Admin: Supabase Authentication Sign In
   */
  async function adminSignIn(email, password) {
    if (!isConfigured()) {
      return {
        success: false,
        error: 'Supabase credentials are not configured. Please set your SUPABASE_URL and SUPABASE_ANON_KEY in js/config.js.'
      };
    }

    const client = getClient();
    if (!client) {
      return {
        success: false,
        error: 'Failed to initialize Supabase client. Please check your network connection.'
      };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Invalid email or password.'
        };
      }

      return {
        success: true,
        session: data.session,
        user: data.user
      };
    } catch (err) {
      console.error('[Supabase Auth Error]', err);
      return {
        success: false,
        error: err.message || 'An unexpected error occurred during sign in.'
      };
    }
  }

  /**
   * Admin: Supabase Authentication Sign Out
   */
  async function adminSignOut() {
    const client = getClient();
    if (client && isConfigured()) {
      try {
        await client.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    return { success: true };
  }

  /**
   * Admin: Check Current Active Session
   */
  async function getAdminUser() {
    if (!isConfigured()) {
      return { user: null, configured: false };
    }

    const client = getClient();
    if (!client) {
      return { user: null, configured: false };
    }

    try {
      const { data, error } = await client.auth.getSession();
      if (error || !data || !data.session || !data.session.user) {
        return { user: null, configured: true };
      }
      return { user: data.session.user, session: data.session, configured: true };
    } catch (e) {
      console.warn('Session verification exception:', e);
      return { user: null, configured: true };
    }
  }

  /**
   * Admin: Fetch Appointments with Filters, Search & Date
   */
  async function fetchAppointments(options = {}) {
    const { status = 'all', search = '', date = '' } = options;

    if (!isConfigured()) {
      return {
        success: false,
        error: 'Supabase credentials are not configured in js/config.js.'
      };
    }

    const client = getClient();
    if (!client) {
      return {
        success: false,
        error: 'Supabase client is not available.'
      };
    }

    try {
      let query = client
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status.toLowerCase());
      }

      if (date && date.trim()) {
        query = query.eq('appointment_date', date.trim());
      }

      const { data, error } = await query;
      if (error) {
        throw error;
      }

      let results = data || [];
      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        results = results.filter(item =>
          (item.full_name && item.full_name.toLowerCase().includes(q)) ||
          (item.phone && item.phone.toLowerCase().includes(q)) ||
          (item.therapy && item.therapy.toLowerCase().includes(q)) ||
          (item.concern && item.concern.toLowerCase().includes(q))
        );
      }

      return { success: true, data: results };
    } catch (err) {
      console.error('[Fetch Appointments Error]', err);
      return {
        success: false,
        error: err.message || 'Failed to fetch appointment records from Supabase.'
      };
    }
  }

  /**
   * Admin: Update Appointment Status
   */
  async function updateAppointmentStatus(id, newStatus) {
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: 'Invalid status value.' };
    }

    if (!isConfigured()) {
      return { success: false, error: 'Supabase credentials are not configured.' };
    }

    const client = getClient();
    if (!client) return { success: false, error: 'Supabase client unavailable.' };

    try {
      const { data, error } = await client
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data: data && data[0] ? data[0] : null };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update appointment status.' };
    }
  }

  /**
   * Admin: Delete Appointment Record
   */
  async function deleteAppointmentRecord(id) {
    if (!isConfigured()) {
      return { success: false, error: 'Supabase credentials are not configured.' };
    }

    const client = getClient();
    if (!client) return { success: false, error: 'Supabase client unavailable.' };

    try {
      const { error } = await client
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to delete appointment record.' };
    }
  }

  // Export to Global Scope
  window.AmmaSupabase = {
    isConfigured,
    getClient,
    validateIndianPhone,
    validateAppointmentDate,
    submitAppointment,
    adminSignIn,
    adminSignOut,
    getAdminUser,
    fetchAppointments,
    updateAppointmentStatus,
    deleteAppointmentRecord
  };

})(window);
