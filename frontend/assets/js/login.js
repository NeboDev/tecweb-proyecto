$(document).ready(function () {

    let baseURL = 'http://localhost/proyecto/backend';


    $('#passwordToggle').on('click', function () {
        const passwordInput = $('#password');
        const toggleIcon = $(this).find('.toggle-icon');

        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);
        toggleIcon.toggleClass('show-password');
    });


    $('#loginForm').on('submit', function (e) {
        e.preventDefault();

        const email = $('#email').val();
        const password = $('#password').val();
        let isValid = true;


        $('.form-group').removeClass('error');
        $('.error-message').text('');


        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            $('#emailError').text('Por favor ingresa un email valido');
            $('#email').closest('.form-group').addClass('error');
            isValid = false;
        }

        if (!password || password.length < 8) {
            $('#passwordError').text('La contraseña debe tener al menos 8 caracteres');
            $('#password').closest('.form-group').addClass('error');
            isValid = false;
        }

        if (isValid) {
            const submitBtn = $(this).find('.login-btn');
            submitBtn.addClass('loading');

            $.ajax({
                url: baseURL + '/auth/login',
                type: 'POST',
                data: {
                    email: email,
                    password: password
                },
                success: function (response) {
                    if (response.status === 'success') {
                        window.location.href = 'dashboard.html';
                    }
                },
                error: function (xhr) {
                    submitBtn.removeClass('loading');

                    let errorMessage = 'Error al conectar con el servidor';

                    if (xhr.status === 401) {
                        errorMessage = 'Email o contraseña incorrectos';
                    } else if (xhr.status === 400) {
                        errorMessage = 'Datos inválidos';
                    } else if (xhr.status === 500) {
                        errorMessage = 'Error interno del servidor';
                    }

                    $('#passwordError').text(errorMessage);
                    $('#password').closest('.form-group').addClass('error');
                }
            });
        }
    });

    $('#email').on('blur', function () {
        const email = $(this).val();
        const formGroup = $(this).closest('.form-group');

        if (email && !/\S+@\S+\.\S+/.test(email)) {
            $('#emailError').text('Por favor ingresa un email valido');
            formGroup.addClass('error');
        } else {
            formGroup.removeClass('error');
            $('#emailError').text('');
        }
    });

    $('#password').on('blur', function () {
        const password = $(this).val();
        const formGroup = $(this).closest('.form-group');

        if (password && password.length < 8) {
            $('#passwordError').text('La contraseña debe tener al menos 8 caracteres');
            formGroup.addClass('error');
        } else {
            formGroup.removeClass('error');
            $('#passwordError').text('');
        }
    });

    $('input').on('focus', function () {
        $(this).closest('.form-group').removeClass('error');
        $(this).closest('.form-group').find('.error-message').text('');
    });
});