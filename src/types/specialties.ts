// Specialty definitions with slugs and categories
export const specialties = [
  {
    slug: "bipolar",
    label: "Bipolar",
    subLabel: "",
    category: "Mental Health & Trauma"
  },
  {
    slug: "lgbtq", 
    label: "LGBTQ",
    subLabel: "",
    category: "Identity & Life Stages"
  },
  {
    slug: "medication-prescribing",
    label: "Medication/Prescribing",
    subLabel: "",
    category: "Health & Medical"
  },
  {
    slug: "suicide-history",
    label: "Suicide History/Attempts",
    subLabel: "",
    category: "Mental Health & Trauma"
  },
  {
    slug: "general-mental-health",
    label: "General Mental Health",
    subLabel: "Anxiety, depression, stress, grief, life transitions",
    category: "Mental Health & Trauma"
  },
  {
    slug: "mens-issues",
    label: "Men's Issues",
    subLabel: "",
    category: "Identity & Life Stages"
  },
  {
    slug: "relationship-issues", 
    label: "Relationship Issues",
    subLabel: "Family, friends, couple, etc.",
    category: "Identity & Life Stages"
  },
  {
    slug: "trauma-ptsd",
    label: "Trauma & PTSD",
    subLabel: "",
    category: "Mental Health & Trauma"
  },
  {
    slug: "personality-disorders",
    label: "Personality Disorders",
    subLabel: "",
    category: "Mental Health & Trauma"
  },
  {
    slug: "personal-growth",
    label: "Personal Growth",
    subLabel: "",
    category: "Growth & Coaching"
  },
  {
    slug: "substance-abuse",
    label: "Substance Use/Abuse",
    subLabel: "",
    category: "Mental Health & Trauma"
  },
  {
    slug: "pediatrics",
    label: "Pediatrics",
    subLabel: "",
    category: "Identity & Life Stages"
  },
  {
    slug: "womens-issues",
    label: "Women's Issues",
    subLabel: "Post-partum, infertility, family planning",
    category: "Identity & Life Stages"
  },
  {
    slug: "chronic-pain",
    label: "Chronic Pain", 
    subLabel: "",
    category: "Health & Medical"
  },
  {
    slug: "weight-nutrition",
    label: "Weight Loss & Nutrition",
    subLabel: "",
    category: "Nutrition & Body"
  },
  {
    slug: "eating-disorders",
    label: "Eating Disorders",
    subLabel: "",
    category: "Nutrition & Body"
  },
  {
    slug: "diabetic-diet",
    label: "Diabetic Nutrition",
    subLabel: "",
    category: "Nutrition & Body"
  },
  {
    slug: "coaching-leadership",
    label: "Coaching",
    subLabel: "Leadership, career, academic and wellness",
    category: "Growth & Coaching"
  },
  {
    slug: "life-coaching",
    label: "Life Coaching",
    subLabel: "",
    category: "Growth & Coaching" 
  },
  {
    slug: "ocd",
    label: "OCD",
    subLabel: "Obsessive-compulsive disorders",
    category: "Mental Health & Trauma"
  },
  {
    slug: "neuropsych-testing",
    label: "Neuropsychological Testing",
    subLabel: "ADHD and cognitive evaluations",
    category: "Mental Health & Trauma"
  },
  {
    slug: "adhd",
    label: "ADHD",
    subLabel: "Attention and hyperactivity",
    category: "Mental Health & Trauma"
  },
  {
    slug: "sleep-issues",
    label: "Sleep Support",
    subLabel: "Insomnia and other sleep concerns",
    category: "Health & Medical"
  },
  {
    slug: "schizophrenia",
    label: "Psychosis",
    subLabel: "Schizophrenia and psychotic disorders",
    category: "Mental Health & Trauma"
  },
  {
    slug: "learning-disorders",
    label: "Learning Disorders", 
    subLabel: "",
    category: "Mental Health & Trauma"
  },
  {
    slug: "domestic-abuse",
    label: "Domestic Abuse",
    subLabel: "",
    category: "Mental Health & Trauma"
  },
];

// Helper functions
export const getSpecialtyBySlug = (slug: string) => 
  specialties.find(s => s.slug === slug);

export const getSpecialtyLabels = (slugs: string[]) => 
  slugs.map(slug => getSpecialtyBySlug(slug)?.label).filter(Boolean);

export const getSpecialtySlugs = (labels: string[]) => 
  labels.map(label => specialties.find(s => s.label === label)?.slug).filter(Boolean);

// Group specialties by category for UI
export const getSpecialtiesByCategory = () => {
  const grouped = specialties.reduce((acc, specialty) => {
    if (!acc[specialty.category]) {
      acc[specialty.category] = [];
    }
    acc[specialty.category].push(specialty);
    return acc;
  }, {} as Record<string, typeof specialties>);
  
  // Sort specialties within each category alphabetically by label
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.label.localeCompare(b.label));
  });
  
  return grouped;
};