// Location definitions with slugs and state abbreviations
export const locations = [
  {
    slug: "atlanta",
    city: "Atlanta",
    state: "GA"
  },
  {
    slug: "austin",
    city: "Austin", 
    state: "TX"
  },
  {
    slug: "boston",
    city: "Boston",
    state: "MA"
  },
  {
    slug: "buffalo",
    city: "Buffalo",
    state: "NY"
  },
  {
    slug: "charlotte",
    city: "Charlotte",
    state: "NC"
  },
  {
    slug: "chicago",
    city: "Chicago",
    state: "IL"
  },
  {
    slug: "cincinnati",
    city: "Cincinnati",
    state: "OH"
  },
  {
    slug: "cleveland",
    city: "Cleveland",
    state: "OH"
  },
  {
    slug: "columbus",
    city: "Columbus",
    state: "OH"
  },
  {
    slug: "dallas",
    city: "Dallas",
    state: "TX"
  },
  {
    slug: "denver",
    city: "Denver",
    state: "CO"
  },
  {
    slug: "fort-worth",
    city: "Fort Worth",
    state: "TX"
  },
  {
    slug: "houston",
    city: "Houston",
    state: "TX"
  },
  {
    slug: "jacksonville",
    city: "Jacksonville",
    state: "FL"
  },
  {
    slug: "kansas-city",
    city: "Kansas City",
    state: "MO"
  },
  {
    slug: "las-vegas",
    city: "Las Vegas",
    state: "NV"
  },
  {
    slug: "los-angeles",
    city: "Los Angeles",
    state: "CA"
  },
  {
    slug: "miami",
    city: "Miami",
    state: "FL"
  },
  {
    slug: "minneapolis",
    city: "Minneapolis",
    state: "MN"
  },
  {
    slug: "nashville",
    city: "Nashville",
    state: "TN"
  },
  {
    slug: "new-orleans",
    city: "New Orleans",
    state: "LA"
  },
  {
    slug: "new-york",
    city: "New York",
    state: "NY"
  },
  {
    slug: "norfolk",
    city: "Norfolk",
    state: "VA"
  },
  {
    slug: "orlando",
    city: "Orlando",
    state: "FL"
  },
  {
    slug: "philadelphia",
    city: "Philadelphia",
    state: "PA"
  },
  {
    slug: "phoenix",
    city: "Phoenix",
    state: "AZ"
  },
  {
    slug: "pittsburgh",
    city: "Pittsburgh",
    state: "PA"
  },
  {
    slug: "portland",
    city: "Portland",
    state: "OR"
  },
  {
    slug: "raleigh",
    city: "Raleigh",
    state: "NC"
  },
  {
    slug: "richmond",
    city: "Richmond",
    state: "VA"
  },
  {
    slug: "sacramento",
    city: "Sacramento",
    state: "CA"
  },
  {
    slug: "salt-lake-city",
    city: "Salt Lake City",
    state: "UT"
  },
  {
    slug: "san-antonio",
    city: "San Antonio",
    state: "TX"
  },
  {
    slug: "san-diego",
    city: "San Diego",
    state: "CA"
  },
  {
    slug: "san-francisco",
    city: "San Francisco",
    state: "CA"
  },
  {
    slug: "san-jose",
    city: "San Jose",
    state: "CA"
  },
  {
    slug: "seattle",
    city: "Seattle",
    state: "WA"
  },
  {
    slug: "spokane",
    city: "Spokane",
    state: "WA"
  },
  {
    slug: "st-louis",
    city: "St. Louis",
    state: "MO"
  },
  {
    slug: "tampa",
    city: "Tampa",
    state: "FL"
  }
];

// Helper functions
export const getLocationDisplayName = (slug: string) =>
  {
    const location = locations.find(l => l.slug === slug);
    return location ? `${location.city}, ${location.state}` : slug;
  };

export const getLocationDisplayNames = (slugs: string[]) => 
  slugs.map(slug => {
    return getLocationDisplayName(slug);
  });

export const getAllLocationDisplayNames = () => 
  locations.map(l => `${l.city}, ${l.state}`).sort();