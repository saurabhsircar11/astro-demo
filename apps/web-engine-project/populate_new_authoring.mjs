import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Get folder ID from env
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1SuWQ9MJmfzJzhRD20bnV3A5ejIf8zVfy';
const KEY_FILE = path.resolve('apps/web-engine-project/service-account.json');

const tablesData = [
  // 1. Metadata (Remains key-value as per docParser)
  {
    rows: 5,
    cols: 2,
    content: [
      ['METADATA', ''],
      ['title', 'Globant AI Powerhouse | Meet AI Pods by Globant Enterprise AI'],
      ['description', 'We help organizations drive AI business transformation. Our AI enterprise solutions blend AI-powered engineering, innovation, and cutting-edge design.'],
      ['robots', 'index, follow'],
      ['theme', 'light'],
    ]
  },

  // 2. Header (Positional — logo wordmark, nav links, utility cluster)
  // Authoring rule: nav/utility links must stay NON-bold (bold links render as
  // btn btn--primary buttons via docParser parseTextRun).
  {
    rows: 2,
    cols: 3,
    content: [
      ['header', '', ''],
      [
        "Globant",
        "Our Offering\nAbout\nInsights\nCareers\nInvestors",
        "Contact Us\nEN"
      ]
    ],
    styles: [
      { text: "Our Offering", link: "/our-services", rowIdx: 1, colIdx: 1 },
      { text: "About", link: "/about", rowIdx: 1, colIdx: 1 },
      { text: "Insights", link: "/insights", rowIdx: 1, colIdx: 1 },
      { text: "Careers", link: "/careers", rowIdx: 1, colIdx: 1 },
      { text: "Investors", link: "/investors", rowIdx: 1, colIdx: 1 },
      { text: "Contact Us", link: "/contact", rowIdx: 1, colIdx: 2 }
    ]
  },

  // 3. Disclaimer (Positional Notice)
  {
    rows: 2,
    cols: 2,
    content: [
      ['disclaimer (dark)', ''],
      [
        "Important Notice – Misuse of the Globant Brand\nGlobant has detected that third parties are using our name and brand without authorization on social media, websites, and fraudulent platforms that promote alleged investments. We emphasize that Globant does not offer investments or request money through third parties, and that our only official website is www.globant.com. We recommend that our users do not share personal information or make payments on unofficial websites. The security and trust of our community is our priority.",
        ""
      ]
    ],
    styles: [
      { text: "Important Notice – Misuse of the Globant Brand", bold: true, rowIdx: 1, colIdx: 0 }
    ]
  },
  
  // 3. Hero (Positional with Desktop + Mobile background images and FIFA badge logo URL text)
  {
    rows: 2,
    cols: 3,
    content: [
      ['hero (left, dark)', '', ''],
      [
        "https://statics.globant.com/production/public/2026-02/FIFA_logo_copa.svg\nOFFICIAL FIFA WORLD CUP 2026™ SUPPORTER\nEngineering for the World's Biggest Stage\nFrom connected fan ecosystems to real-time systems, Globant helps FIFA operate flawlessly under global demand.\nLearn how",
        "", // Col 1 will contain the desktop image
        ""  // Col 2 will contain the mobile image
      ]
    ],
    styles: [
      { text: "Learn how", bold: true, link: "https://www.globant.com/news/globant-fifa-renewed-partnership-2026-2027", rowIdx: 1, colIdx: 0 }
    ],
    paragraphStyles: [
      { text: "Engineering for the World's Biggest Stage", heading: "HEADING_1", rowIdx: 1, colIdx: 0 }
    ],
    images: [
      { uri: "https://statics.globant.com/production/public/2026-02/bg-desktop-fifa.jpg", rowIdx: 1, colIdx: 1 },
      { uri: "https://statics.globant.com/production/public/2026-02/bg-mobile-fifa.jpg.jpg", rowIdx: 1, colIdx: 2 }
    ]
  },

  // 4. TwoColumn (Positional - AI Pods)
  {
    rows: 2,
    cols: 2,
    content: [
      ['two-column (light)', ''],
      [
        "AI-NATIVE DELIVERY\nMeet Globant AI Pods\nForget technology services as you know them. AI-native delivery, built for output, not hours. Think: autonomous agents executing end-to-end, domain experts validating every result, and a system that learns with every interaction, turning AI into consistent, enterprise grade delivery.\nSubscribe to the future",
        "" // Col 1 will contain the inline image
      ]
    ],
    styles: [
      { text: "Subscribe to the future", bold: false, italic: true, link: "/ai-pods", rowIdx: 1, colIdx: 0 }
    ],
    paragraphStyles: [
      { text: "Meet Globant AI Pods", heading: "HEADING_2", rowIdx: 1, colIdx: 0 }
    ],
    images: [
      { uri: "https://statics.globant.com/production/public/2025-10/ai_pods_test_automation.png", rowIdx: 1, colIdx: 1 }
    ]
  },

  // 5. StudioCards (Positional - AI Studios - 8 Cards Total including Automotive)
  {
    rows: 7,
    cols: 3,
    content: [
      ['studio-cards', '', ''],
      [
        "AI Studios\nEvery industry re-imagined with the power of AI.\nEnd to end process re-build with AI at the core, bringing efficiency and quality outcomes faster than ever.",
        "",
        ""
      ],
      [
        "Financial Services\nWe reimagine how financial services operate in the age of intelligent agents.\nFind out more",
        "Sports\nWe leverage AI, data, and technology to increase fan engagement, reach, and monetization opportunities.\nFind out more",
        "Healthcare & Life Science\nWe improve the connection between technology and life sciences, combining bio-science talent with AI-driven solutions.\nFind out more"
      ],
      [
        "Retail\nWe innovate through digital retail solutions with AI-driven supply chain visibility and automation.\nFind out more",
        "Airlines\nWe drive digital transformation in the airline industry by focusing on passenger experience and leveraging AI.\nFind out more",
        "Games\nWe design and develop world-class games and digital platforms across multiple channels, integrating AI for enhanced gameplay.\nFind out more"
      ],
      [
        "Automotive\nWe bridge the past and future of the automotive industry, creating AI-driven solutions to enhance customer experiences, boost efficiency, and build the future of mobility.\nFind out more",
        "Energy\nEnergy, Mining and Multiutilities transformational services to solve hurdles, revolutionize efficiencies and power up value chains through tech & AI.\nFind out more",
        ""
      ],
      // CTA rendered centered below the grid (live placement), via key-value rows
      ["ctaText", "Find your industry", ""],
      ["ctaUrl", "/ai-studios", ""]
    ],
    styles: [
      // Bold subtitle (matches live emphasis)
      { text: "Every industry re-imagined with the power of AI.", bold: true, rowIdx: 1, colIdx: 0 },
      // Card titles
      { text: "Financial Services", bold: true, rowIdx: 2, colIdx: 0 },
      { text: "Sports", bold: true, rowIdx: 2, colIdx: 1 },
      { text: "Healthcare & Life Science", bold: true, rowIdx: 2, colIdx: 2 },
      { text: "Retail", bold: true, rowIdx: 3, colIdx: 0 },
      { text: "Airlines", bold: true, rowIdx: 3, colIdx: 1 },
      { text: "Games", bold: true, rowIdx: 3, colIdx: 2 },
      { text: "Automotive", bold: true, rowIdx: 4, colIdx: 0 },
      { text: "Energy", bold: true, rowIdx: 4, colIdx: 1 },
      // Card links
      { text: "Find out more", bold: true, link: "/studio/financial-services", rowIdx: 2, colIdx: 0 },
      { text: "Find out more", bold: true, link: "/studio/sports", rowIdx: 2, colIdx: 1 },
      { text: "Find out more", bold: true, link: "/studio/healthcare-life-sciences", rowIdx: 2, colIdx: 2 },
      { text: "Find out more", bold: true, link: "/studio/retail", rowIdx: 3, colIdx: 0 },
      { text: "Find out more", bold: true, link: "/studio/airlines", rowIdx: 3, colIdx: 1 },
      { text: "Find out more", bold: true, link: "/studio/gaming", rowIdx: 3, colIdx: 2 },
      { text: "Find out more", bold: true, link: "/studio/automotive", rowIdx: 4, colIdx: 0 },
      { text: "Find out more", bold: true, link: "/studio/energy", rowIdx: 4, colIdx: 1 }
    ],
    paragraphStyles: [
      { text: "AI Studios", heading: "HEADING_2", rowIdx: 1, colIdx: 0 }
    ],
    images: [
      { uri: "https://statics.globant.com/production/public/2026-03/financial_services.jpg", rowIdx: 2, colIdx: 0 },
      { uri: "https://statics.globant.com/production/public/2026-02/Sports_0.jpg", rowIdx: 2, colIdx: 1 },
      { uri: "https://statics.globant.com/production/public/2026-02/healthcare_0.jpg", rowIdx: 2, colIdx: 2 },
      { uri: "https://statics.globant.com/production/public/2026-02/retail_0.jpg", rowIdx: 3, colIdx: 0 },
      { uri: "https://statics.globant.com/production/public/2026-02/airline.jpg", rowIdx: 3, colIdx: 1 },
      { uri: "https://statics.globant.com/production/public/2026-02/games.jpg", rowIdx: 3, colIdx: 2 },
      { uri: "https://statics.globant.com/production/public/2026-02/automotive.jpg", rowIdx: 4, colIdx: 0 },
      { uri: "https://statics.globant.com/production/public/2026-02/energy.jpg", rowIdx: 4, colIdx: 1 }
    ]
  },

  // 6. LogoScroll (Positional - Client Logos - 18 Logos Total)
  {
    rows: 8,
    cols: 3,
    content: [
      ['logo-scroll', '', ''],
      [
        "Over two decades powering the world's leading businesses",
        "",
        ""
      ],
      [
        "L'Oreal",
        "EA",
        "Santander"
      ],
      [
        "Nissan",
        "Danone",
        "Coca-Cola"
      ],
      [
        "HSBC",
        "J&J",
        "Rockwell"
      ],
      [
        "LiveNation",
        "FIFA",
        "F1"
      ],
      [
        "Adidas",
        "Warner Bros",
        "Intuit"
      ],
      [
        "Google",
        "Embraer",
        "British Airways"
      ]
    ],
    paragraphStyles: [
      { text: "Over two decades powering the world's leading businesses", heading: "HEADING_2", rowIdx: 1, colIdx: 0 }
    ],
    images: [
      { uri: 'https://statics.globant.com/production/public/2024-09/Loreal.svg', rowIdx: 2, colIdx: 0 },
      { uri: 'https://statics.globant.com/production/public/2024-09/EA.svg', rowIdx: 2, colIdx: 1 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Santander.svg', rowIdx: 2, colIdx: 2 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Nissan.svg', rowIdx: 3, colIdx: 0 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Danone.svg', rowIdx: 3, colIdx: 1 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Coca%20Cola.svg', rowIdx: 3, colIdx: 2 },
      { uri: 'https://statics.globant.com/production/public/2024-09/HSBC.svg', rowIdx: 4, colIdx: 0 },
      { uri: 'https://statics.globant.com/production/public/2024-09/J%26J.svg', rowIdx: 4, colIdx: 1 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Rockwell.svg', rowIdx: 4, colIdx: 2 },
      { uri: 'https://statics.globant.com/production/public/2024-09/LiveNation.svg', rowIdx: 5, colIdx: 0 },
      { uri: 'https://statics.globant.com/production/public/2024-09/FIFA.svg', rowIdx: 5, colIdx: 1 },
      { uri: 'https://statics.globant.com/production/public/2024-09/F1.svg', rowIdx: 5, colIdx: 2 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Adidas.svg', rowIdx: 6, colIdx: 0 },
      { uri: 'https://statics.globant.com/production/public/2024-09/WB.svg', rowIdx: 6, colIdx: 1 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Intuit.svg', rowIdx: 6, colIdx: 2 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Google.svg', rowIdx: 7, colIdx: 0 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Embraer.svg', rowIdx: 7, colIdx: 1 },
      { uri: 'https://statics.globant.com/production/public/2024-09/British%20Airways.svg', rowIdx: 7, colIdx: 2 }
    ]
  },

  // 7. Metrics (Positional - stats)
  {
    rows: 5,
    cols: 3,
    content: [
      ['metrics', '', ''],
      [
        // Live globant.com renders the stats band without a heading
        "",
        "",
        ""
      ],
      [
        "28,000+\nGlobers present in 35 countries in 5 continents",
        "Top 5\nStrongest IT Services Brands by Brand Finance",
        "AI Leader\nRecognized by IDC MarketScape report"
      ],
      [
        "Cloud Lead\nRecognized by IDC MarketScape report",
        "#1\nFastest-Growing IT Brand by Brand Finance",
        ""
      ],
      [
        "",
        "",
        ""
      ]
    ],
    styles: [
      { text: "28,000+", bold: true, rowIdx: 2, colIdx: 0 },
      { text: "Top 5", bold: true, rowIdx: 2, colIdx: 1 },
      { text: "AI Leader", bold: true, rowIdx: 2, colIdx: 2 },
      { text: "Cloud Lead", bold: true, rowIdx: 3, colIdx: 0 },
      { text: "#1", bold: true, rowIdx: 3, colIdx: 1 }
    ]
  },

  // 8. TwoColumn (Positional - Let's Connect Callout Banner)
  {
    rows: 2,
    cols: 2,
    content: [
      // compact: hugs the stats band above so both read as one block, like live
      ['two-column (light, center, compact)', ''],
      [
        // Live globant.com renders just a centered pill button after the stats band
        "Let's connect",
        ""
      ]
    ],
    styles: [
      { text: "Let's connect", bold: true, link: "/contact", rowIdx: 1, colIdx: 0 }
    ]
  },

  // 9. ServicesGrid (Positional - Core Studios with logos and CTA button properties)
  {
    rows: 5,
    cols: 3,
    content: [
      ['services-grid', '', ''],
      [
        "Overcome your business challenges with our Core Studios",
        "",
        ""
      ],
      [
        "GUT\nSupercharge your strategy, creativity, content, and full-funnel marketing with a focus on brand uniqueness.\nKnow more",
        "Digital Evolution\nAccelerate your product and platform engineering through fast code, cloud ops, digital twins, and immersive experiences.\nKnow more",
        "Enterprise\nPower your business transformation with SAP, AWS, Salesforce, Oracle, Microsoft, Google, Open AI and deep expertise.\nKnow more"
      ],
      [
        "ctaText",
        "See what Globant can do for you",
        ""
      ],
      [
        "ctaUrl",
        "/our-services",
        ""
      ]
    ],
    styles: [
      { text: "GUT", bold: true, rowIdx: 2, colIdx: 0 },
      { text: "Digital Evolution", bold: true, rowIdx: 2, colIdx: 1 },
      { text: "Enterprise", bold: true, rowIdx: 2, colIdx: 2 },
      { text: "Know more", bold: true, link: "/globant-gut", rowIdx: 2, colIdx: 0 },
      { text: "Know more", bold: true, link: "/digital-evolution", rowIdx: 2, colIdx: 1 },
      { text: "Know more", bold: true, link: "/our-services#studios-list", rowIdx: 2, colIdx: 2 }
    ],
    paragraphStyles: [
      { text: "Overcome your business challenges with our Core Studios", heading: "HEADING_2", rowIdx: 1, colIdx: 0 }
    ],
    images: [
      { uri: "https://statics.globant.com/production/public/2025-12/GUT-title-image.jpg", rowIdx: 2, colIdx: 0 },
      { uri: "https://statics.globant.com/production/public/2024-06/Network-digital%20evolution.jpg", rowIdx: 2, colIdx: 1 },
      { uri: "https://statics.globant.com/production/public/2024-06/Network-enterprise.jpg", rowIdx: 2, colIdx: 2 }
    ]
  },

  // 10. CaseStudy (Positional - Success Stories)
  {
    rows: 5,
    cols: 3,
    content: [
      ['case-study', '', ''],
      [
        "Reinvention Stories\nAs people and as brands, we are always growing, changing, evolving. Explore the power of reinvention with us and learn about our most transformative client stories.",
        "",
        ""
      ],
      [
        "Formula 1\nWe built the Team Content Delivery System (TCDS) for Formula 1® — a high-performance platform reshaping how teams process data.\nLearn more",
        "LA Clippers\nWe reinvented fan experiences for sports and entertainment with the tech behind LA's new smart venue, Intuit Dome.\nLearn more",
        "Nissan\nReinventing automotive customer experiences with Globant. Leading the way in digital retail, connected cars, and predictive analytics.\nLearn more"
      ],
      [
        "Pixelynx\nBridging the gap between music and the Metaverse with Pixelynx. Designing new ways for fans and artists to interact.\nLearn more",
        "P.volve\nReinventing health and fitness. How P.volve is challenging the fitness industry with clinical science.\nRead case study",
        "Metropolitan Police\nTo improve public access to the Metropolitan Police, we helped build an online system to significantly reduce response times.\nRead case study"
      ],
      [
        "Rockwell Automation\nGlobant helps Rockwell Automation embrace agile development at scale to co-develop modern control and automation systems.\nLearn more",
        "IDB\nGlobant worked for IDB optimizing internal processes with RPA, increasing operational efficiency and data accuracy.\nLearn more",
        ""
      ]
    ],
    styles: [
      { text: "Formula 1", bold: true, rowIdx: 2, colIdx: 0 },
      { text: "LA Clippers", bold: true, rowIdx: 2, colIdx: 1 },
      { text: "Nissan", bold: true, rowIdx: 2, colIdx: 2 },
      { text: "Pixelynx", bold: true, rowIdx: 3, colIdx: 0 },
      { text: "P.volve", bold: true, rowIdx: 3, colIdx: 1 },
      { text: "Metropolitan Police", bold: true, rowIdx: 3, colIdx: 2 },
      { text: "Rockwell Automation", bold: true, rowIdx: 4, colIdx: 0 },
      { text: "IDB", bold: true, rowIdx: 4, colIdx: 1 },
      { text: "Learn more", bold: true, link: "https://more.globant.com/globant-official-partner-formula1", rowIdx: 2, colIdx: 0 },
      { text: "Learn more", bold: true, link: "https://reports.globant.com/en/trends/intuit-dome-partnership/?utm_source=hom", rowIdx: 2, colIdx: 1 },
      { text: "Learn more", bold: true, link: "https://more.globant.com/nissan-leading-automotive-reinvention", rowIdx: 2, colIdx: 2 },
      { text: "Learn more", bold: true, link: "https://www.youtube.com/watch?v=t0N2eaOpng4", rowIdx: 3, colIdx: 0 },
      { text: "Read case study", bold: true, link: "https://statics.globant.com/production/public/2023-03/Pvolve Case Study - Globant.pdf", rowIdx: 3, colIdx: 1 },
      { text: "Read case study", bold: true, link: "https://statics.globant.com/production/public/2019-08/Globant_partners_with_MET.pdf", rowIdx: 3, colIdx: 2 },
      { text: "Learn more", bold: true, link: "https://www.youtube.com/watch?v=dUMHSP6PZzo", rowIdx: 4, colIdx: 0 },
      { text: "Learn more", bold: true, link: "https://www.youtube.com/watch?v=hEiZulXd7Tc", rowIdx: 4, colIdx: 1 }
    ],
    paragraphStyles: [
      { text: "Reinvention Stories", heading: "HEADING_2", rowIdx: 1, colIdx: 0 }
    ],
    images: [
      { uri: "https://statics.globant.com/production/public/case_study/F1%20%E2%80%93%201%20%281%29.jpg", rowIdx: 2, colIdx: 0 },
      { uri: "https://statics.globant.com/production/public/case_study/globant%20x%20intuit%20dome_0.jpg", rowIdx: 2, colIdx: 1 },
      { uri: "https://statics.globant.com/production/public/case_study/Nissan-Success%20storie.jpg", rowIdx: 2, colIdx: 2 },
      { uri: "https://statics.globant.com/production/public/case_study/PIXELYNX-Success%20storie.jpg", rowIdx: 3, colIdx: 0 },
      { uri: "https://statics.globant.com/production/public/case_study/PVolve-Success%20storie.jpg", rowIdx: 3, colIdx: 1 },
      { uri: "https://statics.globant.com/production/public/case_study/globant_MET_0_0.png", rowIdx: 3, colIdx: 2 },
      { uri: "https://statics.globant.com/production/public/case_study/globant_rockwell_0_0.png", rowIdx: 4, colIdx: 0 },
      { uri: "https://statics.globant.com/production/public/case_study/globant_IDB_0.png", rowIdx: 4, colIdx: 1 }
    ]
  },

  // 11. TwoColumn (Positional - Careers)
  {
    rows: 2,
    cols: 2,
    content: [
      ['two-column (light, banner)', ''],
      [
        "Reinventing careers\nWe aim to boost a culture of self-mastery with endless possibilities. By exploring five professional development dimensions, we empower Globers to be the owners of their careers, choosing their path, and nurturing their skill sets.\nGlobant careers",
        ""
      ]
    ],
    styles: [
      { text: "Globant careers", bold: false, italic: true, link: "/careers", rowIdx: 1, colIdx: 0 }
    ],
    paragraphStyles: [
      { text: "Reinventing careers", heading: "HEADING_2", rowIdx: 1, colIdx: 0 }
    ],
    images: [
      { uri: "https://statics.globant.com/production/public/2022-10/Mask%20Group%2071564.png", rowIdx: 1, colIdx: 1 }
    ]
  },

  // 12. TwoColumn (Positional - Be Kind with Badge Logo property)
  // banner-left: wide 1920x546 collage spans the section, text overlays the left half (live hero block)
  {
    rows: 3,
    cols: 2,
    content: [
      ['two-column (light, banner, banner-left)', ''],
      [
        "When you build a better company, you can build a better world.\nKindness is an essential part of our culture, putting people at the heart of what we do. Be Kind focuses on four key tenets: be kind to your peers, to humanity, to the planet and to yourself.\nKnow More",
        ""
      ],
      [
        "logo",
        "https://statics.globant.com/production/public/2021-12/Logo_small_Bekind%20%281%29.png"
      ]
    ],
    styles: [
      { text: "Know More", bold: false, italic: true, link: "/be-kind", rowIdx: 1, colIdx: 0 }
    ],
    paragraphStyles: [
      { text: "When you build a better company, you can build a better world.", heading: "HEADING_2", rowIdx: 1, colIdx: 0 }
    ],
    images: [
      { uri: "https://statics.globant.com/production/public/2023-07/GL-BK-bg_image-desktop.jpg", rowIdx: 1, colIdx: 1 }
    ]
  },

  // 13. Contact Form (Positional with Desktop + Mobile background images)
  {
    rows: 2,
    cols: 3,
    content: [
      ['contact-form (light)', '', ''],
      [
        "Tell us how we can help you\nWe partner with brands to build what's next. Get in touch to start your reinvention journey.",
        "", // Col 1 contains desktop form background image
        ""  // Col 2 contains mobile form background image
      ]
    ],
    paragraphStyles: [
      { text: "Tell us how we can help you", heading: "HEADING_2", rowIdx: 1, colIdx: 0 }
    ],
    images: [
      { uri: "https://statics.globant.com/production/public/2023-06/BG-footer-GL_home.jpg", rowIdx: 1, colIdx: 1 },
      { uri: "https://statics.globant.com/production/public/2023-06/BG-footer-GL_home_0.jpg", rowIdx: 1, colIdx: 2 }
    ]
  },

  // NOTE: The FAQ table was removed for replica parity — the live globant.com
  // homepage has no FAQ section. (Re-add it to demo FAQPage JSON-LD generation.)

  // 14. Footer (Positional — matches the live globant.com footer)
  // Row 1: copyright cell, Contact Us column, Follow Us column, newsletter
  // blurb (the email input itself is part of footer.html). Row 2: legal links.
  // Links must stay NON-bold; bold non-link paragraphs become column headings.
  {
    rows: 3,
    cols: 4,
    content: [
      ['footer', '', '', ''],
      [
        "All rights reserved Globant 2026",
        "Contact Us\nDrop us a line\nhi@globant.com",
        "Follow Us\nFacebook\nLinkedIn\nYoutube\nInstagram\nX",
        "Sign up to receive our news, insights, and event invitations."
      ],
      [
        "Privacy Policy\nTerms of Service\nSite Map\nCookie Policy\nVulnerability Disclosure Policy",
        "",
        "",
        ""
      ]
    ],
    styles: [
      { text: "Contact Us", bold: true, rowIdx: 1, colIdx: 1 },
      { text: "hi@globant.com", link: "mailto:hi@globant.com", rowIdx: 1, colIdx: 1 },
      { text: "Follow Us", bold: true, rowIdx: 1, colIdx: 2 },
      { text: "Facebook", link: "https://www.facebook.com/Globant", rowIdx: 1, colIdx: 2 },
      { text: "LinkedIn", link: "https://www.linkedin.com/company/globant", rowIdx: 1, colIdx: 2 },
      { text: "Youtube", link: "https://www.youtube.com/Globant", rowIdx: 1, colIdx: 2 },
      { text: "Instagram", link: "https://www.instagram.com/globantpics", rowIdx: 1, colIdx: 2 },
      { text: "X", link: "https://twitter.com/globant", rowIdx: 1, colIdx: 2 },
      { text: "Privacy Policy", link: "/privacy-policy", rowIdx: 2, colIdx: 0 },
      { text: "Terms of Service", link: "/terms-of-service", rowIdx: 2, colIdx: 0 },
      { text: "Site Map", link: "/sitemap", rowIdx: 2, colIdx: 0 },
      { text: "Cookie Policy", link: "/cookie-policy", rowIdx: 2, colIdx: 0 },
      { text: "Vulnerability Disclosure Policy", link: "/vulnerability-disclosure", rowIdx: 2, colIdx: 0 }
    ]
  }
];

async function main() {
  const hasCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_AUTH_AUTODETECT === 'true';
  if (!hasCreds && !fs.existsSync(KEY_FILE)) {
    console.error(`Key file not found at ${KEY_FILE}. Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_AUTH_AUTODETECT=true to use Workload Identity.`);
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    ...(hasCreds ? {} : { keyFile: KEY_FILE }),
    scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/documents']
  });
  
  const drive = google.drive({ version: 'v3', auth });
  
  console.log("Resolving 'globant-demo-new-authoring' in folder:", FOLDER_ID);
  const response = await drive.files.list({
    q: `'${FOLDER_ID}' in parents and name = 'globant-demo-new-authoring' and trashed = false`,
    fields: 'files(id, name)'
  });
  
  const files = response.data.files || [];
  if (files.length === 0) {
    console.error("Document 'globant-demo-new-authoring' not found in Drive!");
    process.exit(1);
  }
  
  const DOC_ID = files[0].id;
  console.log("Resolved Document ID:", DOC_ID);
  
  const docs = google.docs({ version: 'v1', auth });

  // 1. Clear Document body
  let doc = await docs.documents.get({ documentId: DOC_ID });
  const docLength = doc.data.body?.content?.[doc.data.body.content.length - 1]?.endIndex || 2;
  
  if (docLength > 2) {
    console.log(`Clearing ${docLength - 2} characters...`);
    await docs.documents.batchUpdate({
      documentId: DOC_ID,
      requestBody: {
        requests: [{
          deleteContentRange: { range: { startIndex: 1, endIndex: docLength - 1 } }
        }]
      }
    });
  }

  // 2. Insert tables in reverse order (stacking them correctly)
  for (let i = tablesData.length - 1; i >= 0; i--) {
    const tableDef = tablesData[i];
    console.log(`Inserting Table ${i + 1}: ${tableDef.content[0][0]}`);

    await docs.documents.batchUpdate({
      documentId: DOC_ID,
      requestBody: {
        requests: [
          { insertTable: { rows: tableDef.rows, columns: tableDef.cols, location: { index: 1 } } },
          { insertText: { location: { index: 1 }, text: "\n\n" } }
        ]
      }
    });

    // Refresh doc to find indices
    doc = await docs.documents.get({ documentId: DOC_ID });
    const firstTableBlock = doc.data.body?.content?.find(el => el.table);
    const table = firstTableBlock.table;
    const writeRequests = [];
    const imageJobs = [];
    const stylingJobs = [];
    const paragraphStylingJobs = [];

    for (let r = tableDef.rows - 1; r >= 0; r--) {
      const row = table.tableRows?.[r];
      if (!row) continue;
      
      for (let c = tableDef.cols - 1; c >= 0; c--) {
        const cell = row.tableCells?.[c];
        if (!cell) continue;

        let cellText = tableDef.content[r]?.[c] || '';
        const imgDef = tableDef.images && tableDef.images.find(img => img.rowIdx === r && img.colIdx === c);
        
        if (imgDef) {
          const isSvg = imgDef.uri.toLowerCase().endsWith('.svg');
          if (isSvg) {
            // Write SVG URL as raw text in the cell (Google Docs API doesn't support SVGs as inline images)
            cellText = (cellText ? cellText + "\n" : "") + imgDef.uri;
          } else {
            // Prepend a newline to leave space for the image at the start of the cell
            cellText = "\n" + cellText;
            imageJobs.push({
              uri: imgDef.uri,
              rowIdx: r,
              colIdx: c
            });
          }
        }

        if (cellText) {
          const startIndex = cell.content[0].startIndex;
          writeRequests.push({
            insertText: { location: { index: startIndex }, text: cellText }
          });
          
          // Check if we need to style anything in this cell text
          if (tableDef.styles) {
            tableDef.styles.forEach(styleDef => {
              const matchesCoord = (styleDef.rowIdx === undefined || (styleDef.rowIdx === r && styleDef.colIdx === c));
              if (matchesCoord) {
                // Look for original text (without prepended newline)
                const textIndex = tableDef.content[r][c].indexOf(styleDef.text);
                if (textIndex !== -1) {
                  stylingJobs.push({
                    text: styleDef.text,
                    bold: styleDef.bold,
                    italic: styleDef.italic,
                    link: styleDef.link,
                    rowIdx: r,
                    colIdx: c
                  });
                }
              }
            });
          }

          // Check if we need to apply paragraph styles
          if (tableDef.paragraphStyles) {
            tableDef.paragraphStyles.forEach(styleDef => {
              const matchesCoord = (styleDef.rowIdx === undefined || (styleDef.rowIdx === r && styleDef.colIdx === c));
              if (matchesCoord) {
                const textIndex = tableDef.content[r][c].indexOf(styleDef.text);
                if (textIndex !== -1) {
                  paragraphStylingJobs.push({
                    text: styleDef.text,
                    heading: styleDef.heading,
                    rowIdx: r,
                    colIdx: c
                  });
                }
              }
            });
          }
        }
      }
    }

    // Write text to cells
    if (writeRequests.length > 0) {
      await docs.documents.batchUpdate({ documentId: DOC_ID, requestBody: { requests: writeRequests } });
    }
    
    // Write images to cells
    if (imageJobs.length > 0) {
      doc = await docs.documents.get({ documentId: DOC_ID });
      const currentTableBlock = doc.data.body?.content?.find(el => el.table);
      const currentTable = currentTableBlock.table;
      
      const imageRequests = [];
      imageJobs.forEach(job => {
        const cell = currentTable.tableRows[job.rowIdx].tableCells[job.colIdx];
        imageRequests.push({
          insertInlineImage: {
            uri: job.uri,
            location: { index: cell.content[0].startIndex }
          }
        });
      });
      
      if (imageRequests.length > 0) {
        await docs.documents.batchUpdate({ documentId: DOC_ID, requestBody: { requests: imageRequests } });
      }
    }
    
    // Pass 3: Apply styling
    if (stylingJobs.length > 0) {
      doc = await docs.documents.get({ documentId: DOC_ID });
      const currentTableBlock = doc.data.body?.content?.find(el => el.table);
      const currentTable = currentTableBlock.table;
      
      const styleRequests = [];
      stylingJobs.forEach(job => {
        const cell = currentTable.tableRows[job.rowIdx].tableCells[job.colIdx];
        let foundOffset = -1;
        // Search elements in the cell to find the exact offset of the string
        for (const el of cell.content) {
          if (el.paragraph) {
            for (const run of el.paragraph.elements) {
              if (run.textRun && run.textRun.content) {
                const idx = run.textRun.content.indexOf(job.text);
                if (idx !== -1) {
                  foundOffset = run.startIndex + idx;
                  break;
                }
              }
            }
          }
          if (foundOffset !== -1) break;
        }
        
        if (foundOffset !== -1) {
          styleRequests.push({
            updateTextStyle: {
              range: { startIndex: foundOffset, endIndex: foundOffset + job.text.length },
              textStyle: { 
                bold: !!job.bold, 
                italic: !!job.italic,
                link: job.link ? { url: job.link } : null 
              },
              fields: "bold,italic,link"
            }
          });
        }
      });
      
      if (styleRequests.length > 0) {
        await docs.documents.batchUpdate({ documentId: DOC_ID, requestBody: { requests: styleRequests } });
      }
    }

    // Pass 4: Apply paragraph styles (HEADING_1, HEADING_2, etc.)
    if (paragraphStylingJobs.length > 0) {
      doc = await docs.documents.get({ documentId: DOC_ID });
      const currentTableBlock = doc.data.body?.content?.find(el => el.table);
      const currentTable = currentTableBlock.table;
      
      const paragraphRequests = [];
      paragraphStylingJobs.forEach(job => {
        const cell = currentTable.tableRows[job.rowIdx].tableCells[job.colIdx];
        let foundOffset = -1;
        for (const el of cell.content) {
          if (el.paragraph) {
            for (const run of el.paragraph.elements) {
              if (run.textRun && run.textRun.content) {
                const idx = run.textRun.content.indexOf(job.text);
                if (idx !== -1) {
                  foundOffset = run.startIndex + idx;
                  break;
                }
              }
            }
          }
          if (foundOffset !== -1) break;
        }
        
        if (foundOffset !== -1) {
          paragraphRequests.push({
            updateParagraphStyle: {
              range: { startIndex: foundOffset, endIndex: foundOffset + 1 },
              paragraphStyle: { namedStyleType: job.heading },
              fields: "namedStyleType"
            }
          });
        }
      });
      
      if (paragraphRequests.length > 0) {
        await docs.documents.batchUpdate({ documentId: DOC_ID, requestBody: { requests: paragraphRequests } });
      }
    }
  }

  console.log('✅ Success! Upgraded positional authoring with real inline images written to Google Doc.');
}

main().catch(err => console.error(err));
