/**
 * Amma Healing Centerr - Configuration File
 * Update business details, contact information, hours, and review stats here.
 */

const SITE_CONFIG = {
  businessName: "Amma Healing Centerr",
  category: "Holistic Healing & Wellness Center",
  tagline: "Natural Healing. Better Wellbeing.",
  
  // Contact & Location Details
  phoneDisplay: "+91 97311 38761 / +91 98805 02058",
  phone1Display: "+91 97311 38761",
  phone2Display: "+91 98805 02058",
  phoneCall: "+919731138761",       // Primary tel link format
  phoneCallSecondary: "+919880502058", // Secondary tel link format
  whatsappNumber: "919731138761",   // Primary WhatsApp format
  whatsappNumber2: "919880502058",  // Secondary WhatsApp format
  email: "contact@ammahealingcenter.com",
  
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
        service: "Holistic Wellness Session"
      },
      {
        quote: "He listens carefully to every concern and provides the right treatment approach.",
        author: "Verified Visitor",
        rating: 5,
        service: "Personalized Therapy"
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
      tagline: "Natural Stimulation for Nerve & Organ Vitality",
      shortDesc: "A non-invasive, drug-free therapy that applies systematic gentle pressure to specific nerve points to stimulate natural blood flow, nerve coordination, and organ balance.",
      longDesc: "Neurotherapy is an ancient and holistic pressure technique that focuses on revitalizing the body's internal systems. By applying rhythmic, calibrated pressure on designated nerve clusters and vascular points, it helps restore proper circulation, encourages self-regulation, and assists the body in finding its natural state of equilibrium.",
      benefits: ["Supports natural blood circulation", "Non-invasive and completely drugless", "Helps relieve accumulated physical stress", "Tailored to individual bodily response"],
      image: "assets/images/therapy-neurotherapy.jpg",
      icon: "activity"
    },
    {
      id: "marma-therapy",
      name: "Marma Therapy",
      tagline: "Awakening Vital Energy Points",
      shortDesc: "A classical Indian healing science that gently stimulates 107 vital energy points (Marmas) across the body to release blocked prana, ease tension, and nurture deep relaxation.",
      longDesc: "Marma Therapy stems from traditional wellness traditions and works with the body's subtle energy matrix. Through mindful touch and gentle pressure on specific anatomical meeting points of muscles, veins, and joints, Marma therapy fosters energetic harmony, eases localized physical stiffness, and deeply soothes the mind.",
      benefits: ["Encourages smooth energetic flow (Prana)", "Relieves deep seated tension & stiffness", "Promotes nervous system calming", "Holistic mind-body rejuvenation"],
      image: "assets/images/therapy-marma.jpg",
      icon: "sparkles"
    },
    {
      id: "acupressure",
      name: "Acupressure",
      tagline: "Targeted Pressure-Point Harmony",
      shortDesc: "A time-tested holistic method applying precise fingertip pressure to energy meridian points to relieve muscular tightness, improve circulation, and stimulate natural healing.",
      longDesc: "Acupressure is a foundational complementary therapy that works by activating key acupoints along the body's meridian pathways. By utilizing targeted manual pressure rather than needles, it gently assists in easing discomfort, supporting postural balance, and restoring internal vitality.",
      benefits: ["Eases back, neck, and joint fatigue", "Stimulates natural recovery pathways", "Enhances circulation and relaxation", "Gentle, comfortable manual method"],
      image: "assets/images/therapy-acupressure.jpg",
      icon: "hand-metal"
    },
    {
      id: "color-therapy",
      name: "Color Therapy (Chromotherapy)",
      tagline: "Balancing Energy Through Light & Color",
      shortDesc: "A gentle complementary therapy utilizing the calming vibrations of specific color wavelengths and light frequencies to support mood, vitality, and energetic balance.",
      longDesc: "Color Therapy works on the principle that visible light spectrums possess distinct vibrational energies that interact with our subtle senses. By mindfully introducing harmonious hues and ambient light, sessions help soothe mental fatigue, calm emotional stress, and bring balance to your daily lifestyle.",
      benefits: ["Soothes nervous strain and restlessness", "Supports emotional calmness and clarity", "Complementary gentle vibrational approach", "Non-touch, relaxing ambient experience"],
      image: "assets/images/therapy-color.jpg",
      icon: "sun"
    },
    {
      id: "auricular-therapy",
      name: "Auricular Therapy",
      tagline: "Reflexology Through the External Ear",
      shortDesc: "A specialized reflex technique where gentle pressure or natural herbal seeds are applied to corresponding points on the outer ear to promote full-body relaxation and balance.",
      longDesc: "Auricular Therapy utilizes the microsystem of the ear, which reflects the neural pathways and organs of the entire body. By placing gentle magnetic pellets or herbal seeds on precise points, the therapy provides gentle, continuous stimulation that aids in stress management, sleep support, and comfort.",
      benefits: ["Assists in stress and tension relief", "Supports digestive and postural comfort", "Continuous gentle reflex stimulation", "Simple, hygienic, and non-invasive"],
      image: "assets/images/therapy-auricular.jpg",
      icon: "ear"
    },
    {
      id: "numerology-guidance",
      name: "Numerology Services",
      tagline: "Insights Through Numbers & Life Energy",
      shortDesc: "Personalized numerological analysis providing insights into your date of birth, name vibration, mobile number, and vehicle numbers for personal alignment.",
      longDesc: "Numerology is a time-honored analytical science of numerical vibrations. By calculating life path numbers, grid patterns (Lo Shu Grid), and phonetic vibrations, our consultations offer perspective for personal clarity, name harmonization, and key lifestyle decisions.",
      benefits: ["Mobile & vehicle number compatibility", "Name spelling & phonetic alignment", "Date of birth Grid analysis", "Personalized lifestyle clarity"],
      image: "assets/images/numerology-hero.jpg",
      icon: "hash"
    }
  ],

  // Common Concerns We Provide Wellness Support For
  concerns: [
    {
      name: "Back Pain",
      category: "Musculoskeletal Support",
      description: "Gentle spinal alignment, nerve stimulation, and acupressure designed to ease lumbar stiffness and improve flexibility.",
      recommendedTherapies: ["Neurotherapy", "Acupressure", "Marma Therapy"]
    },
    {
      name: "Knee Pain",
      category: "Joint & Mobility Wellness",
      description: "Holistic pressure techniques to support joint comfort, improve circulation around knee tendons, and encourage mobility.",
      recommendedTherapies: ["Marma Therapy", "Acupressure", "Neurotherapy"]
    },
    {
      name: "Sciatica",
      category: "Nerve & Posture Care",
      description: "Complementary pressure point and neurotherapy sessions aimed at relieving gluteal pressure and supporting nerve flow down the leg.",
      recommendedTherapies: ["Neurotherapy", "Acupressure"]
    },
    {
      name: "Frozen Shoulder",
      category: "Shoulder & Upper Body Mobility",
      description: "Specialized gentle pressure on shoulder Marma points and upper spine to encourage range of motion and ease discomfort.",
      recommendedTherapies: ["Marma Therapy", "Acupressure", "Neurotherapy"]
    },
    {
      name: "Sinus Concerns",
      category: "Respiratory & Facial Comfort",
      description: "Targeted facial acupressure and auricular points to promote sinus drainage, relieve congestion, and ease cranial tension.",
      recommendedTherapies: ["Acupressure", "Auricular Therapy", "Color Therapy"]
    },
    {
      name: "Blood Pressure",
      category: "Lifestyle & Stress Management",
      description: "Relaxing nerve therapy, color therapy, and acupressure to help calm the autonomic nervous system and promote peaceful relaxation.",
      recommendedTherapies: ["Neurotherapy", "Color Therapy", "Auricular Therapy"]
    },
    {
      name: "Cholesterol Support",
      category: "Metabolic & Vitality Support",
      description: "Holistic stimulation of digestive and metabolic reflex points along with lifestyle guidance to complement your overall wellness routine.",
      recommendedTherapies: ["Neurotherapy", "Acupressure"]
    },
    {
      name: "Kidney-Related Concerns",
      category: "Fluid & Energetic Balance",
      description: "Complementary acupressure and neurotherapy targeting lumbar reflex zones to encourage natural energetic balance and relaxation.",
      recommendedTherapies: ["Neurotherapy", "Acupressure", "Marma Therapy"]
    }
  ],

  // Numerology Offerings
  numerologyOfferings: [
    {
      title: "Mobile Number Numerology",
      icon: "smartphone",
      desc: "Analyze the energetic compatibility and frequency of your daily phone number to align with your personal energy and professional growth."
    },
    {
      title: "Name Correction",
      icon: "spell-check",
      desc: "Phonetic and numerical balancing of your name to harmonize with your date of birth, fostering positive personal and professional resonance."
    },
    {
      title: "Grid Numerology (Lo Shu)",
      icon: "grid",
      desc: "Comprehensive 3x3 birth chart grid analysis to identify element strengths, missing numbers, and behavioral tendencies."
    },
    {
      title: "Vehicle Number Guidance",
      icon: "car",
      desc: "Determine auspicious total vibration numbers for your automobile, two-wheeler, or commercial vehicles."
    },
    {
      title: "Date-of-Birth Based Guidance",
      icon: "calendar",
      desc: "Deep analysis of your radical (driver) and destiny (conductor) numbers to understand natural strengths and auspicious cycles."
    }
  ]
};
