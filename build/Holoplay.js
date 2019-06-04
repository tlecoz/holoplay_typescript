class HoloPlay {
    constructor(scene, camera, renderer, holoAppType = HoloAppType.HOLOGRAM) {
        this.useClassicRendering = false;
        this.useBorderInFullscreen = false;
        this.fullscreenBorderSize = 100;
        this.useEppRom = true;
        this.quiltPlayer = false;
        this.quiltTexture = null;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        if (holoAppType == HoloAppType.CLASSIC_RENDERING) {
            holoAppType = HoloAppType.HOLOGRAM;
            this.useClassicRendering = true;
        }
        if (holoAppType == HoloAppType.QUILT_PLAYER) {
            holoAppType = HoloAppType.HOLOGRAM;
            this.quiltPlayer = true;
        }
        this.mode = holoAppType;
    }
    init(textureW = 4096, textureH = 4096, nbViewX = 7, nbViewY = 7, quiltVideo = null) {
        this.finalRenderScene = new THREE.Scene();
        this.finalRenderCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.001, 300000);
        this.finalRenderCamera.position.z = 2;
        this.nbViewX = nbViewX;
        this.nbViewY = nbViewY;
        if (quiltVideo)
            this.quiltTexture = new THREE.VideoTexture(quiltVideo);
        else
            this.multiViewRenderer = new HoloMultiViewRenderer(this, textureW / nbViewX, textureH / nbViewY, nbViewX, nbViewY);
        this.screen = new HoloScreen(this);
        this.quiltPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.textureViews }));
        this.quiltPlane.material.needsUpdate = true;
        this.finalRenderScene.add(this.finalRenderCamera);
        this.finalRenderScene.add(this.screen);
        this.finalRenderScene.add(this.quiltPlane);
        if (this.useEppRom)
            this.eppRom = new HoloEppRom(this);
        else
            this.initScreen(false);
    }
    get nbX() {
        return this.nbViewX;
    }
    get nbY() {
        return this.nbViewY;
    }
    get nbView() {
        return this.nbViewX * this.nbViewY;
    }
    get textureViews() {
        if (this.quiltPlayer == false)
            return this.multiViewRenderer.texture;
        else
            return this.quiltTexture;
    }
    initScreen(useEppRom = true) {
        this.useEppRom = useEppRom;
        this.screen.init(this.DPI, this.pitch, this.slope, this.center);
        this.onResize();
    }
    get ready() { return (this.useEppRom == false) || this.eppRom.initialized; }
    get DPI() {
        if (this.useEppRom)
            return this.eppRom.jsonObj.DPI.value;
        else
            return 338;
    }
    get slope() {
        if (this.useEppRom)
            return this.eppRom.jsonObj.slope.value;
        else
            return -5.392934799194336;
    }
    get pitch() {
        if (this.useEppRom)
            return this.eppRom.jsonObj.pitch.value;
        else
            return 47.58308029174805;
    }
    get center() {
        if (this.useEppRom)
            return this.eppRom.jsonObj.center.value;
        else
            return -0.028532594442367554;
    }
    get depthRatio() { return this.screen.depthRatio; }
    set depthRatio(n) { this.screen.depthRatio = n; }
    onResize() {
        var w;
        var h;
        this.quiltPlane.visible = this.mode == HoloAppType.QUILT_VIDEO_ENCODER;
        this.screen.visible = (this.mode == HoloAppType.HOLOGRAM || this.mode == HoloAppType.HOLOGRAM_VIDEO_ENCODER);
        if (this.mode == HoloAppType.HOLOGRAM) {
            w = window.innerWidth;
            h = window.innerHeight;
        }
        else if (this.mode == HoloAppType.HOLOGRAM_VIDEO_ENCODER || this.mode == HoloAppType.QUILT_VIDEO_ENCODER) {
            w = 2560;
            h = 1600;
        }
        this.width = w;
        this.height = h;
        this.renderer.setSize(w, h);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.screen.updateViewConePitchAndTilt();
    }
    useBlackBorderAroundFullscreen(borderSize = 100) {
        this.useBorderInFullscreen = true;
        this.fullscreenBorderSize = borderSize;
    }
    update() {
        this.renderer.clear(true, true, true);
        if (this.useClassicRendering) {
            this.renderer.render(this.scene, this.camera);
        }
        else {
            this.renderer.setSize(this.width, this.height);
            if (!this.quiltPlayer)
                this.multiViewRenderer.captureViews();
            if (this.mode == HoloAppType.HOLOGRAM || this.mode == HoloAppType.HOLOGRAM_VIDEO_ENCODER) {
                if (document["fullscreen"] && this.useBorderInFullscreen && window.innerWidth == 2560 && window.innerHeight == 1600) {
                    this.renderer.setScissorTest(true);
                    var size = this.fullscreenBorderSize;
                    this.renderer.setScissor(size, size, 2560 - size * 2, 1600 - size * 2);
                }
                else {
                    this.renderer.setScissorTest(false);
                }
            }
            if (this.mode == HoloAppType.QUILT_VIDEO_ENCODER)
                this.renderer.setSize(this.multiViewRenderer.width, this.multiViewRenderer.height);
            this.renderer.render(this.finalRenderScene, this.finalRenderCamera);
        }
    }
}
//# sourceMappingURL=Holoplay.js.map