$(function () {
    var $registerBox = $('#registerBox');


    $registerBox.find('button').on('click', function () {
        // alert("onclick")
        $.ajax({
            type: 'post',
            url:'/api/user/register',
            data: {
                username: $registerBox.find('[name="username"]').val(),
                password: $registerBox.find('[name="password"]').val()
            },
            Content_type:'application/x-www-form-urlencoded',

            success: function (data) {
                // console.log(data)
            }
        })
    })
})