// Shared filter data used across CommunityFinderWidget, MyCommunities, and Community pages

export const continents = [
  "Africa", "Asia", "Australia", "Europe", "North America", "South America"
].sort();

export const countriesByContinent: Record<string, string[]> = {
  "Africa": ["Egypt", "Kenya", "Nigeria", "South Africa"].sort(),
  "Asia": ["China", "India", "Japan", "Singapore", "UAE"].sort(),
  "Australia": ["Australia", "New Zealand"].sort(),
  "Europe": ["France", "Germany", "Netherlands", "United Kingdom"].sort(),
  "North America": ["Canada", "United States"].sort(),
  "South America": ["Argentina", "Brazil", "Chile"].sort(),
};

export const sectorsByCategory: Record<string, string[]> = {
  "Accountancy": ["Audit", "Tax", "Advisory", "Forensic", "Insolvency"].sort(),
  "Construction": ["Commercial", "Residential", "Infrastructure", "Civil Engineering"].sort(),
  "Consultancy": ["Strategy", "Operations", "HR", "IT", "Management"].sort(),
  "Distribution": ["Logistics", "Warehousing", "Supply Chain", "Retail Distribution"].sort(),
  "Energy": ["Oil & Gas", "Renewables", "Utilities", "Nuclear"].sort(),
  "Financial services": ["Banking", "Insurance", "Asset Management", "Private Equity"].sort(),
  "Health": ["Hospitals", "Pharma", "Biotech", "Medical Devices", "Care Services"].sort(),
  "Hospitality": ["Hotels", "Restaurants", "Events", "Travel"].sort(),
  "Legal services": ["Corporate", "Litigation", "IP", "Employment", "Real Estate"].sort(),
  "Manufacturing": ["Automotive", "Aerospace", "Consumer Goods", "Industrial"].sort(),
  "Marketing": ["Digital", "Brand", "PR", "Advertising", "Research"].sort(),
  "Other services": ["Facilities", "Security", "Cleaning", "Outsourcing"].sort(),
  "Property": ["Commercial", "Residential", "Development", "Investment"].sort(),
  "Recruitment": ["Executive Search", "Temp", "RPO", "Specialist"].sort(),
  "Technology": ["Software", "Hardware", "SaaS", "AI/ML", "Cybersecurity"].sort(),
};

export const sectors = Object.keys(sectorsByCategory).sort();

export const orgTypes = [
  "B Corp",
  "Business school",
  "Charity",
  "Consortium",
  "Corporate organisation",
  "Educational establishment",
  "Joint venture",
  "Partnership",
  "Professional firm",
  "Professional body",
  "Public sector",
  "Virtual firm",
].sort();

export const managementExpertiseList = [
  "Business development",
  "Communication",
  "Facilities",
  "Finance",
  "Government liaison",
  "Human resources",
  "Innovation",
  "Learning & Development",
  "Marketing",
  "Operations",
  "Performance management",
  "Planning",
  "Procurement",
  "Product development",
  "Risk",
  "Sales",
  "Sustainability (DEI, CSR)",
  "Technology"
];

export const leadershipExpertiseList = [
  "Board/ExCo (Chairman, NED, Member)",
  "Chief of Staff",
  "Divisional Leadership",
  "Firmwide Leadership",
  "Governance",
  "Project leadership",
  "Strategy"
];

export const contributionsList = [
  { singular: "Add/comment on posts", plural: "posts" },
  { singular: "Case studies", plural: "case studies" },
  { singular: "Community management", plural: "community management" },
  { singular: "Education", plural: "education" },
  { singular: "Events", plural: "events" },
  { singular: "Mentorship", plural: "mentorship" },
  { singular: "Publications", plural: "publications" },
  { singular: "Research", plural: "research" },
  { singular: "Thought leadership", plural: "thought leadership" }
];

export const externalFactorsList: Record<string, string[]> = {
  "Political": [
    "Government Policies & Stability",
    "Regulatory Environment",
    "International Relations",
    "Funding & Grants"
  ],
  "Economic": [
    "Macroeconomic Trends",
    "Market Conditions",
    "Consumer Behaviors",
    "Cost Factors"
  ],
  "Social": [
    "Demographics",
    "Lifestyle & Trends",
    "Workforce Factors",
    "Public Opinion"
  ],
  "Technological": [
    "Innovation & R&D",
    "Operational Technology",
    "Technology Transfer",
    "Obsolescence"
  ]
};
