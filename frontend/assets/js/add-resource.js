const baseURL = 'http://localhost/tecweb-proyecto/backend';

$(document).ready(function () {
    // Sidebar toggle
    $('#sidebarToggle').click(function () {
        $('.sidebar').toggleClass('active');
    });

    // File input handling
    $('#fileInput').change(function () {
        const file = this.files[0];
        if (file) {
            $('#fileName').text(file.name);
            $('#dropZone').css('border-color', 'var(--primary-blue)');

            // Auto-fill type if empty
            if (!$('#type').val()) {
                const ext = file.name.split('.').pop().toUpperCase();
                $('#type').val(ext);
            }
        }
    });

    // Form submission
    $('#addResourceForm').submit(function (e) {
        e.preventDefault();

        const btn = $(this).find('button[type="submit"]');
        const file = $('#fileInput')[0].files[0];

        if (!file) {
            alert("Por favor selecciona un archivo");
            return;
        }

        // Loading state
        btn.addClass('loading');
        btn.prop('disabled', true);

        // Prepare data
        // Note: Since the backend doesn't handle real file uploads yet,
        // we simulate the route path.
        // Check auth status first
        $.get(`${baseURL}/auth/status`, function (authData) {
            if (!authData.is_logged_in) {
                alert("Debes iniciar sesión para subir recursos.");
                window.location.href = '../views/login.html'; // Redirect to login if available
                return;
            }

            const formData = {
                name: $('#name').val(),
                description: $('#description').val(),
                route: '/uploads/' + file.name, // Simulated path
                type: $('#type').val(),
                language: $('#language').val(),
                category: $('#category').val(),
                date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                id_user: authData.user.id
            };

            console.log("Enviando datos:", formData);

            $.post(`${baseURL}/resources`, formData, function (response) {
                console.log("Respuesta del servidor:", response);
                if (response.status === 'success') {
                    alert("Recurso subido exitosamente!");
                    window.location.href = 'catalog.html';
                } else {
                    alert("Error: " + response.message);
                }
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    console.error("Error de conexión:", textStatus, errorThrown);
                    alert("Error de conexión con el servidor");
                })
                .always(function () {
                    btn.removeClass('loading');
                    btn.prop('disabled', false);
                });

        }).fail(function () {
            alert("Error al verificar la sesión.");
            btn.removeClass('loading');
            btn.prop('disabled', false);
        });
    });
});
