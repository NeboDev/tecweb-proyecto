const baseURL = 'http://localhost/tecweb-proyecto/backend';

$(document).ready(function () {
    loadResources();

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
});

function loadResources() {
    $.get(`${baseURL}/resources`, function (data) {
        renderTable(data);
    }).fail(function () {
        console.error("Error al cargar recursos");
    });
}

function searchResources(query) {
    $.get(`${baseURL}/resources/search`, { search: query }, function (data) {
        renderTable(data);
    }).fail(function () {
        console.error("Error en la búsqueda");
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
        tbody.append(`
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="material-icons" style="color:var(--primary-blue); font-size:20px;">description</span>
                        <span style="font-weight: 500;">${resource.name}</span>
                    </div>
                </td>
                <td style="color: var(--text-secondary); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${resource.description || '-'}
                </td>
                <td><span style="background:#e0f2fe; color:#0369a1; padding:4px 8px; border-radius:4px; font-size:0.8rem;">${resource.type}</span></td>
                <td>${resource.category}</td>
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

function deleteResource(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este archivo?")) {
        $.post(`${baseURL}/resources/delete`, { id: id }, function (response) {
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
        }).fail(function () {
            alert("Error de conexión al intentar eliminar.");
        });
    }
}

function downloadResource(id) {
    // m4rvick id, change it to the user id of the logged in user
    const userId = 3;

    $.post(`${baseURL}/resources/download`, {
        id_resource: id,
        id_user: userId
    }, function (response) {
        if (response.status === 'success') {
            alert("¡Descarga registrada! Iniciando descarga...");
        } else {
            console.error("Error al registrar descarga:", response.message);
            alert("Error al registrar la descarga");
        }
    }).fail(function () {
        console.error("Error de conexión");
        alert("Error de conexión al intentar descargar");
    });
}
