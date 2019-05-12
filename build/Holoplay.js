class TextureQuality {
}
TextureQuality.VERY_LOW = 0;
TextureQuality.LOW = 1;
TextureQuality.MEDIUM = 2;
TextureQuality.HIGH = 3;
TextureQuality.VERY_HIGH = 4;
class ViewQuality {
}
ViewQuality.VERY_LOW = 0;
ViewQuality.LOW = 1;
ViewQuality.MEDIUM = 2;
ViewQuality.HIGH = 3;
ViewQuality.VERY_HIGH = 4;
class HoloPlay {
    constructor(scene, camera, renderer, useEppRom = true) {
        this.useBorderInFullscreen = false;
        this.fullscreenBorderSize = 100;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.useEppRom = useEppRom;
    }
    init(textureQuality = TextureQuality.HIGH, viewQuality = ViewQuality.MEDIUM) {
        this.finalRenderScene = new THREE.Scene();
        this.finalRenderCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.001, 300000);
        this.finalRenderCamera.position.z = 2;
        var textureSize = Math.pow(2, 9 + textureQuality);
        var nb = 4 + viewQuality;
        this.multiViewRenderer = new HoloMultiViewRenderer(this, textureSize / nb, textureSize / nb, nb, nb);
        this.screen = new HoloScreen(this);
        this.finalRenderScene.add(this.finalRenderCamera);
        this.finalRenderScene.add(this.screen);
        if (this.useEppRom)
            this.eppRom = new HoloEppRom(this);
        else
            this.initScreen(false);
    }
    initScreen(useEppRom = true) {
        this.useEppRom = useEppRom;
        this.screen.init(this.DPI, this.pitch, this.slope, this.center);
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
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.screen.updateViewConePitchAndTilt();
    }
    useBlackBorderAroundFullscreen(borderSize = 100) {
        this.useBorderInFullscreen = true;
        this.fullscreenBorderSize = borderSize;
    }
    update() {
        this.multiViewRenderer.captureViews();
        if (document["fullscreen"] && this.useBorderInFullscreen && window.innerWidth == 2560 && window.innerHeight == 1600) {
            this.renderer.setScissorTest(true);
            var size = this.fullscreenBorderSize;
            this.renderer.setScissor(size, size, 2560 - size * 2, 1600 - size * 2);
        }
        else {
            this.renderer.setScissorTest(false);
        }
        this.renderer.render(this.finalRenderScene, this.finalRenderCamera);
    }
}
//# sourceMappingURL=Holoplay.js.map