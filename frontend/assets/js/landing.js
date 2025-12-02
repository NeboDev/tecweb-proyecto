$(document).ready(function () {
    let baseURL = 'http://localhost/proyecto/backend';
    loadTopUsers();
    loadFiles();

    function loadTopUsers() {
        $.ajax({
            url: baseURL + '/stats/top-contributors',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Segundo lugar indice 1
                $('.files-number').eq(0).text(data[1].total_uploads + ' archivos');
                $('.username-inside').eq(0).text('@' + data[1].name);

                // Primer lugar indice 0
                $('.files-number').eq(1).text(data[0].total_uploads + ' archivos');
                $('.username-inside').eq(1).text('@' + data[0].name);

                // Tercer lugar indice 2
                $('.files-number').eq(2).text(data[2].total_uploads + ' archivos');
                $('.username-inside').eq(2).text('@' + data[2].name);
            },
            error: function (xhr, status, error) {
                console.error("Error al cargar top contributors:", error);
            }
        });
    }

    function loadFiles() {
        $.ajax({
            url: baseURL + '/resources',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                const resources = data;
                let template = '';
                resources.forEach(resource => {
                    template += `
                <tr data-id="${resource.id_resource}">
                    <td>${resource.name}</td>
                    <td>${resource.description || '—'}</td>
                    <td>
                        <i class="${getDeviconClass(resource.type)}"></i>
                        <span class="data-badge badge-type">
                            ${resource.language}
                        </span>
                    </td>
                    <td>
                        <span class="data-badge badge-category">
                            ${resource.category}
                        </span>
                    </td>
                    <td class="data-date">${resource.date}</td>
                </tr>
            `;
                });

                $("#resources").html(template);
            },
            error: function (xhr, status, error) {
                console.error("Error al cargar archivos:", error);
            }
        });
    }



});
