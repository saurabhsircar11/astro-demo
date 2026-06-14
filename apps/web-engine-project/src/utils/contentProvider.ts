import { parseGoogleDoc, resolveSlugToDocId } from './docParser.js';

export interface Block {
  type: string;
  data: Record<string, any>;
}

export interface PageContent {
  metadata: Record<string, string>;
  blocks: Block[];
}

/**
 * Fallback mock payload — only used if Google Docs API is unavailable.
 * Real content is authored in the Google Doc and fetched via the APIs.
 */
const GLOBANT_MOCK_PAYLOAD: PageContent = {
  metadata: {
    title: "Globant AI Powerhouse | Meet AI Pods by Globant Enterprise AI",
    description: "We help organizations drive AI business transformation. Our AI enterprise solutions blend AI-powered engineering, innovation, and cutting-edge design.",
    robots: "index, follow",
    theme: "light"
  },
  blocks: [
    {
      type: "header",
      data: {
        cell_0_0: "<p>Globant</p>",
        cell_0_1: "<p><a href=\"/our-services\">Our Offering</a></p><p><a href=\"/about\">About</a></p><p><a href=\"/insights\">Insights</a></p><p><a href=\"/careers\">Careers</a></p><p><a href=\"/investors\">Investors</a></p>",
        cell_0_2: "<p><a href=\"/contact\">Contact Us</a></p><p>EN</p>",
        variants: ""
      }
    },
    {
      type: "disclaimer",
      data: {
        cell_0_0: "<p><strong>Important Notice – Misuse of the Globant Brand</strong></p><p>Globant has detected that third parties are using our name and brand without authorization on social media, websites, and fraudulent platforms that promote alleged investments. We emphasize that Globant does not offer investments or request money through third parties, and that our only official website is www.globant.com. We recommend that our users do not share personal information or make payments on unofficial websites. The security and trust of our community is our priority.</p>",
        variants: ""
      }
    },
    {
      type: "hero",
      data: {
        cell_0_0: "<img src=\"https://statics.globant.com/production/public/2026-02/FIFA_logo_copa.svg\" alt=\"FIFA badge\" class=\"hero__logo-badge\" /><p>OFFICIAL FIFA WORLD CUP 2026™ SUPPORTER</p><h1>Engineering for the World's Biggest Stage</h1><p>From connected fan ecosystems to real-time systems, Globant helps FIFA operate flawlessly under global demand.</p><p><a href=\"https://www.globant.com/news/globant-fifa-renewed-partnership-2026-2027\" class=\"btn btn--primary\">Learn how</a></p>",
        cell_0_1: "<img src=\"https://statics.globant.com/production/public/2026-02/bg-desktop-fifa.jpg\" alt=\"FIFA Hero background\" />",
        cell_0_2: "<img src=\"https://statics.globant.com/production/public/2026-02/bg-mobile-fifa.jpg.jpg\" alt=\"FIFA Hero mobile background\" />",
        variants: "left dark"
      }
    },
    {
      type: "two-column",
      data: {
        cell_0_0: "<p>AI-NATIVE DELIVERY</p><h2>Meet Globant AI Pods</h2><p>Forget technology services as you know them. AI-native delivery, built for output, not hours. Think: autonomous agents executing end-to-end, domain experts validating every result, and a system that learns with every interaction, turning AI into consistent, enterprise grade delivery.</p><p><a href=\"/ai-pods\" class=\"btn btn--secondary\">Subscribe to the future</a></p>",
        cell_0_1: "<img src=\"https://statics.globant.com/production/public/2025-10/ai_pods_test_automation.png\" alt=\"Meet Globant AI Pods\" />",
        variants: "light"
      }
    },
    {
      type: "studio-cards",
      data: {
        cell_0_0: "<h2>AI Studios</h2><p><strong>Every industry re-imagined with the power of AI.</strong></p><p>End to end process re-build with AI at the core, bringing efficiency and quality outcomes faster than ever.</p>",
        variants: "",
        items: [
          {
            title: "Financial Services",
            description: "We reimagine how financial services operate in the age of intelligent agents.",
            image: "https://statics.globant.com/production/public/2026-03/financial_services.jpg",
            link: "/studio/financial-services"
          },
          {
            title: "Sports",
            description: "We leverage AI, data, and technology to increase fan engagement, reach, and monetization opportunities.",
            image: "https://statics.globant.com/production/public/2026-02/Sports_0.jpg",
            link: "/studio/sports"
          },
          {
            title: "Healthcare & Life Science",
            description: "We improve the connection between technology and life sciences, combining bio-science talent with AI-driven solutions.",
            image: "https://statics.globant.com/production/public/2026-02/healthcare_0.jpg",
            link: "/studio/healthcare-life-sciences"
          },
          {
            title: "Retail",
            description: "We innovate through digital retail solutions with AI-driven supply chain visibility and automation.",
            image: "https://statics.globant.com/production/public/2026-02/retail_0.jpg",
            link: "/studio/retail"
          },
          {
            title: "Airlines",
            description: "We drive digital transformation in the airline industry by focusing on passenger experience and leveraging AI.",
            image: "https://statics.globant.com/production/public/2026-02/airline.jpg",
            link: "/studio/airlines"
          },
          {
            title: "Games",
            description: "We design and develop world-class games and digital platforms across multiple channels, integrating AI for enhanced gameplay.",
            image: "https://statics.globant.com/production/public/2026-02/games.jpg",
            link: "/studio/gaming"
          },
          {
            title: "Automotive",
            description: "We bridge the past and future of the automotive industry, creating AI-driven solutions to enhance customer experiences, boost efficiency, and build the future of mobility.",
            image: "https://statics.globant.com/production/public/2026-02/automotive.jpg",
            link: "/studio/automotive"
          },
          {
            title: "Energy",
            description: "Energy, Mining and Multiutilities transformational services to solve hurdles, revolutionize efficiencies and power up value chains through tech & AI.",
            image: "https://statics.globant.com/production/public/2026-02/energy.jpg",
            link: "/studio/energy"
          }
        ],
        ctaText: "Find your industry",
        ctaUrl: "/ai-studios"
      }
    },
    {
      type: "logo-scroll",
      data: {
        cell_0_0: "<h2>Over two decades powering the world's leading businesses</h2>",
        variants: "",
        items: [
          { name: "L'Oreal", logo: "https://statics.globant.com/production/public/2024-09/Loreal.svg", image: "https://statics.globant.com/production/public/2024-09/Loreal.svg" },
          { name: "EA", logo: "https://statics.globant.com/production/public/2024-09/EA.svg", image: "https://statics.globant.com/production/public/2024-09/EA.svg" },
          { name: "Santander", logo: "https://statics.globant.com/production/public/2024-09/Santander.svg", image: "https://statics.globant.com/production/public/2024-09/Santander.svg" },
          { name: "Nissan", logo: "https://statics.globant.com/production/public/2024-09/Nissan.svg", image: "https://statics.globant.com/production/public/2024-09/Nissan.svg" },
          { name: "Danone", logo: "https://statics.globant.com/production/public/2024-09/Danone.svg", image: "https://statics.globant.com/production/public/2024-09/Danone.svg" },
          { name: "Coca-Cola", logo: "https://statics.globant.com/production/public/2024-09/Coca%20Cola.svg", image: "https://statics.globant.com/production/public/2024-09/Coca%20Cola.svg" },
          { name: "HSBC", logo: "https://statics.globant.com/production/public/2024-09/HSBC.svg", image: "https://statics.globant.com/production/public/2024-09/HSBC.svg" },
          { name: "J&J", logo: "https://statics.globant.com/production/public/2024-09/J%26J.svg", image: "https://statics.globant.com/production/public/2024-09/J%26J.svg" },
          { name: "Rockwell", logo: "https://statics.globant.com/production/public/2024-09/Rockwell.svg", image: "https://statics.globant.com/production/public/2024-09/Rockwell.svg" },
          { name: "LiveNation", logo: "https://statics.globant.com/production/public/2024-09/LiveNation.svg", image: "https://statics.globant.com/production/public/2024-09/LiveNation.svg" },
          { name: "FIFA", logo: "https://statics.globant.com/production/public/2024-09/FIFA.svg", image: "https://statics.globant.com/production/public/2024-09/FIFA.svg" },
          { name: "F1", logo: "https://statics.globant.com/production/public/2024-09/F1.svg", image: "https://statics.globant.com/production/public/2024-09/F1.svg" },
          { name: "Adidas", logo: "https://statics.globant.com/production/public/2024-09/Adidas.svg", image: "https://statics.globant.com/production/public/2024-09/Adidas.svg" },
          { name: "Warner Bros", logo: "https://statics.globant.com/production/public/2024-09/WB.svg", image: "https://statics.globant.com/production/public/2024-09/WB.svg" },
          { name: "Intuit", logo: "https://statics.globant.com/production/public/2024-09/Intuit.svg", image: "https://statics.globant.com/production/public/2024-09/Intuit.svg" },
          { name: "Google", logo: "https://statics.globant.com/production/public/2024-09/Google.svg", image: "https://statics.globant.com/production/public/2024-09/Google.svg" },
          { name: "Embraer", logo: "https://statics.globant.com/production/public/2024-09/Embraer.svg", image: "https://statics.globant.com/production/public/2024-09/Embraer.svg" },
          { name: "British Airways", logo: "https://statics.globant.com/production/public/2024-09/British%20Airways.svg", image: "https://statics.globant.com/production/public/2024-09/British%20Airways.svg" }
        ]
      }
    },
    {
      type: "metrics",
      data: {
        sectionTitle: "Key Statistics",
        variants: "",
        backgroundImage: "https://statics.globant.com/production/public/2022-11/BG-stats.jpeg",
        items: [
          { value: "28,000+", label: "Globers present in 35 countries in 5 continents", logo: "https://statics.globant.com/production/public/2022-11/Icon%20material-lightbulb-outline.png" },
          { value: "Top 5", label: "Strongest IT Services Brands by <strong>Brand Finance</strong>", logo: "https://statics.globant.com/production/public/2022-11/Icon%20material-lightbulb-outline.png" },
          { value: "AI Leader", label: "Recognized by <strong>IDC MarketScape report</strong>", logo: "https://statics.globant.com/production/public/2022-11/Icon%20material-lightbulb-outline.png" },
          { value: "Cloud Lead", label: "Recognized by <strong>IDC MarketScape report</strong>", logo: "https://statics.globant.com/production/public/2022-11/Icon%20material-lightbulb-outline.png" },
          { value: "#1", label: "Fastest-Growing IT Brand by <strong>Brand Finance</strong>", logo: "https://statics.globant.com/production/public/2022-11/Icon%20material-lightbulb-outline.png" }
        ]
      }
    },
    {
      type: "two-column",
      data: {
        cell_0_0: "<h2>Let's Connect</h2><p>Our global teams are ready to help accelerate your technology and business transformation challenges.</p>",
        cell_0_1: "<p><a href=\"/contact\" class=\"btn btn--primary\">Let's connect</a></p>",
        variants: "light center"
      }
    },
    {
      type: "services-grid",
      data: {
        sectionTitle: "Overcome your business challenges with our Core Studios",
        variants: "",
        items: [
          {
            title: "GUT",
            description: "Supercharge your strategy, creativity, content, and full-funnel marketing with a focus on brand uniqueness and connected experiences.",
            image: "https://statics.globant.com/production/public/2025-12/GUT-title-image.jpg",
            link: "/globant-gut"
          },
          {
            title: "Digital Evolution",
            description: "Accelerate your product and platform engineering through fast code, cloud ops, digital twins, and immersive experiences.",
            image: "https://statics.globant.com/production/public/2024-06/Network-digital%20evolution.jpg",
            link: "/digital-evolution"
          },
          {
            title: "Enterprise",
            description: "Power your business transformation with SAP, AWS, Salesforce, Oracle, Microsoft, Google, Open AI and deep expertise in process optimization, ServiceNow, and sustainable ops.",
            image: "https://statics.globant.com/production/public/2024-06/Network-enterprise.jpg",
            link: "/our-services#studios-list"
          }
        ],
        ctaText: "See what Globant can do for you",
        ctaUrl: "/our-services"
      }
    },
    {
      type: "case-study",
      data: {
        cell_0_0: "<h2>Reinvention Stories</h2><p>As people and as brands, we are always growing, changing, evolving. At Globant, we’re reinventing the professional services industry, creating solutions that move our clients forward. Explore the power of reinvention with us and learn about our most transformative client stories.</p>",
        variants: "",
        items: [
          {
            title: "Formula 1",
            description: "We built the Team Content Delivery System (TCDS) for Formula 1® — a high-performance platform reshaping how teams process data and make critical decisions on race days.",
            image: "https://statics.globant.com/production/public/case_study/F1%20%E2%80%93%201%20%281%29.jpg",
            link: "https://more.globant.com/globant-official-partner-formula1",
            linkText: "Learn more"
          },
          {
            title: "LA Clippers",
            description: "We reinvented fan experiences for sports and entertainment with the tech behind LA's new smart venue, Intuit Dome.",
            image: "https://statics.globant.com/production/public/case_study/globant%20x%20intuit%20dome_0.jpg",
            link: "https://reports.globant.com/en/trends/intuit-dome-partnership/?utm_source=hom",
            linkText: "Learn more"
          },
          {
            title: "Nissan",
            description: "Reinventing automotive customer experiences with Globant. Leading the way in digital retail, connected cars, and predictive analytics.",
            image: "https://statics.globant.com/production/public/case_study/Nissan-Success%20storie.jpg",
            link: "https://more.globant.com/nissan-leading-automotive-reinvention",
            linkText: "Learn more"
          },
          {
            title: "Pixelynx",
            description: "Bridging the gap between music and the Metaverse with Pixelynx. Designing new ways for fans and artists to interact, perform, and share music digitally.",
            image: "https://statics.globant.com/production/public/case_study/PIXELYNX-Success%20storie.jpg",
            link: "",
            linkText: "Learn more"
          },
          {
            title: "P.volve",
            description: "Reinventing health and fitness. How P.volve is challenging the fitness industry with clinical science and customized digital platforms.",
            image: "https://statics.globant.com/production/public/case_study/PVolve-Success%20storie.jpg",
            link: "https://statics.globant.com/production/public/2023-03/Pvolve Case Study - Globant.pdf",
            linkText: "Read case study"
          },
          {
            title: "Metropolitan Police",
            description: "To improve public access to the Metropolitan Police, we helped build an online system to significantly reduce response times and streamline reporting.",
            image: "https://statics.globant.com/production/public/case_study/globant_MET_0_0.png",
            link: "https://statics.globant.com/production/public/2019-08/Globant_partners_with_MET.pdf",
            linkText: "Read case study"
          },
          {
            title: "Rockwell Automation",
            description: "Globant helps Rockwell Automation embrace agile development at scale to co-develop modern control and automation systems.",
            image: "https://statics.globant.com/production/public/case_study/globant_rockwell_0_0.png",
            link: "",
            linkText: "Learn more"
          },
          {
            title: "IDB",
            description: "Globant worked for IDB optimizing internal processes with RPA, increasing operational efficiency and data accuracy.",
            image: "https://statics.globant.com/production/public/case_study/globant_IDB_0.png",
            link: "",
            linkText: "Learn more"
          }
        ]
      }
    },
    {
      type: "two-column",
      data: {
        cell_0_0: "<h2>Reinventing careers</h2><p>We aim to boost a culture of self-mastery with endless possibilities. By exploring five professional development dimensions, we empower Globers to be the owners of their careers, choosing their path, and nurturing their skill sets.</p><p><a href=\"/careers\" class=\"btn btn--secondary\">Globant careers</a></p>",
        cell_0_1: "<img src=\"https://statics.globant.com/production/public/2022-10/Mask%20Group%2071564.png\" alt=\"Reinventing careers\" />",
        variants: "light"
      }
    },
    {
      type: "two-column",
      data: {
        cell_0_0: "<h2>When you build a better company, you can build a better world.</h2><p>Kindness is an essential part of our culture, putting people at the heart of what we do. Be Kind focuses on four key tenets: be kind to your peers, to humanity, to the planet and to yourself.</p><p><a href=\"/be-kind\" class=\"btn btn--secondary\">Know More</a></p>",
        cell_0_1: "<img src=\"https://statics.globant.com/production/public/2023-07/GL-BK-bg_image-desktop.jpg\" alt=\"Be Kind\" />",
        logo: "https://statics.globant.com/production/public/2021-12/Logo_small_Bekind%20%281%29.png",
        variants: "dark"
      }
    },
    {
      type: "contact-form",
      data: {
        sectionTitle: "Tell us how we can help you",
        sectionSubtitle: "We partner with brands to build what's next. Get in touch to start your reinvention journey.",
        cell_0_1: "<img src=\"https://statics.globant.com/production/public/2023-06/BG-footer-GL_home.jpg\" alt=\"Footer background desktop\" />",
        cell_0_2: "<img src=\"https://statics.globant.com/production/public/2023-06/BG-footer-GL_home_0.jpg\" alt=\"Footer background mobile\" />",
        variants: "dark"
      }
    },
    {
      type: "faq",
      data: {
        cell_0_0: "<h2>Frequently Asked Questions</h2><p>Got questions? We have answers.</p>",
        variants: "",
        items: [
          {
            question: "What is a Globant Studio?",
            answer: "Our Studios are deep business verticals combining target domain knowledge (like Healthcare, Finance, or Media) with cutting-edge tech capabilities."
          },
          {
            question: "How does Globant leverage AI?",
            answer: "We integrate AI across all Studios, developing custom LLMs, model pipelines, and AI-assisted coding frameworks to optimize engineering outputs."
          },
          {
            question: "Where does Globant operate?",
            answer: "We operate globally with major offices in the US, Europe, Latin America, and India, delivering next-generation digital products."
          }
        ]
      }
    },
    {
      type: "footer",
      data: {
        cell_0_0: "<p>All rights reserved Globant 2026</p>",
        cell_0_1: "<p><strong>Contact Us</strong></p><p>Drop us a line</p><p><a href=\"mailto:hi@globant.com\">hi@globant.com</a></p>",
        cell_0_2: "<p><strong>Follow Us</strong></p><p><a href=\"https://www.facebook.com/Globant\">Facebook</a></p><p><a href=\"https://www.linkedin.com/company/globant\">LinkedIn</a></p><p><a href=\"https://www.youtube.com/Globant\">Youtube</a></p><p><a href=\"https://www.instagram.com/globantpics\">Instagram</a></p><p><a href=\"https://twitter.com/globant\">X</a></p>",
        cell_0_3: "<p>Sign up to receive our news, insights, and event invitations.</p>",
        cell_1_0: "<p><a href=\"/privacy-policy\">Privacy Policy</a></p><p><a href=\"/terms-of-service\">Terms of Service</a></p><p><a href=\"/sitemap\">Site Map</a></p><p><a href=\"/cookie-policy\">Cookie Policy</a></p><p><a href=\"/vulnerability-disclosure\">Vulnerability Disclosure Policy</a></p>",
        variants: "dark"
      }
    }
  ]
};


interface DocCacheEntry {
  content: PageContent;
  expiresAt: number;
}

// In-memory SWR cache for parsed Google Doc ASTs
const docAstCache = new Map<string, DocCacheEntry>();
const DOC_TTL_MS = 10000; // 10 seconds fresh TTL, background revalidation afterwards

/**
 * Resolves the page AST for a given slug.
 */
export async function getPageAST(slug: string): Promise<PageContent> {
  const hasCredentials = !!process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_AUTH_AUTODETECT === 'true';
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const hardcodedDocId = process.env.GOOGLE_DOC_ID;

  // 'globant-demo' slug uses the hardcoded GOOGLE_DOC_ID from environment
  // (falls through to the standard fetch path below — no early mock return)

  if (hasCredentials) {
    const cacheKey = `doc::${slug}`;
    const now = Date.now();
    const cachedDoc = docAstCache.get(cacheKey);

    const isDocId = /^[a-zA-Z0-9-_]{40,60}$/.test(slug);

    // Dynamic fetch function to retrieve and parse content
    const fetchFreshContent = async (): Promise<PageContent> => {
      // 1. If slug is a direct Google Doc ID, fetch it directly
      if (isDocId) {
        console.log(`[ContentProvider] Slug "${slug}" matches Google Doc ID pattern. Fetching directly...`);
        return await parseGoogleDoc(slug);
      }

      // 2. Dynamic slug-based mount point directory mapping (Google Drive folder)
      if (folderId) {
        console.log(`[ContentProvider] Resolving slug "/${slug}" inside Drive folder: ${folderId}`);
        try {
          const docId = await resolveSlugToDocId(folderId, slug);
          if (docId) {
            return await parseGoogleDoc(docId);
          }
          console.log(`[ContentProvider] Slug "/${slug}" could not be resolved inside the Drive folder.`);
        } catch (driveErr: any) {
          console.error(`[ContentProvider] Google Drive folder resolver error: ${driveErr.message}. Falling back...`);
        }
      } 
      
      // 3. Fallback to direct Document ID querying via env variable
      if (hardcodedDocId && hardcodedDocId !== 'REPLACE_WITH_YOUR_GOOGLE_DOC_ID') {
        console.log(`[ContentProvider] Querying Google Docs API directly for fallback Doc ID: ${hardcodedDocId}`);
        return await parseGoogleDoc(hardcodedDocId);
      }

      throw new Error(`No document mapping found for slug "${slug}"`);
    };

    if (cachedDoc) {
      // If the cache is still fresh, return it instantly
      if (now < cachedDoc.expiresAt) {
        return cachedDoc.content;
      }

      // If the cache is stale, return it immediately and trigger background update (SWR)
      console.log(`[ContentProvider] SWR Stale hit for "${cacheKey}". Revalidating Google Docs API in background...`);
      fetchFreshContent()
        .then((content) => {
          docAstCache.set(cacheKey, {
            content,
            expiresAt: Date.now() + DOC_TTL_MS
          });
          console.log(`[ContentProvider] Background revalidation completed for "${cacheKey}"`);
        })
        .catch((err) => {
          console.error(`[ContentProvider] Background revalidation failed for "${cacheKey}":`, err.message);
        });

      return cachedDoc.content;
    }

    // Cache miss: perform synchronous fetch
    try {
      console.log(`[ContentProvider] Cache miss for "${cacheKey}". Fetching Google Docs API synchronously...`);
      const content = await fetchFreshContent();
      docAstCache.set(cacheKey, {
        content,
        expiresAt: Date.now() + DOC_TTL_MS
      });
      return content;
    } catch (err: any) {
      console.error("[ContentProvider] Error querying Google APIs, falling back to Mock:", err.message);
      return GLOBANT_MOCK_PAYLOAD;
    }
  }

  // If no credentials or document found, default to our Globant landing page demo
  console.log(`[ContentProvider] Fallback: Serving mock landing page for slug: "/${slug}"`);
  return GLOBANT_MOCK_PAYLOAD;
}

/**
 * Clears the Google Doc AST in-memory SWR cache.
 * If a slug is provided, clears only that slug's cache.
 * Otherwise, clears all cached documents.
 */
export function clearDocCache(slug?: string) {
  if (slug) {
    const cacheKey = `doc::${slug}`;
    const deleted = docAstCache.delete(cacheKey);
    console.log(`[ContentProvider Cache] Cleared cache for slug "${slug}": ${deleted}`);
  } else {
    docAstCache.clear();
    console.log('[ContentProvider Cache] Cleared all document caches.');
  }
}
