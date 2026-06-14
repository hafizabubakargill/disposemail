const fs = require('fs');
const path = require('path');

const files = ['en.ts', 'es.ts', 'pt.ts', 'ru.ts', 'zh.ts'];
const dir = path.join(__dirname, 'lib/blog-data');

const newCta = `      <div class="my-8 w-full flex justify-center">
        <a href="/free-tools" class="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all flex flex-col sm:flex-row items-center justify-between gap-6 group" style="text-decoration: none;">
            <div class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                <div class="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-white">
                    <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                    <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">Free Privacy Tools</span>
                    <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">Protect Your Digital Identity</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400 m-0 leading-tight">Explore our suite of free tools including Password Generators, Identity Generators, and more.</p>
                </div>
            </div>
            <div class="shrink-0 mt-4 sm:mt-0">
                <div class="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 inline-block">Explore Tools</div>
            </div>
        </a>
      </div>`;

files.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${file}, not found.`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    const parts = content.split('<div class="my-8 w-full flex justify-center">');
    let newContent = parts[0];
    
    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        const match = part.match(/[\s\S]*?omg10\.com[\s\S]*?<\/a>\s*<\/div>/);
        
        if (match) {
            console.log(`Found ad in ${file}, replacing...`);
            const remainder = part.substring(match[0].length);
            // Replace the matched portion with our CTA, wait, the split consumed the `<div class="my-8 ...">`
            // newCta includes the `<div class="my-8 ...">` so we just append it and then the remainder
            newContent += newCta + remainder;
        } else {
            newContent += '<div class="my-8 w-full flex justify-center">' + part;
        }
    }
    
    fs.writeFileSync(filePath, newContent);
    console.log(`Processed ${file}`);
});
