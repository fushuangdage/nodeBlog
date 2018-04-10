$(function () {
    var $registerBox = $('#registerBox');
    var $loginBox = $('#loginBox');

    $registerBox.find('button').on('click', function () {
        // alert("onclick")
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                username: $registerBox.find('[name="username"]').val(),
                password: $registerBox.find('[name="password"]').val()
            },
            Content_type: 'application/x-www-form-urlencoded',

            success: function (data) {
                // console.log(data)
                $registerBox.find('.text_area').html(data.message)
                $loginBox.show()
                $registerBox.hide()
            }
        })
    })


    $loginBox.find('button').on('click', function () {
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: $loginBox.find('[name="username"]').val(),
                password: $loginBox.find('[name="password"]').val()
            },
            Content_type: 'application/x-www-form-urlencoded',
            success: function (data) {
                if (data.code == 0) {

                    window.location.reload()
                } else {

                    $loginBox.find('.text_area').html(data.message)
                }

            }
        })
    })

    $loginBox.find('.text_area').on('click', function () {
        $loginBox.hide()
        $registerBox.show()
    })

    $registerBox.find('.text_area').on('click', function () {
        $loginBox.show()
        $registerBox.hide()
    })

    $('#exit').on('click', function () {

        $.ajax({
            type: 'get',
            url: '/api/user/exit',
            Content_type: 'application/x-www-form-urlencoded',
            success: function (data) {
                if (data.code == 0) {
                    window.location.reload()
                }
            }
        })
    })



})