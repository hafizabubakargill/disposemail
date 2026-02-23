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
        <title>Sitemap — DisposeMail</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #09090f; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-height: 100vh; }
          .header { background: linear-gradient(135deg, #0f172a, #111827); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 28px 40px; }
          .header-inner { max-width: 860px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
          .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
          .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed); border-radius: 9px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(37,99,235,0.3); }
          .logo-icon svg { width: 18px; height: 18px; fill: none; stroke: white; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
          .logo-text { font-size: 18px; font-weight: 800; background: linear-gradient(90deg, #3b82f6, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
          .badge { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 6px; }
          .container { max-width: 860px; margin: 0 auto; padding: 40px; }
          .meta { font-size: 12px; color: #4b5563; margin-bottom: 32px; font-weight: 600; }
          .meta strong { color: #6b7280; }
          table { width: 100%; border-collapse: collapse; }
          thead tr { border-bottom: 1px solid rgba(255,255,255,0.06); }
          th { text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: #4b5563; font-weight: 700; padding: 0 0 12px 0; }
          td { padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
          td a { color: #60a5fa; text-decoration: none; font-size: 13px; font-weight: 500; word-break: break-all; }
          td a:hover { color: #93c5fd; text-decoration: underline; }
          .freq { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 2px 8px; border-radius: 99px; }
          .freq-monthly { background: rgba(99,102,241,0.12); color: #818cf8; }
          .freq-weekly { background: rgba(37,99,235,0.12); color: #60a5fa; }
          .priority { font-family: monospace; font-size: 12px; color: #6b7280; }
          .date { font-size: 11px; color: #374151; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-inner">
            <a class="logo" href="https://disposemail.xyz">
              <div class="logo-icon">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <span class="logo-text">DisposeMail</span>
            </a>
            <span class="badge">XML Sitemap</span>
          </div>
        </div>
        <div class="container">
          <p class="meta">
            <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> URLs indexed · Last built <strong><xsl:value-of select="substring(sitemap:urlset/sitemap:url[1]/sitemap:lastmod, 1, 10)"/></strong>
          </p>
          <table>
            <thead>
              <tr>
                <th style="width:60%">URL</th>
                <th style="width:15%">Frequency</th>
                <th style="width:10%">Priority</th>
                <th style="width:15%">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                  <td>
                    <span class="freq">
                      <xsl:attribute name="class">freq freq-<xsl:value-of select="sitemap:changefreq"/></xsl:attribute>
                      <xsl:value-of select="sitemap:changefreq"/>
                    </span>
                  </td>
                  <td class="priority"><xsl:value-of select="sitemap:priority"/></td>
                  <td class="date"><xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
