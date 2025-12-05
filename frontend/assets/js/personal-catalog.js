const baseURL = 'http://localhost/tecweb-proyecto/backend';

let currentUserId = null;

$(document).ready(function () {
    getUserID();

    let timeout = null;
    $('#searchInput').on('keyup', function () {
        clearTimeout(timeout);
        const query = $(this).val();
        timeout = setTimeout(function () {
            if (query.length > 0) {
                searchResources(query);
            } else {
                loadResources();
            }
        }, 300);
    });

    // Sidebar toggle
    $('#sidebarToggle').click(function () {
        $('.sidebar').toggleClass('active');
    });

    $('#logoutBtn').on('click', function (e) {
        e.preventDefault();

        if (!confirm("¿Estas seguro de que deseas cerrar sesión?")) return;

        $.ajax({
            url: baseURL + '/auth/logout',
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    window.location.href = 'logout.html';
                } else {
                    alert('No se pudo cerrar sesión correctamente: ' + response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error al intentar cerrar sesión:', error);
                alert('Error de conexión al cerrar sesión: ' + xhr.status + ' ' + error);
            }
        });
    });
});

function getUserID() {
    $.ajax({
        url: `${baseURL}/auth/status`,
        type: 'GET',
        dataType: 'json',
        success: function (authData) {
            if (authData.is_logged_in) {
                currentUserId = authData.user.id;
                user_name = authData.user.name;
                $('.user-name').text(user_name);
                loadResources();
            } else {
                alert("Debes iniciar sesión para ver tus archivos.");
                window.location.href = '../views/announcement.html';
                return;
            }
        },
        error: function (xhr, status, error) {
            console.error("Error checking auth status:", error);
        }
    });
}

function loadResources() {
    if (!currentUserId) return;

    $.ajax({
        url: `${baseURL}/resources/user-resources`,
        type: 'GET',
        data: { id_user: currentUserId },
        dataType: 'json',
        success: function (data) {
            renderTable(data);
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar recursos:", error);
        }
    });
}

function searchResources(query) {
    if (!currentUserId) return;

    $.ajax({
        url: `${baseURL}/resources/search-useresources`,
        type: 'GET',
        data: { search: query, id_user: currentUserId },
        dataType: 'json',
        success: function (data) {
            renderTable(data);
        },
        error: function (xhr, status, error) {
            console.error("Error en la búsqueda:", error);
        }
    });
}

function renderTable(data) {
    const tbody = $('#resourcesTable');
    tbody.empty();

    if (data.length === 0) {
        tbody.append('<tr><td colspan="6" style="text-align:center; padding: 2rem;">No se encontraron archivos</td></tr>');
        return;
    }

    data.forEach(resource => {
        const iconClass = getDeviconClass(resource.type);
        const iconHtml = `<a href="javascript:void(0)" onclick="downloadResource(${resource.id_resource})" style="text-decoration:none; color:inherit; display:flex; align-items:center; cursor:pointer;" title="Descargar"><i class="${iconClass}" style="font-size: 20px;"></i></a>`;
        tbody.append(`
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        ${iconHtml}
                        <span style="font-weight: 500;">${resource.name}</span>
                    </div>
                </td>
                <td style="color: var(--text-secondary); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${resource.description || '-'}
                </td>
                <td><span style="background:#e0f2fe; color:#0369a1; padding:4px 8px; border-radius:4px; font-size:0.8rem;">${resource.type}</span></td>
                <td>${resource.category}</td>
                <td>${resource.departamento || '-'}</td>
                <td>${resource.empresa || '-'}</td>
                <td>${resource.date}</td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="downloadResource(${resource.id_resource})" class="btn-icon-sm" title="Descargar" style="color: var(--primary-blue); background: none; border: none; cursor: pointer;">
                            <i class="bi bi-download"></i>
                        </button>
                        <button onclick="deleteResource(${resource.id_resource})" class="btn-icon-sm" title="Eliminar" style="color: #ef4444; background: none; border: none; cursor: pointer;">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
    });
}

function getFileIcon(filename) {
    if (!filename) return '<span class="material-icons" style="color:var(--primary-blue); font-size:20px;">description</span>';

    const ext = filename.split('.').pop().toLowerCase();
    const iconClass = getDeviconClass(ext);

    return `<i class="${iconClass}" style="font-size: 20px;"></i>`;
}

function getDeviconClass(type) {
    const fileType = type.toLowerCase();

    const deviconMap = {
        // Documentos
        'pdf': 'bi bi-file-earmark-pdf-fill text-danger',
        'doc': 'bi bi-file-earmark-word text-primary',
        'docx': 'bi bi-filetype-docx text-primary',
        'txt': 'bi bi-file-earmark-text',
        'md': 'devicon-markdown-plain colored',

        // Imágenes
        'jpg': 'bi bi-file-earmark-image-fill text-primary',
        'jpeg': 'bi bi-file-earmark-image-fill text-primary',
        'png': 'bi bi-file-earmark-image-fill text-primary',
        'gif': 'bi bi-filetype-gif',

        // Lenguajes de programación
        'js': 'devicon-javascript-plain colored',
        'ts': 'devicon-typescript-plain colored',
        'py': 'devicon-python-plain colored',
        'java': 'devicon-java-plain colored',
        'cpp': 'devicon-cplusplus-plain colored',
        'c': 'devicon-c-plain colored',
        'cs': 'devicon-csharp-plain colored',
        'php': 'devicon-php-plain colored',
        'html': 'devicon-html5-plain colored',
        'css': 'devicon-css3-plain colored',
        'sql': 'devicon-mysql-plain colored',
        'json': 'devicon-nodejs-plain colored',
        'xml': 'devicon-xml-plain colored',

        // Archivos comprimidos
        'zip': 'bi bi-file-earmark-zip-fill text-warning',
        'rar': 'bi bi-file-earmark-zip-fill text-warning'
    };

    return deviconMap[fileType] || 'bi bi-file-earmark text-secondary';
}

function deleteResource(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este archivo?")) {
        $.ajax({
            url: `${baseURL}/resources/delete`,
            type: 'POST',
            data: { id: id },
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    // Recargar la tabla
                    const query = $('#searchInput').val();
                    if (query.length > 0) {
                        searchResources(query);
                    } else {
                        loadResources();
                    }
                } else {
                    alert("Error al eliminar: " + response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error de conexión:", error);
                alert("Error de conexión al intentar eliminar.");
            }
        });
    }
}

function downloadResource(id) {
    if (!currentUserId) {
        alert("Error: No se ha identificado al usuario. Intenta recargar la página.");
        return;
    }

    $.ajax({
        url: `${baseURL}/resources/download`,
        type: 'POST',
        data: {
            id_resource: id,
            id_user: currentUserId
        },
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                alert("¡Descarga registrada! Iniciando descarga...");
            } else {
                console.error("Error al registrar descarga:", response.message);
                alert("Error al registrar la descarga");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error de conexión:", error);
            alert("Error de conexión al intentar descargar");
        }
    });
}
