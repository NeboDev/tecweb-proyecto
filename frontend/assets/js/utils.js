function getDeviconClass(type) {
    const fileType = type.toLowerCase();

    const deviconMap = {
        // Documentos
        'pdf': 'bi bi-file-earmark-pdf-fill',
        'doc': 'bi bi-file-earmark-word text-primary',
        'docx': 'bi bi-filetype-docx',
        'txt': 'bi bi-file-earmark-text',
        'md': 'devicon-markdown-plain colored',
        'rtf': 'devicon-word-plain colored',

        // Imágenes
        'jpg': 'bi bi-filetype-jpg',
        'jpeg': 'bi bi-filetype-jpg',
        'png': 'bi bi-filetype-png',
        'gif': 'bi bi-filetype-gif',
        'bmp': 'devicon-photoshop-plain colored',
        'svg': 'bi bi-filetype-svg',
        'webp': 'devicon-photoshop-plain colored',
        // Lenguajes de programación
        'js': 'devicon-javascript-plain colored',
        'ts': 'devicon-typescript-plain colored',
        'jsx': 'devicon-react-original colored',
        'vue': 'devicon-vuejs-plain colored',
        'php': 'devicon-php-plain colored',
        'html': 'devicon-html5-plain colored',
        'css': 'devicon-css3-plain colored',
        'py': 'devicon-python-plain colored',
        'java': 'devicon-java-plain colored',
        'cpp': 'devicon-cplusplus-plain colored',
        'c': 'devicon-c-original colored',
        'cs': 'devicon-csharp-plain colored',
        'rb': 'devicon-ruby-plain colored',
        'go': 'devicon-go-plain colored',
        'rs': 'devicon-rust-plain colored',
        'swift': 'devicon-swift-plain colored',

        // Datos / DB
        'json': 'devicon-nodejs-plain colored',
        'xml': 'devicon-xml-plain colored',
        'sql': 'devicon-mysql-plain colored',           // generico SQL
        'mysql': 'devicon-mysql-plain colored',
        'postgres': 'devicon-postgresql-plain colored',
        'postgresql': 'devicon-postgresql-plain colored',
        'mssql': 'devicon-microsoftsqlserver-plain colored',
        'sqlite': 'devicon-sqlite-plain colored',
        'mariadb': 'devicon-mariadb-plain colored'
    };

    return deviconMap[fileType] || 'bi bi-file'; // fallback generico
}