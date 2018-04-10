$(function () {

    $('#exit').on('click', function () {

        $.ajax({
            type: 'get',
            url: '/api/user/exit',
            Content_type: 'application/x-www-form-urlencoded',
            success: function (data) {
                if (data.code == 0) {
                    window.location="http://localhost:8080/"
                    // window.location.reload()
                }
            }
        })
    })
})