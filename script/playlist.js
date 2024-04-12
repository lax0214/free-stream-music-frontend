const domain = "http://127.0.0.1:5500";

window.onload = renderPlaylist();


var selectAllCheckbox = document.getElementById("select-all-checkbox");
var exportButton = document.getElementById("button-export");
// 变更全选和导出按钮状态 
let checkbox = document.getElementsByClassName("playlist-item-checkbox");
let coverImg = document.getElementsByClassName("cover-img");
var checkboxNum = {
    total: checkbox.length,
    checkedNum: 0
}
for (let i = 0; i < checkbox.length; i++) {
    checkbox[i].addEventListener("change", () => changePlaylistStatus(checkbox[i]));
}
for (let i = 0; i < coverImg.length; i++) {
    coverImg[i].addEventListener("click", () => {
        var checkbox = coverImg[i].previousElementSibling;
        if (checkbox.checked) {
            checkbox.checked = false;
        } else {
            checkbox.checked = true;
        }
        changePlaylistStatus(checkbox);
    });
}
// 全选按钮逻辑
document.getElementById("select-all-checkbox").addEventListener("change", (event) => {
    let selectAllCheckbox = event.target;
    if (selectAllCheckbox.checked) {
        exportButton.style.opacity = 1;
        exportButton.classList.add("button-hover");
        for (let i = 0; i < checkbox.length; i++) {
            checkbox[i].checked = true;
        }
        checkboxNum.checkedNum = checkbox.length;
    } else {
        exportButton.style.opacity = 0.45;
        exportButton.classList.remove("button-hover");
        for (let i = 0; i < checkbox.length; i++) {
            checkbox[i].checked = false;
        }
        checkboxNum.checkedNum = 0;
    }
});
function changePlaylistStatus(checkbox) {
    if (checkbox.checked) {
        checkboxNum.checkedNum++;
    } else {
        checkboxNum.checkedNum--;
    }
    if (checkboxNum.checkedNum > 0) {
        exportButton.style.opacity = 1;
        exportButton.disabled = false;
        exportButton.classList.add("button-hover");
        if (checkboxNum.checkedNum == checkboxNum.total) {
            selectAllCheckbox.checked = true;
        } else {
            selectAllCheckbox.checked = false;
            
        }
    } else {
        exportButton.style.opacity = 0.45;
        exportButton.disabled = true;
        exportButton.classList.remove("button-hover");
    }
}


function renderPlaylist() {
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');
    // 校验空值
    if (typeof uid === null || typeof uid != "string" || uid.trim() === "") {
        console.info("uid为空");
        var playlistNodata = document.getElementById("playlist-nodata");
        playlistNodata.style.display = 'block';
        return;
    }

    var playlistContent = document.getElementById("playlist-content");
    playlistContent.style.display = 'block';
    var topbar = document.getElementById("topbar");
    topbar.style.display = 'block';

    var requestBody = {
        uid: uid
    };
    console.log(uid);

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

// 点击导出歌单
document.getElementById("button-export").addEventListener("click",  () => {
    document.getElementById("overlay").style.display = 'block';
    document.getElementById("pop-up-export").style.display = 'block';
});
// 导出歌单-输入邮箱
document.getElementById("export-to-email").addEventListener("input", (event) => {
    const inputValue = event.target.value;
    var confirmButton = document.getElementById("export-confirm");
    if (inputValue === '') {
        confirmButton.disabled = true;
        confirmButton.style.opacity = 0.45;
        confirmButton.classList.remove("button-hover");
    } else {
        confirmButton.disabled = false;
        confirmButton.style.opacity = 1;
        confirmButton.classList.add("button-hover");
    }
});
document.getElementById("export-to-email").addEventListener("change",  (event) => {
    const inputValue = event.target.value;
    var confirmButton = document.getElementById("export-confirm");
    if (inputValue === '') {
        confirmButton.disabled = true;
        confirmButton.style.opacity = 0.45;
        confirmButton.classList.remove("button-hover");
    }
});
// 导出歌单-确认
document.getElementById("export-confirm").addEventListener("click",  () => {
    document.getElementById("overlay").style.display = 'none';
    document.getElementById("pop-up-export").style.display = 'none';
});
// 导出歌单-取消
document.getElementById("export-cancle").addEventListener("click",  () => {
    document.getElementById("overlay").style.display = 'none';
    document.getElementById("pop-up-export").style.display = 'none';
});
// 导出歌单-提示
document.getElementById("export-form").addEventListener("submit",  (event) => {
    event.preventDefault();
    
    document.getElementById("overlay").style.display = 'none';
    document.getElementById("pop-up-export").style.display = 'none';
});