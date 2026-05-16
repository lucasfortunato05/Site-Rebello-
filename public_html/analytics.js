window.dataLayer = window.dataLayer || [];

function gtag(){
    window.dataLayer.push(arguments);
}

window.gtag = window.gtag || gtag;

gtag("set", "ads_data_redaction", true);
gtag("js", new Date());
gtag("config", "AW-18074211748", {
    allow_ad_personalization_signals: false,
    anonymize_ip: true,
    restricted_data_processing: true
});
