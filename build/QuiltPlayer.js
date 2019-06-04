class QuiltPlayer extends HoloplayApp {
    constructor() {
        super(null);
        this.onPlay = null;
        var btn = this.btn = document.createElement("input");
        btn.style.position = "absolute";
        btn.style.top = btn.style.left = "5px";
        btn.style.width = "250px";
        btn.style.height = "25px";
        btn.innerText = "OPEN QUILT VIDEO FILE !";
        btn.setAttribute("type", "file");
        btn.setAttribute("accept", ".mp4");
        document.body.appendChild(btn);
        var videoPlayer = this.videoPlayer = document.createElement("video");
        videoPlayer.style.position = "absolute";
        videoPlayer.style.top = "50px";
        videoPlayer.style.width = "600px";
        videoPlayer.style.height = "600px";
        videoPlayer.loop = true;
        videoPlayer.controls = true;
        var th = this;
        var quilt = { width: 0, height: 0, nbX: 0, nbY: 0 };
        videoPlayer.oncanplaythrough = function () {
            th.init(quilt, HoloAppType.QUILT_PLAYER, videoPlayer);
            th.addEventListener("click", function () { th.getFullscreen(); });
            th.onReady = function () {
                videoPlayer.play();
                if (th.onPlay)
                    th.onPlay();
                th.onReady = null;
            };
            videoPlayer.oncanplaythrough = null;
        };
        btn.onchange = function (event) {
            var name = event.srcElement.files[0].name;
            var t = name.split(".")[0].split("_");
            if (t.length != 5)
                throw new Error("Invalid video name");
            quilt.nbX = Number(t[1]);
            quilt.nbY = Number(t[2]);
            quilt.width = Number(t[3]);
            quilt.height = Number(t[4]);
            var reader = new FileReader();
            reader.readAsDataURL(event.srcElement.files[0]);
            var me = this;
            reader.onload = function () {
                var fileContent = reader.result;
                videoPlayer.src = fileContent;
            };
        };
    }
}
//# sourceMappingURL=QuiltPlayer.js.map