class Test extends HoloplayApp {
    constructor(quilt, mode = "normal") {
        super(quilt, mode);
        this.time = 0;
        this.renderer.shadowMap.enabled = true;
        var light = this.light = new THREE.SpotLight(0xffffff, 1);
        light.castShadow = true;
        light.angle = 0.78;
        light.position.set(0, 0, 20);
        light.penumbra = 0.5;
        light.distance = 4000;
        light.shadow.mapSize.width = 512 * 4;
        light.shadow.mapSize.height = 512 * 4;
        this.camera.add(light);
        this.scene.add(this.camera);
        var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);
        this.scene.add(ambientLight);
        var bgGroup = new THREE.Group();
        this.scene.add(bgGroup);
        var cubes = this.cubes = [];
        var group = this.group = new THREE.Group();
        var cubeGeometry = new THREE.SphereGeometry(5, 50, 50);
        var cubeMaterial = new THREE.MeshLambertMaterial();
        var bg = this.bg = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff }));
        bg.position.z = -150;
        bg.receiveShadow = true;
        bgGroup.add(bg);
        var d = 50;
        var d2 = d / 2;
        var n;
        var c;
        var scale;
        for (var i = 0; i < 15; i++) {
            c = new THREE.Color(Math.random(), Math.random(), Math.random()).getHex();
            cubes.push(new THREE.Mesh(cubeGeometry, new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.5 + Math.random() * 0.25, roughness: Math.random() * 0.25 })));
            cubes[i].castShadow = true;
            cubes[i].receiveShadow = true;
            cubes[i].position.set(d2 - Math.random() * d, d2 - Math.random() * d, d2 - Math.random() * d);
            cubes[i].rotation.set(Math.random(), Math.random(), Math.random());
            scale = 0.75 + Math.random() * 0.5;
            cubes[i].s = scale;
            cubes[i].a = Math.random() * Math.PI * 2;
            cubes[i].scale.set(scale, scale, scale);
            group.add(cubes[i]);
        }
        this.scene.add(group);
    }
    update() {
        this.time += 0.01;
        const group = this.group;
        const cubes = this.cubes;
        group.rotation.y += 0.001;
        group.rotation.x += 0.0075;
        group.rotation.z += 0.0015;
        group.position.z = -25;
        let i, len = cubes.length;
        let n;
        for (i = 0; i < len; i++) {
            n = cubes[i].s + Math.sin(this.time * (1 + i * 0.1) + cubes[i].a) * 0.5;
            cubes[i].scale.set(n, n, n);
            cubes[i].rotation.x += 0.01;
            cubes[i].rotation.y += 0.02;
            cubes[i].rotation.z += 0.03;
        }
        super.update();
    }
}
//# sourceMappingURL=Test.js.map