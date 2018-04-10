$('#btnComment').on('click',function (req,res) {
    $.ajax({
       type:'POST',
        url:'/api/comments/post',
        data:{
            articleId:$('#article_id').val(),
            content:$('#commentContent').val()
        },
        success:function (res) {
            console.log(res)
            renderComment(res.data.comments)
        }
    });
})

function renderComment(comments) {
    var html='';
    for (var i = 0; i < comments.length; i++) {
        html+='<div class="messageBox">' +
            '            <span>'+comments[i].username+'</span>\n' +
            '            <span class="gravity_right">'+comments[i].addTime+'</span>\n' +
            '            <P>'+comments[i].content+'</P>' +
            '        </div>';
    }
    $('#messageList').html(html)
}