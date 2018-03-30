var order='lsof -i :3000';
var exec = require('child_process').exec;
var qqname='shuai';
exec(order, function(err, stdout, stderr) {
    if(err){ return console.log(err); }
    stdout.split('\n').filter(function(line){
        var p=line.trim().split(/\s+/);
        var address=p[1];
        if(address!=undefined && address!="PID"){
            exec('kill '+ address,function(err, stdout, stderr){
                    if(err){
                        return console.log('释放指定端口失败！！');
                    }
                    console.log('占用指定端口的程序被成功杀掉！');
                });
        }
    });
});
# 这是脚本是用来杀死进程占用的3000端口