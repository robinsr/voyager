// Listen on port 9001
var gith = require('gith').create(9001);
// Import exec, to run our bash script
var exec = require('child_process').exec;

gith({
    repo: 'fideloper/example'
}).on('all', function(payload) {
    if (payload.branch === 'master') {
        // Exec a shell script
        exec("echo \"what?\" ", function(err, stdout, stderr) {
            console.log(err || stderr || stdout)
        });
    }
});