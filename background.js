chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "getMemes") {
        fetch("https://www.dollogallery.xyz/api/memes")
            .then(res => {
                return res.json();
            })
            .then(data => {
                sendResponse({ memes: data });
            })
            .catch(err => {
                sendResponse({ error: err.toString() });
            });
        return true;
    }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "downloadImage") {
        fetch(message.url)
            .then(res => {
                if (!res.ok) throw new Error("Network response not OK");

                const contentType = res.headers.get("Content-Type");
                if (!['image/png', 'image/jpeg', 'image/gif'].includes(contentType)) {
                    sendResponse({ error: "Type not supported" });
                    return;
                }

                return res.blob();
            })
            .then(blob => {
                if (!blob) return;

                const MAX_SIZE = 25 * 1024 * 1024;
                if (blob.size > MAX_SIZE) {
                    sendResponse({ error: "File too big" });
                    return;
                }

                return blob.arrayBuffer().then(buffer => {
                    const array = Array.from(new Uint8Array(buffer));
                    sendResponse({ array, type: blob.type });
                });
            })
            .catch(err => {
                sendResponse({ error: "Error dl" });
            });

        return true;
    }
});