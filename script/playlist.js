const domain = "http://127.0.0.1:5500"; 
window.onload = renderPlaylist();

function renderPlaylist() {
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');
    // 校验空值
    if (typeof uid === null || typeof uid != "string" || uid.trim() === "") {
        console.info("uid为空");
        return;
    }

    var playlistContent = document.getElementById("playlist-content");
    playlistContent.style.display = 'block';

    var requestBody = {
        uid: uid
    };
    console.log(uid);

    const userInfo = document.getElementById("user-info");
    userInfo.remove();
    fetch(domain, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                // 查询失败
                throw new Error('网络错误');
            }
        }) // 解析JSON响应
        .then(data => {
            // TODO 如果数据不为空则渲染页面，否则提示用户数据为空
            console.log(data)
        }) // 处理数据
        .catch(error => {
            // 恢复删除的div
            document.body.appendChild(userInfo);
            console.error('错误:', error);
        });
}