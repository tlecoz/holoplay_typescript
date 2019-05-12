class HoloMultiViewRenderer extends THREE.WebGLRenderTarget {
    constructor(holoplay, viewWidth = 1024, viewHeight = 1024, nbX = 8, nbY = 6) {
        super(viewWidth * nbX, viewHeight * nbY);
        this.focalPointVector = new Float32Array(3);
        this.scene = holoplay.scene;
        this.camera = holoplay.camera;
        this.renderer = holoplay.renderer;
        this.viewW = viewWidth;
        this.viewH = viewHeight;
        this.x = nbX;
        this.y = nbY;
        this.w = viewWidth * nbX;
        this.h = viewHeight * nbY;
        this.setupCameras();
    }
    get nbX() { return this.x; }
    get nbY() { return this.y; }
    get nbView() { return this.x * this.y; }
    get viewWidth() { return this.viewW; }
    get viewHeight() { return this.viewH; }
    get textureWidth() { return this.w; }
    get textureHeight() { return this.h; }
    setupCameras(constantCenter = true, focalPointVector = null) {
        this.cameraForward = new THREE.Vector3(0, 0, 0);
        this.camera.getWorldDirection(this.cameraForward);
        if (focalPointVector) {
            this.focalPointVector.set([focalPointVector.x, focalPointVector.y, focalPointVector.z]);
            this.center = new THREE.Vector3(focalPointVector[0], focalPointVector[1], focalPointVector[2]);
            this.viewScale = Math.max(this.center.distanceTo(this.camera.position), 1);
        }
        else {
            var vector = new THREE.Vector3();
            this.camera.getWorldDirection(vector);
            this.viewScale = Math.max(this.camera.position.length(), 1);
            this.center = new THREE.Vector3(0, 0, 0);
            vector.multiplyScalar(this.viewScale);
            this.focalPointVector.set([this.camera.position.x + vector.x, this.camera.position.y + vector.y, this.camera.position.z + vector.z]);
        }
        this.constantCenter = constantCenter;
        this.viewCone = 40;
        this.startNear = this.camera.near;
        this.startFar = this.camera.far;
        this.startDist = this.viewScale;
        var nbX = this.nbX;
        var nbY = this.nbY;
        var renderSizeX = this.viewW;
        var renderSizeY = this.viewH;
        var cameras = [];
        var subCamera;
        var x, y, nbX = this.x, nbY = this.y;
        for (y = 0; y < nbY; y++) {
            for (x = 0; x < nbX; x++) {
                subCamera = new THREE.PerspectiveCamera();
                subCamera.viewport = new THREE.Vector4(x * renderSizeX, y * renderSizeY, renderSizeX, renderSizeY);
                cameras.push(subCamera);
            }
        }
        this.cameras = new THREE["ArrayCamera"](cameras);
    }
    captureViews() {
        if (!this.cameras)
            return;
        const renderer = this.renderer;
        renderer.setRenderTarget(this);
        renderer.clear(true, true, true);
        const cam = this.camera;
        var worldRight = new THREE.Vector3(1, 0, 0);
        cam.right = worldRight.applyQuaternion(cam.quaternion);
        if (this.constantCenter === false) {
            cam.getWorldDirection(this.cameraForward);
            this.cameraForward.multiplyScalar(this.viewScale);
            this.center.addVectors(cam.position, this.cameraForward);
        }
        else {
            var dist = cam.position.distanceTo(this.center);
            cam.near = this.startNear * dist / this.viewScale;
            cam.far = this.startFar * dist / this.viewScale;
            cam.updateProjectionMatrix();
        }
        const scene = this.scene;
        const origPosition = new THREE.Vector3(cam.position.x, cam.position.y, cam.position.z);
        const start = -this.viewCone / 2;
        const end = this.viewCone / 2;
        const distance = this.center.distanceTo(cam.position);
        const size = 2 * distance * Math.tan(0.5 * THREE.Math.degToRad(cam.fov));
        const cameras = this.cameras;
        let subcamera;
        let radians, offsetX, offsetY, tempRight;
        cameras.copy(cam);
        let i, len = this.nbView;
        for (i = 0; i < len; i++) {
            subcamera = cameras.cameras[i];
            subcamera.position.copy(origPosition);
            subcamera.rotation.copy(cam.rotation);
            radians = THREE.Math.degToRad(THREE.Math["lerp"](start, end, i / (len - 1)));
            offsetX = distance * Math.tan(radians);
            tempRight = new THREE.Vector3(cam.right.x * offsetX, cam.right.y * offsetX, cam.right.z * offsetX);
            subcamera.position.add(tempRight);
            subcamera.updateMatrixWorld();
            subcamera.projectionMatrix.copy(cam.projectionMatrix);
            subcamera.projectionMatrix.elements[8] = -2 * offsetX / (size * cam.aspect);
        }
        renderer.render(scene, this.cameras);
        renderer.setRenderTarget(null);
    }
    ;
}
//# sourceMappingURL=HoloMultiViewRenderer.js.map