const text = document.getElementById('text');
const voiceSelect = document.getElementById('voice-select');
const speakBtn = document.getElementById('speak-btn');
const cancelBtn = document.getElementById('cancel-btn');
const pauseBtn  = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const result = document.getElementById('result');

// selectタグの中身を声の名前が入ったoptionタグで埋める
function appendVoices() {
  // ①　使える声の配列を取得
  // 配列の中身は SpeechSynthesisVoice オブジェクト
  const voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = '';
  voices.forEach(voice => {
    // 日本語と英語以外の声は選択肢に追加しない。
    if (!voice.lang.match('ja|en-US')) return;
    const option = document.createElement('option');
    option.value = voice.name;
    option.text = `${voice.name} (${voice.lang})`;
    option.setAttribute('selected', voice.default);
    voiceSelect.appendChild(option);
  });
};

appendVoices();

// ② 使える声が追加されたときに着火するイベントハンドラ。
// Chrome は非同期に(一個ずつ)声を読み込むため必要。
speechSynthesis.onvoiceschanged = e => {
  appendVoices();
};

speakBtn.onclick = () => {
  // 発言を作成
  const uttr = new SpeechSynthesisUtterance(text.value);
  // ③ 選択された声を指定
  uttr.voice = speechSynthesis
    .getVoices()
    .filter(voice => voice.name === voiceSelect.value)[0];
  // 発言を再生 (発言キュー発言に追加)
  speechSynthesis.speak(uttr);
  // テキストの入力履歴に追加
  result.insertAdjacentHTML('beforeend', '<p>' + text.value + '</p>');
  // テキストエリアを削除・フォーカスを再度テキストエリアに
  text.value = '';
  text.focus();
};

// Enterキーで発話
text.addEventListener('keypress', onkeypress);
function onkeypress(event) {
  if (event.keyCode === 13) {
    speakBtn.onclick();
  };
};

cancelBtn.addEventListener('click', function() {
  // 再生停止 (発言キューをクリアして止まる)
  speechSynthesis.cancel();
});
pauseBtn.addEventListener('click', function() {
  // 一時停止 (発言キューを保持して止まる)
  speechSynthesis.pause();
});
resumeBtn.addEventListener('click', function() {
  // 再生再開 (一時停止を解除)
  speechSynthesis.resume();
});

// ページ離脱時に警告
window.onbeforeunload = function(e) {
  e.returnValue = "ページを離れようとしています。よろしいですか？";
}