const baseURL = 'http://localhost/tecweb-proyecto/backend';

$(document).ready(function () {
    getUserID();

    // Sidebar toggle
    $('#sidebarToggle').click(function () {
        $('.sidebar').toggleClass('active');
    });

    $('#fileInput').change(function () {
        handleFile(this.files[0]);
    });

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
        $.ajax({
            url: `${baseURL}/auth/status`,
            type: 'GET',
            dataType: 'json',
            success: function (authData) {
                if (authData.is_logged_in) {
                    user_id = authData.user.id;
                    user_name = authData.user.name;
                    $('.user-name').text(user_name);
                } else {
                    alert("Debes iniciar sesión para subir recursos.");
                    window.location.href = '../views/announcement.html'; // Redirect
                    return;
                }
            },
            error: function (xhr, status, error) {
                console.error("Error checking auth status:", error);
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

        // Check auth status first
        $.ajax({
            url: `${baseURL}/auth/status`,
            type: 'GET',
            dataType: 'json',
            success: function (authData) {
                // Simulate login if not logged in (Legacy logic, consider removing)
                if (!authData.is_logged_in) {
                    authData.is_logged_in = true;
                    authData.user = { id: 1, name: 'Developer' }; // Mock user
                }

                if (!authData.is_logged_in) {
                    alert("Debes iniciar sesión para subir recursos.");
                    window.location.href = '../views/login.html';
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

                $.ajax({
                    url: `${baseURL}/resources`,
                    type: 'POST',
                    data: formData,
                    dataType: 'json',
                    success: function (response) {
                        console.log("Respuesta del servidor:", response);
                        if (response.status === 'success') {
                            alert("Recurso subido exitosamente!");
                            window.location.href = 'personal-catalog.html';
                        } else {
                            alert("Error: " + response.message);
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error("Error de conexión:", error);
                        alert("Error de conexión con el servidor");
                    },
                    complete: function () {
                        btn.removeClass('loading');
                        btn.prop('disabled', false);
                    }
                });

            },
            error: function () {
                alert("Error al verificar la sesión.");
                btn.removeClass('loading');
                btn.prop('disabled', false);
            }
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
