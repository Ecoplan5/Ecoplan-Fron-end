document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value.toLowerCase();
    const articles = document.querySelectorAll('#articlesContainer .col');
    articles.forEach((article)=>{
        const title = article.querySelector('.card-title').textContent.toLowerCase();
        const description = article.querySelector('.card-text').textContent.toLowerCase();
        if (title.includes(query) || description.includes(query)) article.style.display = 'block';
        else article.style.display = 'none';
    });
});

//# sourceMappingURL=blog.33901292.js.map
