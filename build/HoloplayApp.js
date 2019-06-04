class HoloplayApp {
    constructor(quilt, holoAppType = HoloAppType.HOLOGRAM) {
        if (quilt)
            this.init(quilt, holoAppType);
    }
    init(quilt, holoAppType = HoloAppType.HOLOGRAM, quiltVideo = null) {
        console.log("init", quilt);
        var fov = 35;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1000000);
        this.camera.position.set(0, 0, this.camera.getFocalLength());
        console.log(this.camera.getFocalLength());
        this.renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true });
        this.ctx = this.renderer.context;
        this.renderer.setClearAlpha(0);
        this.renderer.setClearColor(new THREE.Color(0), 0);
        this.renderer.autoClear = true;
        document.body.appendChild(this.renderer.domElement);
        var th = this;
        window.addEventListener("resize", function () { th.holoplay.onResize(); });
        this.holoplay = new HoloPlay(this.scene, this.camera, this.renderer, holoAppType);
        this.holoplay.init(quilt.width, quilt.height, quilt.nbX, quilt.nbY, quiltVideo);
        this.holoplay.onResize();
    }
    set onReady(f) { this.holoplay.eppRom.onReady = f; }
    get parallaxRatio() { return this.holoplay.depthRatio; }
    set parallaxRatio(n) { this.holoplay.depthRatio = n; }
    getFullscreen() { this.renderer.domElement.requestFullscreen(); }
    useBlackBorderAroundFullscreen(borderSize = 100) { this.holoplay.useBlackBorderAroundFullscreen(borderSize); }
    get useClassicRendering() { return this.holoplay.useClassicRendering; }
    set useClassicRendering(b) { this.holoplay.useClassicRendering = b; }
    get fieldOfVision() { return this.camera.fov; }
    set fieldOfVision(n) {
        if (n < 1)
            n = 1;
        if (n > 179)
            n = 179;
        this.camera.fov = n;
        this.camera.updateProjectionMatrix();
    }
    addEventListener(eventName, func) { this.renderer.domElement.addEventListener(eventName, func); }
    update() {
        this.holoplay.update();
    }
}
//# sourceMappingURL=HoloplayApp.js.map