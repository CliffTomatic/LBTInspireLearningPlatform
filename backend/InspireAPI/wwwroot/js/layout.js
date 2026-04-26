async function loadLayout() {
    try {
        const headerPlaceholder = document.getElementById("header-placeholder");
        const footerPlaceholder = document.getElementById("footer-placeholder");

        if (headerPlaceholder) {
            const headerResponse = await fetch("/partials/header.html");
            headerPlaceholder.innerHTML = await headerResponse.text();
        }

        if (footerPlaceholder) {
            const footerResponse = await fetch("/partials/footer.html");
            footerPlaceholder.innerHTML = await footerResponse.text();
        }
    } catch (error) {
        console.error("Failed to load layout:", error);
    }
}

loadLayout();