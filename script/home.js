const domain = "http://127.0.0.1:5500"; 

document.getElementById("user-form").addEventListener("submit", getPlaylist);

function getPlaylist(event) {
    // 阻止默认表单提交
    event.preventDefault();

    var uid = document.querySelector('#uid').value;
    // 校验空值
    if (typeof uid === null || typeof uid != "string" || uid.trim() === "") {
        console.info("uid为空");
        return;
    }

    var playlistUrl = domain + '/playlist.html?uid=' + uid;
    window.location.assign(playlistUrl);
}