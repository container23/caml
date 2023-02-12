window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
gtag('js', new Date());

gtag('config', '<%= gtmId %>', {
    page_path: '<%= route %>',
    transport_url: document.location.origin
});


// this scripts should be loaded after page rendering
((ctx) => {
    // send custom gtag event 
    function sendEvent(name) {
        if (gtag && name) {
            gtag('event', name);
        }
    }

    function handleDiscordBtn() {
        sendEvent('discord_server_integration_click');
    }

    // register handlers
    const discordBtn = ctx.getElementById("discordIntegrateBtn");
    if (discordBtn) {
        discordBtn.addEventListener('click', handleDiscordBtn);
    }
})(document);