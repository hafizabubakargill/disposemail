document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('email-display');
    const copyBtn = document.getElementById('copy-btn');
    const refreshBtn = document.getElementById('refresh-btn');

    function updateDisplay() {
        // In a real extension, we would get this from sync storage or the background script
        const email = localStorage.getItem('disposemail_ext_address') || generateNew();
        display.innerText = email;
    }

    function generateNew() {
        const prefix = Math.random().toString(36).substring(2, 10);
        const email = `${prefix}@disposemail.xyz`;
        localStorage.setItem('disposemail_ext_address', email);
        return email;
    }

    copyBtn.addEventListener('click', () => {
        const email = display.innerText;
        navigator.clipboard.writeText(email).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = 'Copied!';
            setTimeout(() => copyBtn.innerText = originalText, 2000);
        });
    });

    refreshBtn.addEventListener('click', () => {
        display.innerText = generateNew();
    });

    updateDisplay();
});
