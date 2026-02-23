function injectDisposeMailButton(input) {
    if (input.dataset.disposemailInjected) return;
    input.dataset.disposemailInjected = "true";

    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    wrapper.style.width = "100%";

    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const button = document.createElement("button");
    button.innerText = "DM";
    button.title = "Use DisposeMail";
    button.style.position = "absolute";
    button.style.right = "10px";
    button.style.top = "50%";
    button.style.transform = "translateY(-50%)";
    button.style.zIndex = "1000";
    button.style.backgroundColor = "#2563eb";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.padding = "2px 6px";
    button.style.fontSize = "10px";
    button.style.cursor = "pointer";
    button.style.fontWeight = "bold";

    button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // In a real extension, we would fetch a new address via message passing to background script
        // For now, we'll generate a random one or use a placeholder
        const randomPrefix = Math.random().toString(36).substring(2, 10);
        const domain = "disposemail.xyz";
        const email = `${randomPrefix}@${domain}`;

        input.value = email;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    wrapper.appendChild(button);
}

function findEmailFields() {
    const inputs = document.querySelectorAll('input[type="email"], input[name*="email"], input[id*="email"]');
    inputs.forEach(injectDisposeMailButton);
}

// Initial find
findEmailFields();

// Watch for dynamic changes
const observer = new MutationObserver(() => {
    findEmailFields();
});

observer.observe(document.body, { childList: true, subtree: true });
