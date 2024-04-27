const domain = "http://127.0.0.1:5500";

window.onload = renderPlaylist();

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
    console.log(uid);

    const requestUrl = "http://127.0.0.1:8080" + "/netease/playlist/display?uid=" + uid;
    fetch(requestUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                // 查询失败
                throw new Error('网络错误');
            }
        }) // 解析JSON响应
        .then(playlistData => {
            // 如果数据不为空则渲染页面，否则提示用户数据为空
            if (Object.keys(playlistData).length === 0) {
                var playlistNodata = document.getElementById("playlist-nodata");
                playlistNodata.style.display = 'block';
            } else {
                var playlistContent = document.getElementById("playlist-content");
                playlistContent.style.display = 'block';
                var topbar = document.getElementById("topbar");
                topbar.style.display = 'block';
                // 创建歌单列表
                var playlistContent = document.getElementById("playlist-content");
                // example
                // var playlistData = [
                //     { "id": "123123", "creator": "大魔王不爱在非洲回血", "playlistName": "妞妞的歌单", "coverImg": "http://p1.music.126.net/Mp5LGF3wdt9tkbH4dzDSXQ==/109951168491113902.jpg" }
                // ]
                var playlistUl = null;
                for (var i = 0; i < playlistData.length; i++) {
                    var singlePlaylist = playlistData[i];
                    if (i == 0) {
                        var author = document.getElementById('author');
                        author.innerText = singlePlaylist.creator;
                    }
                    if (i % 5 == 0) {
                        playlistUl = document.createElement('ul');
                        playlistUl.classList.add("clearfix");
                        playlistContent.appendChild(playlistUl);
                    }
                    var playlistItem = document.createElement('li');
                    playlistItem.setAttribute("data-id", singlePlaylist.id);
                    playlistItem.classList.add("playlist-item");
                    // checkbox
                    var checkbox = document.createElement('input');
                    checkbox.setAttribute('type', 'checkbox');
                    checkbox.classList.add("playlist-item-checkbox");
                    playlistItem.appendChild(checkbox);
                    // cover
                    var coverImg = document.createElement('img');
                    coverImg.classList.add("cover-img");
                    coverImg.setAttribute('src', singlePlaylist.coverImg);
                    playlistItem.appendChild(coverImg);
                    // playlist name
                    var playlistName = document.createElement('p');
                    playlistName.classList.add("playlist-name");
                    var text = document.createTextNode(singlePlaylist.playlistName);
                    playlistName.appendChild(text);
                    playlistItem.appendChild(playlistName);

                    playlistUl.appendChild(playlistItem);
                }
            }
        })
        .then(data => {
            // 在元素创建后添加按钮逻辑
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
                    exportButton.disabled = true;
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

            // 点击导出歌单
            document.getElementById("button-export").addEventListener("click", () => {
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
            document.getElementById("export-to-email").addEventListener("change", (event) => {
                const inputValue = event.target.value;
                var confirmButton = document.getElementById("export-confirm");
                if (inputValue === '') {
                    confirmButton.disabled = true;
                    confirmButton.style.opacity = 0.45;
                    confirmButton.classList.remove("button-hover");
                }
            });
            // 导出歌单-确认
            document.getElementById("export-form").addEventListener("submit", (event) => {
                event.preventDefault();

                var emailInput = document.getElementById("export-to-email");
                var email = emailInput.value;
                var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email)) {
                    alert("邮箱格式错误🥴");
                    return;
                }

                var playlistIds = [];
                let checkboxs = document.getElementsByClassName("playlist-item-checkbox");
                for (let i = 0; i < checkboxs.length; i++) {
                    if (checkboxs[i].checked) {
                        playlistIds.push(checkbox[i].parentElement.getAttribute("data-id"));
                    }
                }

                var requestBody = {
                    email: email,
                    playlistIds: playlistIds
                };
                fetch("http://127.0.0.1:8080" + "/netease/playlist/download", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                })
                    .then(response => {
                        if (response.ok) {
                            document.getElementById("overlay").style.display = 'none';
                            document.getElementById("pop-up-export").style.display = 'none';
                            setTimeout(() => {
                                document.getElementById("export-reminder").style.display = 'block';
                            }, 500)
                            setTimeout(() => {
                                document.getElementById("export-reminder").style.display = 'none';
                            }, 3000)
                        } else {
                            // 查询失败
                            throw new Error('网络错误');
                        }
                    })
                    .catch(error => {
                        console.error('错误:', error);
                    });
            });
            // 导出歌单-取消
            document.getElementById("export-cancle").addEventListener("click", () => {
                document.getElementById("overlay").style.display = 'none';
                document.getElementById("pop-up-export").style.display = 'none';
            });
        })
        .catch(error => {
            console.error('错误:', error);
        });
}