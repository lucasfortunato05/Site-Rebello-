let redirectUrl = "/";

try {
    window.sessionStorage.setItem("rebello-scroll-target", "equipe");
} catch (error) {
    // Storage can be blocked by browser privacy settings.
    redirectUrl = "/#equipe";
}

window.location.replace(redirectUrl);
