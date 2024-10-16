function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    const overlay = document.getElementById('overlay');

    if (searchBar.classList.contains('active')) {
        searchBar.classList.remove('active'); // Ferme la barre
        overlay.style.display = 'none'; // Masque l'overlay
    } else {
        searchBar.classList.add('active'); // Ouvre la barre
        overlay.style.display = 'block'; // Affiche l'overlay
    }
}
