const baseURL = 'http://localhost/proyecto-tecweb/backend';

$(document).ready(function () {
    getUserID();

    // Sidebar toggle
    $('#sidebarToggle').click(function () {
        $('.sidebar').toggleClass('active');
    });

    // File input handling
    // File input handling
    $('#fileInput').change(function () {
        handleFile(this.files[0]);
    });

    // Drag and Drop
    const dropZone = document.getElementById('dropZone');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('highlight');
        $(dropZone).css('border-color', 'var(--primary-blue)');
        $(dropZone).css('background-color', 'rgba(59, 130, 246, 0.05)');
    }

    function unhighlight(e) {
        dropZone.classList.remove('highlight');
        $(dropZone).css('border-color', 'var(--border-light)');
        $(dropZone).css('background-color', 'transparent');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFile(files[0]);

        // Update input file
        $('#fileInput')[0].files = files;
    }

    function handleFile(file) {
        if (file) {
            $('#fileName').text(file.name);
            $('#dropZone').css('border-color', 'var(--primary-blue)');
            $('#dropZone').css('background-color', 'rgba(59, 130, 246, 0.05)');
        }
    }

    function getUserID() {
        let user_id = null;
        $.get(`${baseURL}/auth/status`, function (authData) {
            if (authData.is_logged_in) {
                user_id = authData.user.id;
                user_name = authData.user.name;
                $('.user-name').text(user_name);
            } else {
                alert("Debes iniciar sesión para subir recursos.");
                window.location.href = '../views/announcement.html'; // Redirect
                return;
            }
        });
    }

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
            // Simulate login if not logged in
            if (!authData.is_logged_in) {
                authData.is_logged_in = true;
                authData.user = { id: 1, name: 'Developer' }; // Mock user
            }

            if (!authData.is_logged_in) {
                alert("Debes iniciar sesión para subir recursos.");
                window.location.href = '../views/login.html'; // Redirect to login if available
                return;
            }

            const formData = {
                name: $('#name').val(),
                description: $('#description').val(),
                route: '/uploads/' + file.name, // Simulated path
                type: file.name.split('.').pop().toLowerCase(), // Auto-extract type
                language: $('#language').val(),
                category: $('#category').val(),
                departamento: $('#department').val(),
                empresa: $('#company').val(),
                date: (function () {
                    const now = new Date();
                    const pad = (n) => n.toString().padStart(2, '0');
                    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
                })(), // YYYY-MM-DD HH:MM:SS
                id_user: authData.user ? authData.user.id : 1
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

    $('#logoutBtn').on('click', function (e) {
        e.preventDefault();

        if (!confirm("¿Estas seguro de que deseas cerrar sesión?")) return;

        $.ajax({
            url: baseURL + '/auth/logout',
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    window.location.href = '../index.html';
                } else {
                    alert('No se pudo cerrar sesión correctamente');
                }
            },
            error: function () {
                console.error('Error al intentar cerrar sesión en el servidor');
                window.location.href = '../index.html';
            }
        });
    });
});
