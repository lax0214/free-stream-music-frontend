const domain = "http://127.0.0.1:5500";
var checkboxNum = {
    total: 0,
    checkedNum: 0
}
window.onload = renderPlaylist();


var selectAllCheckbox = document.getElementById("select-all-checkbox");
var exportButton = document.getElementById("button-export");
// 变更全选和导出按钮状态 
let checkbox = document.getElementsByClassName("playlist-item-checkbox");
let coverImg = document.getElementsByClassName("cover-img");
for (let i = 0; i < checkbox.length; i++) {
    checkbox[i].addEventListener("change", () => changePlaylistStatus(checkbox[i]));
}
for (let i = 0; i < coverImg.length; i++) {
    coverImg[i].addEventListener("click", () => {
        var checkbox = coverImg[i].previousElementSibling;;
        checkbox.checked = true;
        changePlaylistStatus(checkbox);
    });
}

function changePlaylistStatus(checkbox) {
    if (checkbox.checked) {
        checkboxNum.checkedNum++;
    } else {
        checkboxNum.checkedNum--;
    }
    if (checkboxNum.checkedNum > 0) {
        exportButton.disabled = false;
        if (checkboxNum.checkedNum == checkboxNum.total) {
            selectAllCheckbox.checked = true;
        } else {

        }
    } else {
        exportButton.disabled = true;
    }
}

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
    checkboxNum.total = 12;

    // const userInfo = document.getElementById("user-info");
    // userInfo.remove();
    // fetch(domain, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(requestBody)
    // })
    //     .then(response => {
    //         if (response.ok) {
    //             return response.json();
    //         } else {
    //             // 查询失败
    //             throw new Error('网络错误');
    //         }
    //     }) // 解析JSON响应
    //     .then(data => {
    //         // TODO 如果数据不为空则渲染页面，否则提示用户数据为空
    //         console.log(data)
    //     }) // 处理数据
    //     .catch(error => {
    //         // 恢复删除的div
    //         document.body.appendChild(userInfo);
    //         console.error('错误:', error);
    //     });
}