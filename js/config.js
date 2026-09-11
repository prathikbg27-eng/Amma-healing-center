/**
 * Amma Healing Centre - Configuration File
 * Update business details, contact information, hours, and review stats here.
 */

// Resolve environment variables or defaults
const envSupabaseUrl = (typeof window !== 'undefined' && window.__ENV_SUPABASE_URL) ? window.__ENV_SUPABASE_URL : "https://ewsmhwrculcridwqknid.supabase.co";
const envSupabaseAnonKey = (typeof window !== 'undefined' && window.__ENV_SUPABASE_ANON_KEY) ? window.__ENV_SUPABASE_ANON_KEY : "sb_publishable_ZiSUek73xeZYNGGGq9unwg_-Zvvjhns";

// Define global config object and attach to window
const SITE_CONFIG = {
  businessName: "Amma Healing Centre",
  category: "Holistic Healing & Wellness Centre",
  tagline: "Natural Healing. Better Wellbeing.",

  // Supabase Configuration
  supabaseUrl: envSupabaseUrl,
  supabaseAnonKey: envSupabaseAnonKey,

  // Contact & Location Details
  phoneDisplay: "+91 97311 38761 / +91 98805 02058",
  phone1Display: "+91 97311 38761",
  phone2Display: "+91 98805 02058",
  phoneCall: "+919731138761",       // Primary tel link format
  phoneCallSecondary: "+919880502058", // Secondary tel link format
  whatsappNumber: "919731138761",   // Primary WhatsApp business number
  whatsappNumber2: "919880502058",  // Secondary WhatsApp business number
  email: "ammahealingcenter@2026",

  // Standard Booking Therapies and Slots
  bookingTherapies: [
    "Neurotherapy",
    "Marma Therapy",
    "Acupressure",
    "Color Therapy",
    "Auricular Therapy",
    "Numerology Consultation",
    "General Wellness Consultation"
  ],
  bookingTimeSlots: [
    "Morning (9:00 AM - 12:00 PM)",
    "Afternoon (12:00 PM - 4:00 PM)",
    "Evening (4:00 PM - 7:30 PM)",
    "Flexible / Any Time"
  ],

  location: {
    street: "1st Cross Rd, Agrahara, KR Mohalla, Rahmania Mohalla",
    city: "Mysuru",
    state: "Karnataka",
    postalCode: "570004",
    country: "India",
    fullAddress: "1st Cross Rd, Agrahara, KR Mohalla, Rahmania Mohalla, Mysuru, Karnataka 570004",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.1189498205467!2d76.6495!3d12.3025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf703ec0f0c001%3A0x0!2sAgrahara%2C%20KR%20Mohalla%2C%20Mysuru%2C%20Karnataka%20570004!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    googleMapsDirectionsUrl: "https://maps.google.com/?q=1st+Cross+Rd,+Agrahara,+KR+Mohalla,+Rahmania+Mohalla,+Mysuru,+Karnataka+570004"
  },

  // Working Hours (Editable)
  openingHours: {
    weekdays: "Monday – Saturday: 9:00 AM – 7:30 PM",
    weekend: "Sunday: By Prior Appointment",
    notice: "Prior appointment recommended for customized therapy sessions"
  },

  // Google Rating & Social Proof
  reviews: {
    rating: "5.0",
    ratingStars: "★★★★★",
    reviewCount: 15,
    source: "Google Reviews",
    googleReviewUrl: "https://maps.google.com/?q=1st+Cross+Rd,+Agrahara,+KR+Mohalla,+Rahmania+Mohalla,+Mysuru,+Karnataka+570004",
    items: [
      {
        quote: "The staff were supportive and made me feel comfortable throughout the process.",
        author: "Verified Visitor",
        rating: 5,
        service: "Therapy Session"
      },
      {
        quote: "He listens carefully to every concern and provides the right treatment approach.",
        author: "Verified Visitor",
        rating: 5,
        service: "Consultation"
      },
      {
        quote: "I would definitely recommend this place to anyone looking for natural healing.",
        author: "Verified Visitor",
        rating: 5,
        service: "Natural Healing"
      }
    ]
  },

  // Therapies List
  therapies: [
    {
      id: "neurotherapy",
      name: "Neurotherapy",
      tagline: "Nerve & Circulation Vitality",
      shortDesc: "Calibrated pressure on specific nerve points and vascular channels to improve circulation, relieve deep tension, and stimulate organ function.",
      longDesc: "Neurotherapy applies rhythmic, measured pressure on designated nerve clusters and blood vessels. This drug-free technique encourages healthy blood flow, relaxes overstressed muscles, and supports your internal systems naturally.",
      benefits: ["Supports healthy blood circulation", "100% drug-free and non-invasive", "Relieves deep physical tension", "Adapted to your comfort level"],
      image: "assets/images/therapy-neurotherapy.jpg",
      icon: "activity"
    },
    {
      id: "marma-therapy",
      name: "Marma Therapy",
      tagline: "Vital Energy Point Stimulation",
      shortDesc: "Gentle activation of 107 vital energy points across the body to release chronic stiffness, soothe tension, and calm the mind.",
      longDesc: "Rooted in classical Indian healing traditions, Marma therapy works with key anatomical points where muscles, veins, and joints converge. Mindful touch at these centers clears stiffness, improves mobility, and brings deep physical ease.",
      benefits: ["Releases chronic muscular stiffness", "Clears blocked energy pathways", "Calms the nervous system", "Enhances natural flexibility"],
      image: "assets/images/therapy-marma.jpg",
      icon: "sparkles"
    },
    {
      id: "acupressure",
      name: "Acupressure",
      tagline: "Targeted Pressure-Point Relief",
      shortDesc: "Precise fingertip pressure along meridian pathways to relieve muscular tightness, improve circulation, and correct postural fatigue.",
      longDesc: "Acupressure applies firm, steady manual pressure to key meridian points across the body. By releasing tight muscular knots and promoting localized blood flow, it eases back, neck, and joint discomfort without needles.",
      benefits: ["Relieves back, neck, and joint fatigue", "Reduces muscle spasms and tightness", "Improves local blood circulation", "Comfortable, needle-free method"],
      image: "assets/images/therapy-acupressure.jpg",
      icon: "hand-metal"
    },
    {
      id: "color-therapy",
      name: "Color Therapy (Chromotherapy)",
      tagline: "Light Frequencies for Mental Calm",
      shortDesc: "Specific visible light frequencies and colors to settle mental fatigue, support emotional tranquility, and recharge vitality.",
      longDesc: "Color therapy applies specific light wavelengths to help quiet an overactive mind, ease emotional tension, and encourage restful sleep. It provides a peaceful, non-touch experience that complements physical treatments.",
      benefits: ["Soothes stress and mental strain", "Promotes emotional tranquility", "Gentle non-touch experience", "Complements physical therapies"],
      image: "assets/images/therapy-color.jpg",
      icon: "sun"
    },
    {
      id: "auricular-therapy",
      name: "Auricular Therapy",
      tagline: "Outer Ear Reflexology",
      shortDesc: "Gentle stimulation of outer ear reflex points using herbal seeds or magnetic pellets to relieve tension and support deep rest.",
      longDesc: "Auricular therapy utilizes the reflex map on the outer ear, which connects to neural pathways across the body. Small magnetic pellets or herbal seeds provide continuous, gentle stimulation to ease discomfort and improve sleep quality.",
      benefits: ["Eases daily stress and tension", "Supports restful sleep patterns", "Continuous gentle reflex action", "Hygienic, comfortable, and simple"],
      image: "assets/images/therapy-auricular.jpg",
      icon: "ear"
    },
    {
      id: "numerology-guidance",
      name: "Numerology Services",
      tagline: "Clarity Through Numerical Analysis",
      shortDesc: "Personalized analysis of your birth date, name vibration, mobile, and vehicle numbers for life clarity and practical alignment.",
      longDesc: "Numerology evaluates numerical patterns in your date of birth, name spelling, and daily numbers. Sessions provide practical perspective and clarity for personal decisions, career milestones, and life transitions.",
      benefits: ["Mobile & vehicle number compatibility", "Name spelling & phonetic alignment", "Lo Shu birth grid analysis", "Practical lifestyle clarity"],
      image: "assets/images/numerology-hero.jpg",
      icon: "hash"
    }
  ],

  // Common Concerns We Provide Support For
  concerns: [
    {
      name: "Back Pain",
      category: "Spine & Posture",
      description: "Targeted spinal pressure, neurotherapy, and acupressure to release lumbar stiffness and improve flexibility.",
      recommendedTherapies: ["Neurotherapy", "Acupressure", "Marma Therapy"]
    },
    {
      name: "Knee Pain",
      category: "Joint Mobility",
      description: "Gentle Marma point and acupressure stimulation to enhance circulation and ease stiffness around knee tendons.",
      recommendedTherapies: ["Marma Therapy", "Acupressure", "Neurotherapy"]
    },
    {
      name: "Sciatica",
      category: "Nerve Comfort",
      description: "Focused nerve and pressure point sessions to alleviate tension radiating through the lower back and leg.",
      recommendedTherapies: ["Neurotherapy", "Acupressure"]
    },
    {
      name: "Frozen Shoulder",
      category: "Shoulder Mobility",
      description: "Gentle activation of shoulder Marma points to restore range of motion and relieve chronic stiffness.",
      recommendedTherapies: ["Marma Therapy", "Acupressure", "Neurotherapy"]
    },
    {
      name: "Sinus Discomfort",
      category: "Facial & Cranial Ease",
      description: "Facial acupressure and ear reflex points to clear nasal congestion and ease cranial pressure.",
      recommendedTherapies: ["Acupressure", "Auricular Therapy", "Color Therapy"]
    },
    {
      name: "Blood Pressure Stress",
      category: "Stress & Circulation",
      description: "Calming neurotherapy and color sessions to settle autonomic stress responses and promote deep relaxation.",
      recommendedTherapies: ["Neurotherapy", "Color Therapy", "Auricular Therapy"]
    },
    {
      name: "Metabolic Vitality",
      category: "Digestion & Energy",
      description: "Reflex point stimulation paired with practical routine guidance to support natural digestion and vitality.",
      recommendedTherapies: ["Neurotherapy", "Acupressure"]
    },
    {
      name: "Kidney Vitality",
      category: "Fluid & Energetic Ease",
      description: "Acupressure and neurotherapy targeting lumbar reflex pathways to encourage natural fluid balance.",
      recommendedTherapies: ["Neurotherapy", "Acupressure", "Marma Therapy"]
    }
  ],

  // Numerology Offerings
  numerologyOfferings: [
    {
      title: "Mobile Number Numerology",
      icon: "smartphone",
      desc: "Analyzes how your daily phone number's vibration aligns with your personal energy and career pursuits."
    },
    {
      title: "Name Correction",
      icon: "spell-check",
      desc: "Harmonizes the spelling and phonetic vibration of your name with your date of birth for positive resonance."
    },
    {
      title: "Lo Shu Grid Numerology",
      icon: "grid",
      desc: "3x3 birth chart analysis to uncover elemental strengths, missing numbers, and natural behavioral tendencies."
    },
    {
      title: "Vehicle Number Guidance",
      icon: "car",
      desc: "Identifies auspicious total vibration numbers for your two-wheeler, car, or commercial vehicle."
    },
    {
      title: "Date-of-Birth Analysis",
      icon: "calendar",
      desc: "In-depth review of your Driver and Conductor numbers to provide clarity on timing, career, and personal goals."
    }
  ]
};

if (typeof window !== 'undefined') {
  window.SITE_CONFIG = SITE_CONFIG;
}
