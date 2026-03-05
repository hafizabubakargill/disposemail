<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <xsl:output method="html" version="1.0" encoding="utf-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Sitemap | DisposeMail</title>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            background-color: #000000; 
            color: #ffffff; 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
          }
          /* Background Grid &amp; Noise Effects */
          .bg-noise { content: ""; position: fixed; inset: 0; background: url('/noise.svg'); opacity: 0.05; pointer-events: none; z-index: 0; }
          .bg-grid { content: ""; position: fixed; inset: 0; background-image: linear-gradient(to right, rgba(128,128,128,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.07) 1px, transparent 1px); background-size: 24px 24px; z-index: 0; }
          
          .content-wrapper { position: relative; z-index: 10; flex: 1; display: flex; flex-direction: column; width: 100%; }
          
          .header { background: rgba(0,0,0,0.5); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 20px 0; position: sticky; top: 0; z-index: 50; }
          .header-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; }
          
          .logo { display: flex; align-items: center; gap: 12px; text-decoration: none; transition: opacity 0.2s ease; }
          .logo:hover { opacity: 0.8; }
          .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39); }
          .logo-icon svg { width: 20px; height: 20px; fill: none; stroke: white; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
          .logo-text { font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.03em; }
          .badge { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #3b82f6; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); padding: 6px 14px; border-radius: 9999px; }
          
          .container { max-width: 1200px; margin: 0 auto; padding: 60px 40px; width: 100%; flex: 1; }
          .hero-section { text-align: center; margin-bottom: 48px; }
          .hero-title { font-size: 48px; font-weight: 900; letter-spacing: -0.04em; margin-bottom: 16px; background: linear-gradient(135deg, #ffffff, #a1a1aa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .hero-desc { font-size: 18px; color: #a1a1aa; max-width: 600px; margin: 0 auto; line-height: 1.6; }
          
          .table-container { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); overflow: hidden; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
          table { width: 100%; border-collapse: collapse; }
          thead { background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05); }
          th { text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1aa; font-weight: 600; padding: 20px 32px; }
          td { padding: 20px 32px; border-bottom: 1px solid rgba(255,255,255,0.02); vertical-align: middle; transition: background 0.2s ease; }
          tr:hover td { background: rgba(255,255,255,0.025); }
          
          td a { color: #f4f4f5; text-decoration: none; font-size: 15px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; transition: color 0.2s ease; }
          td a::after { content: "↗"; font-family: system-ui; font-size: 12px; color: #52525b; opacity: 0; transform: translate(-4px, 4px); transition: all 0.2s ease; }
          td a:hover { color: #3b82f6; }
          td a:hover::after { opacity: 1; transform: translate(0, 0); color: #3b82f6; }
          
          .freq { font-size: 12px; font-weight: 600; text-transform: capitalize; padding: 4px 10px; border-radius: 6px; display: inline-block; }
          .freq-daily { background: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); }
          .freq-weekly { background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); }
          .freq-monthly { background: rgba(139, 92, 246, 0.1); color: #c084fc; border: 1px solid rgba(139, 92, 246, 0.2); }
          
          .priority { font-family: 'Inter', monospace; font-size: 14px; font-weight: 600; color: #d4d4d8; }
          .date { font-size: 14px; color: #a1a1aa; font-variant-numeric: tabular-nums; }
          
          @media (max-width: 768px) {
            .container { padding: 40px 20px; }
            th, td { padding: 16px; }
            .hero-title { font-size: 32px; }
            .hero-desc { font-size: 16px; }
            .priority-col, .freq-col { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="bg-noise"></div>
        <div class="bg-grid"></div>
        <div class="content-wrapper">
          <div class="header">
            <div class="header-inner">
              <a class="logo" href="/">
                <div class="logo-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <span class="logo-text">DisposeMail</span>
              </a>
              <span class="badge">Sitemap index</span>
            </div>
          </div>
          <div class="container">
            <div class="hero-section">
              <h1 class="hero-title">XML Sitemap Index</h1>
              <p class="hero-desc">This is the visual representation of our strict XML sitemap. It currently indexes <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> active pages translated across 5 languages.</p>
            </div>
            
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th style="width:55%">Canonical URL Route</th>
                    <th style="width:15%" class="freq-col">Update Frequency</th>
                    <th style="width:15%" class="priority-col">Crawl Priority</th>
                    <th style="width:15%">Last Mod Date</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:urlset/sitemap:url">
                    <tr>
                      <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                      <td class="freq-col">
                        <span class="freq">
                          <xsl:attribute name="class">freq freq-<xsl:value-of select="sitemap:changefreq"/></xsl:attribute>
                          <xsl:value-of select="sitemap:changefreq"/>
                        </span>
                      </td>
                      <td class="priority priority-col"><xsl:value-of select="sitemap:priority"/></td>
                      <td class="date"><xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
