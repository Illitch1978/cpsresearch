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

export const specialismsByServiceLine: Record<string, string[]> = {
  "Actuarial": ["Claims", "Health actuarial", "Life actuarial", "Property & casualty actuarial", "Risk insurance"],
  "Audit": ["Commercial assurance", "Compliance audit", "Controls assurance", "Internal audit", "Performance assurance", "Technology audit"],
  "Buildings": ["Architecture", "Building design", "Building performance evaluation", "Building services engineering", "Electrical engineering", "Facilities management", "Mechanical engineering", "Public health engineering", "Structural engineering", "Sustainable building design", "Vertical transport design"],
  "Corporate finance": ["Bid services", "Capital markets advisory & attestation", "Integration | Separation advisory", "M&A advisory", "Pre-deal evaluation", "Project finance", "Sale & purchase agreement assistance", "Transaction evaluation", "Transaction structuring", "Vendor assistance"],
  "Financial advisory": ["Cash management", "Financial governance", "Foreign exchange", "General accounting advisory", "Treasury"],
  "Forensics": ["Disputes & forensics advisory", "Forensic accounting & investigations"],
  "Infrastructure": ["Airport planning", "Bridge engineering", "Civil engineering", "Infrastructure design", "Maritime engineering", "Rail engineering", "Sustainable infrastructure", "Tunnel design", "Waste management strategies", "Water engineering"],
  "Legal": ["Corporate law", "Employment law", "Finance law", "Intellectual property & technology law", "International trade, regulatory & government affairs law", "Litigation, arbitration & investigatory law", "Projects, energy & infrastructure law", "Real estate law", "Restructuring law", "Tax law"],
  "Loss adjusting": ["Catastrophe response", "Loss adjusting", "Managed repairs"],
  "Marketing": ["Advertising", "Client care", "Digital marketing", "Direct mail", "Events", "Market analysis", "Marketing literature", "Marketing planning", "Newsletters", "Product development & positioning", "Public relations", "Social media", "Website development"],
  "Operations": ["Managing resources, budgets and suppliers", "Operational & process improvement consulting", "Outsourcing"],
  "Patent attorneys": ["Copyright", "Designs", "Domain names", "IP valuation", "Patents", "Trade marks"],
  "People": ["Compensation strategy", "Employee engagement", "Executive compensation", "Health & benefits", "Inclusion & diversity", "Pension advisory", "Talent management", "Wellbeing"],
  "Planning": ["Economic planning", "Environmental consulting", "Flood risk management", "International development", "Landscape architecture", "Masterplanning", "Planning policy advice", "Resilience, security & risk", "Smart cities", "Smart mobility", "Town planning"],
  "Property": ["Building consultancy", "Property development", "Property investment management", "Property management", "Property transaction services", "Valuation & property advisory", "Workplace solutions"],
  "Recruitment": ["Contract recruitment", "Executive search", "Interim recruitment", "Permanent recruitment", "Recruitment outsourcing"],
  "Regulatory": ["Application of regulatory rules & reporting", "Compliance advisory services", "Governance reviews"],
  "Research": ["Analytics", "Client loyalty studies", "Descriptive research", "Pricing reviews", "Product reviews", "Think tanks"],
  "Risk": ["Cyber risk", "Financial risk", "Fraud", "Information risk", "Internal controls risk", "Operational risk", "Risk assessment", "Technology risk", "Trading risk", "Treasury risk"],
  "Strategy": ["Competitor analysis", "Corporate transformation", "Customer analysis", "Managing transformational programmes", "Partnerships", "Pricing strategy"],
  "Taxation": ["Corporate & international tax structuring", "Corporate tax optimisation strategy", "Indirect tax advisory services", "Preparation & submission of tax returns", "Regulatory change tax impact mitigation & optimisation", "Support in relation to investigations initiated by tax authorities", "Tax compliance & reporting obligations", "Tax efficient intra-group financing advice", "Tax loss planning", "Tax planning & modelling", "Tax related risk management", "Tax relief planning", "Tax settlements", "Transfer pricing & planning", "Treasury cash management tax advice"],
  "Technology": ["AI advisory", "AI implementation", "Application services", "Big data", "Blockchain", "Cloud enabled services", "Cyber security", "Data management", "DevOps", "Digital engineering", "Digital operations & platforms", "Digital strategy", "Digital transformation", "Emerging technologies", "Open source", "Quality assurance", "Roadmap & blueprint development", "Stack services", "Technology governance"],
};

export const serviceLines = Object.keys(specialismsByServiceLine).sort();

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

export const orgSizes = [
  { label: "Micro-organisation", description: "1 to 10 global FTE headcount" },
  { label: "SME", description: "11 to 250 global FTE headcount" },
  { label: "Mid-market", description: "250 to 2,000 global FTE headcount" },
  { label: "Large", description: "2,000 to 10,000 global FTE headcount" },
  { label: "Very large", description: "over 10,000 global FTE headcount" },
];

export const seniorityList = [
  "Firmwide leader",
  "Divisional leader",
  "Partner",
  "C-Suite",
  "Director/Head",
  "Senior manager/Associate",
  "Manager",
  "Senior adviser",
  "Adviser",
  "Junior adviser/Analyst",
  "Trainee",
  "Co-ordinator",
  "Assistant",
  "Executive assistant",
];

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
