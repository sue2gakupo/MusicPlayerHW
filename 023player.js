//開發的想法是：各個功能&畫面依序做
//功能區


//使用者觸發click事件，則播放音樂
var myMusic = document.getElementById("myMusic");
var volumeControl = document.getElementById("volumeControl");
var information = document.getElementById("information")
var progressBar = document.getElementById("progressBar"); //進度條
var musicList = document.getElementById("musicList")
var functionButtons = document.getElementById("functionButtons"); //功能鈕


var txtVolume = volumeControl.children[3]; //音量顯示的input
var rangeVolume = volumeControl.children[0]; //音量調整的range


var musicDuration = information.children[0];
var playStatus = information.children[1];
var btnplay = functionButtons.children[0]; //播放鈕

var infoStatus = information.children[2]; //單曲循環鈕


/////////////////////////////////////////
function musicStatus() {

    if (infoStatus.innerText == "單曲循環") {
        changeMusic(0); //單曲循環
    } 
    else if (infoStatus.innerText == "隨機播放") {
        var n = Math.floor(Math.random() * musicList.length); //隨機在musiclist中選擇一首音樂
        changeMusic(n - musicList.selectedIndex); //隨機播放音樂
    } 
    else if (infoStatus.innerText == "全曲循環" && musicList.length == musicList.selectedIndex + 1) {
        changeMusic(0 - musicList.selectedIndex);
    } 
    else if (musicList.length == musicList.selectedIndex + 1) { //是否為最後一首歌
        stopMusic();
    } 
    else {//不是最後一首歌就播下一首歌
        changeMusic(1);
    }
}


function loopOne() {
    infobtnLoopOne.innerHTML = infoStatus.innerHTML == "單曲循環" ? "正常" : "單曲循環";
}
function setRandom() {
    infobtnLoopOne.innerHTML = infoStatus.innerHTML == "單曲循環" ? "正常" : "隨機播放";
}
function loopAll() {
    infobtnLoopOne.innerHTML = infoStatus.innerHTML == "單曲循環" ? "正常" : "全曲循環";
}//三個按鈕做互斥


function changeMusic(n) {

    var i = musicList.selectedIndex;//選擇的音樂索引
    //console.log(i + n);
    myMusic.src = musicList.children[i + n].value; //更改音樂來源
    myMusic.title = musicList.children[i + n].innerText;
    musicList.children[i + n].selected = true;//選擇的音樂索引


    //console.log(btnplay.innerText);

    if (btnplay.innerText == ";") {
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
    progressBar.style.backgroundImage = `linear-gradient(to right, rgb(243, 208, 167) ${w}%,rgb(236, 236, 234) ${w}%)`;

    /////////////////////////////////////////////////////////////

}



//目前歌曲長度初始化
function ProgressInitial() {
    progressBar.max = myMusic.duration * 10000; // 設置進度條的最大值為音樂的總時長
    setInterval(setMusicDuration, 10);// 每秒更新一次進度條
}

setVolumeByRangeBar(); //初始化音量


//音量調整
function setVolumeByRangeBar() {
    //console.log(event.target.value)
    txtVolume.value = rangeVolume.value;
    myMusic.volume = txtVolume.value / 100; //真正寫入音量屬性值
    //用漸層-處理音量bar隨著button移動(塗音量條的顏色)
    rangeVolume.style.backgroundImage = `linear-gradient(to right, rgb(253, 167, 68) ${rangeVolume.value}%,rgb(255, 255, 255) ${rangeVolume.value}%)`;

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
    playStatus.innerHTML = "已靜音";
}

//快轉倒轉同一個按鈕//有參數的function//同一個參數不同結果
function changeTime(s) {
    myMusic.currentTime += s;
}

/*  //倒轉
     function prevTime() {
         myMusic.currentTime -= 5;
     }

     //快轉//比原本時間多5秒
     function nextTime() {
         myMusic.currentTime += 5;
     } */


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

    //playStatus.innerHTML = "目前播放" + myMusic.title;
    updateInfo("目前播放" + myMusic.title);
}


//暫停音樂
function pauseMusic() {
    myMusic.pause();
    event.target.innerHTML = "4";
    event.target.onclick = playMusic;
    //playStatus.innerHTML = "音樂暫停";
    updateInfo("音樂暫停");
}

//停止音樂
function stopMusic() {
    //音樂停下，且 進度條歸零
    myMusic.pause();
    myMusic.currentTime = 0; //點擊停止鈕會跳到設定的時間
    event.target.previousElementSibling.innerHTML = "4";//抓到上一個兄弟節點
    event.target.previousElementSibling.onclick = playMusic; //恢復播放音樂的功能
    //playStatus.innerHTML = "音樂停止";
    updateInfo("音樂停止");
}
