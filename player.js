//功能區
var myMusic = document.getElementById("myMusic");
var volumeControl = document.getElementById("volumeControl");
var information = document.getElementById("information");
var progressBar = document.getElementById("progressBar");
var musicList = document.getElementById("musicList")
var functionButtons = document.getElementById("functionButtons");

var txtVolume = volumeControl.children[3]; //音量顯示input
var rangeVolume = volumeControl.children[0]; //音量調整range

var musicDuration = information.children[0];
var playStatus = information.children[1];
var btnPlay = functionButtons.children[0]; //播放鈕

var infoStatus = information.children[2]; //單曲循環鈕


/////////////////////////////////////////
function musicStatus() {

    if (infoStatus.innerText == "單曲循環") {
        changeMusic(0);
    }
    else if (infoStatus.innerText == "隨機播放") {
        var n = Math.floor(Math.random() * musicList.length);
        changeMusic(n - musicList.selectedIndex);
    }
    else if (infoStatus.innerText == "全曲循環" && musicList.length == musicList.selectedIndex + 1) {
        changeMusic(0 - musicList.selectedIndex);
    }
    else if (musicList.length == musicList.selectedIndex + 1) {   //是否為最後一首歌
        stopMusic();
    }
    else {    //不是最後一首歌就播下一首歌
        changeMusic(1);
    }
}


function setMode(mode) {
    infoStatus.innerHTML = infoStatus.innerHTML == mode ? "正常" : mode;
} //播放模式做互斥



function changeMusic(n) {

    var i = musicList.selectedIndex;//選擇的音樂索引
    //console.log(i + n);
    myMusic.src = musicList.children[i + n].value; //更改音樂來源
    myMusic.title = musicList.children[i + n].innerText;
    musicList.children[i + n].selected = true;//選擇的音樂索引


    //console.log(btnPlay.innerText);

    if (btnPlay.innerText == ";") {
        myMusic.onloadeddata = playMusic; //音樂載入完成後，再開始播放音樂
    }
}




//時間格式
function getTimeFormat(t) {
    var min = parseInt(t.toFixed(0) / 60);
    var sec = parseInt(t.toFixed(0) % 60);

    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    return min + ":" + sec;
}

function setProgress() {
    myMusic.currentTime = progressBar.value / 10000; //更新音樂的當前時間
}


//音樂播放時間
function setMusicDuration() {
    // 更新時間顯示
    musicDuration.innerHTML = getTimeFormat(myMusic.currentTime) + "/" + getTimeFormat(myMusic.duration);

    // 更新進度條的值
    progressBar.value = myMusic.currentTime * 10000;

    // 計算進度百分比
    var w = myMusic.currentTime / myMusic.duration * 100;

    // 更新進度條的背景漸層
    progressBar.style.backgroundImage = `linear-gradient(to right, rgb(245, 173, 92) ${w}%,rgb(236, 236, 234) ${w}%)`;

    /////////////////////////////////////////////////////////////

}



//目前歌曲長度初始化
function ProgressInitial() {
    progressBar.max = myMusic.duration * 10000; // 設置進度條的最大值為音樂的總時長
    setInterval(setMusicDuration, 5);// 每秒更新一次進度條
}

setVolumeByRangeBar(); //初始化音量


//音量調整
function setVolumeByRangeBar() {
    //console.log(event.target.value)
    txtVolume.value = rangeVolume.value;
    myMusic.volume = txtVolume.value / 100;
    rangeVolume.style.backgroundImage = `linear-gradient(to right, rgba(252, 160, 55, 0.8) ${rangeVolume.value}%,rgb(255, 255, 255) ${rangeVolume.value}%)`;

}



//音量調整
function changeVolume(v) {
    /* myMusic.Volume = (myMusic.volume * 100 + v) / 100;
    console.log(myMusic.volume); */
    rangeVolume.value = parseInt(rangeVolume.value) + v;
    setVolumeByRangeBar(); //呼叫音量調整的function

}


//靜音
function setMute() {
    myMusic.muted = !myMusic.muted;
    event.target.className = event.target.className == "setMute" ? "" : "setMute";
    updateInfo(myMusic.muted ? "已靜音" : "取消靜音");
    setTimeout(() => {
        updateInfo("目前播放" + myMusic.title);
    }, 1000);
}

//快轉倒轉
function changeTime(s) {
    myMusic.currentTime += s;
}

function updateInfo(text) {
    playStatus.innerHTML = text;
}



//播放音樂
function playMusic() {
    //console.log(event.target);
    myMusic.play();
    event.target.innerHTML = ";";
    event.target.onclick = pauseMusic;

    ProgressInitial(); //音樂開始播放時，才開始更新進度條的值

    updateInfo("目前播放" + myMusic.title);
}


//暫停音樂
function pauseMusic() {
    myMusic.pause();
    event.target.innerHTML = "4";
    event.target.onclick = playMusic;
    updateInfo("音樂暫停");
}

//停止音樂
function stopMusic() {
    myMusic.pause();
    myMusic.currentTime = 0;
    updateInfo("音樂停止");
    btnPlay.innerText = "4";
    btnPlay.onclick = playMusic;
}
