// 読み込み済み部分のバー
const progressBar =
    document.querySelector(".progress");

// 音符
const note =
    document.querySelector(".note");

// バー全体
const bar =
    document.querySelector(".progress-bar");


// ============================
// 外部から進捗を更新する関数
// progress : 0 ～ 1
// ============================
function setLoadingProgress(progress) {

    // 0未満や1超えを防ぐ
    progress = Math.max(
        0,
        Math.min(progress, 1)
    );

    // 金色部分を伸ばす
    progressBar.style.width =
        `${progress * 100}%`;

    // 音符を移動
    const width =
        bar.clientWidth;

    // 音符の横幅を取得
    const noteWidth =
        note.offsetWidth;

    // 音符の位置を計算
    note.style.left =
        `${progress * (width - noteWidth)+ noteWidth / 2 -100}px`;
}


// ============================
// ローディング画面を消す関数
// ============================
function hideLoadingScreen() {

    const loading =
        document.getElementById(
            "loading-screen"
        );

    loading.style.opacity = "0";

    setTimeout(() => {
        loading.remove();
    }, 1000);
}