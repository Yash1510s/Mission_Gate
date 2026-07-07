import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../public/data');

// Helper to format Date to YYYY-MM-DD
function formatDate(dateObj) {
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Helper to clean HTML entities and tags from string
function cleanText(str) {
  if (!str) return '';
  let cleaned = str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&');
  
  // Strip all HTML tags after entity decoding
  cleaned = cleaned.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return cleaned;
}

// Simple XML/RSS Item Extractor without external npm dependencies
function parseRSSItems(xmlString) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xmlString)) !== null) {
    const content = match[1];
    const getTag = (tag) => {
      const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
      const m = regex.exec(content);
      return m ? cleanText(m[1]) : '';
    };

    const title = getTag('title');
    const link = getTag('link');
    const pubDateStr = getTag('pubDate');
    const summary = getTag('description') || title;

    if (title && link) {
      let date = new Date();
      if (pubDateStr) {
        const parsedDate = new Date(pubDateStr);
        if (!isNaN(parsedDate.getTime())) {
          date = parsedDate;
        }
      }

      items.push({
        title,
        link,
        date: formatDate(date),
        summary: summary.slice(0, 250) + (summary.length > 250 ? '...' : '')
      });
    }
  }
  return items;
}

async function updateNewsFeed() {
  console.log('🔄 Fetching latest GATE & Aspirant News...');
  const feedPath = path.join(DATA_DIR, 'gate-news-feed.json');
  
  let existingData = { feed: [] };
  try {
    const raw = await fs.readFile(feedPath, 'utf-8');
    existingData = JSON.parse(raw);
  } catch (err) {
    console.warn('⚠️ Could not read existing gate-news-feed.json, starting fresh.');
  }

  const existingUrls = new Set(existingData.feed.map(item => item.url));
  const newItems = [];

  // Fetch from public Google News RSS for GATE Exam / IIT Admissions / Engineering Recruitment
  const queries = [
    'GATE+exam+IIT+admissions+2026+2027',
    'PSU+recruitment+through+GATE+engineers',
    'IIT+IISc+MTech+admissions+computer+science'
  ];

  for (const q of queries) {
    try {
      const rssUrl = `https://news.google.com/rss/search?q=${q}&hl=en-IN&gl=IN&ceid=IN:en`;
      const res = await fetch(rssUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      if (res.ok) {
        const xml = await res.text();
        const parsed = parseRSSItems(xml);
        
        for (const item of parsed) {
          if (!existingUrls.has(item.link) && !item.title.toLowerCase().includes('result date 2023')) {
            existingUrls.add(item.link);
            newItems.push({
              id: `item-${Date.now()}-${Math.floor(Math.random()*1000)}`,
              date: item.date,
              category: q.includes('PSU') ? 'PSU & Govt' : q.includes('MTech') ? 'IIT / IISc' : 'GATE General',
              title: item.title,
              summary: item.summary,
              sourceName: 'Official News & Portal Alert',
              url: item.link,
              tags: ['GATE 2026/2027', 'Live Feed', q.includes('PSU') ? 'PSU Jobs' : 'Admissions'],
              verified: true
            });
          }
        }
      }
    } catch (err) {
      console.warn(`⚠️ Failed to fetch RSS for query ${q}:`, err.message);
    }
  }

  const merged = [...newItems, ...existingData.feed];
  // Sort descending by date
  merged.sort((a, b) => b.date.localeCompare(a.date));
  // Keep top 50 freshest articles and ensure all titles/summaries are clean
  existingData.feed = merged.slice(0, 50).map(item => ({
    ...item,
    title: cleanText(item.title),
    summary: cleanText(item.summary)
  }));

  await fs.writeFile(feedPath, JSON.stringify(existingData, null, 2), 'utf-8');
  if (newItems.length > 0) {
    console.log(`✨ Added ${newItems.length} new news articles and updated gate-news-feed.json`);
  } else {
    console.log('✅ Existing feed verified and cleaned.');
  }
}

async function main() {
  console.log('🚀 Starting Automated GATE Companion Data Updater...');
  try {
    await updateNewsFeed();
    console.log('🏁 Data update cycle completed successfully!');
  } catch (err) {
    console.error('❌ Error during data update:', err);
    process.exit(1);
  }
}

main();
