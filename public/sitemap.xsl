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
          body { background: #0a0a0a; color: #e5e7eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-height: 100vh; }
          .header { background: #0a0a0a; border-bottom: 1px solid #1f1f1f; padding: 24px 40px; }
          .header-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
          .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
          .logo-icon { width: 32px; height: 32px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
          .logo-icon svg { width: 20px; height: 20px; fill: none; stroke: white; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
          .logo-text { font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -0.025em; }
          .badge { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; background: #111111; border: 1px solid #1f1f1f; padding: 4px 10px; border-radius: 6px; }
          .container { max-width: 1200px; margin: 0 auto; padding: 40px; }
          .meta { font-size: 14px; color: #9ca3af; margin-bottom: 32px; }
          .meta strong { color: #ffffff; }
          table { width: 100%; border-collapse: collapse; background: #111111; border: 1px solid #1f1f1f; border-radius: 12px; overflow: hidden; }
          thead { background: #161616; }
          th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; font-weight: 700; padding: 16px 24px; border-bottom: 1px solid #1f1f1f; }
          td { padding: 16px 24px; border-bottom: 1px solid #1f1f1f; vertical-align: middle; }
          td a { color: #60a5fa; text-decoration: none; font-size: 14px; font-weight: 500; }
          td a:hover { color: #93c5fd; text-decoration: underline; }
          .freq { font-size: 11px; font-weight: 600; text-transform: capitalize; color: #9ca3af; }
          .priority { font-family: monospace; font-size: 13px; color: #9ca3af; }
          .date { font-size: 13px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-inner">
            <a class="logo" href="/">
              <div class="logo-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <span class="logo-text">DisposeMail</span>
            </a>
            <span class="badge">Sitemap</span>
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
