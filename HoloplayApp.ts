class HoloplayApp {

  protected scene:THREE.Scene;
  protected camera:THREE.PerspectiveCamera;
  protected renderer:THREE.WebGLRenderer;
  public holoplay:HoloPlay;



  constructor(textureQuality:number,viewQuality:number,useEppRom:boolean=true){

    var fov = 35;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth/window.innerHeight, 2, 10000);
    this.camera.position.set(0,0,38);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    //var mc = this.renderer.domElement;
    //mc.addEventListener("click", function(){ mc.requestFullscreen();});


    var th = this;
    window.addEventListener("resize",function(){ th.holoplay.onResize(); })

    this.holoplay = new HoloPlay(this.scene,this.camera,this.renderer,useEppRom);
    this.holoplay.init(textureQuality,viewQuality);
  }

  public get paralaxRatio():number{return this.holoplay.depthRatio}
  public set paralaxRatio(n:number){this.holoplay.depthRatio = n;}

  public getFullscreen():void{ this.renderer.domElement.requestFullscreen(); }

  public useBlackBorderAroundFullscreen(borderSize:number=100){
    this.holoplay.useBlackBorderAroundFullscreen(borderSize);
  }


  public get fieldOfVision():number{  return this.camera.fov; }
  public set fieldOfVision(n:number){
    if(n<1) n=1;
    if(n>179) n = 179;
    this.camera.fov = n;
    this.camera.updateProjectionMatrix();
  }


  public addEventListener(eventName:string,func:any):void{ this.renderer.domElement.addEventListener(eventName,func); }


  public update():void{
    this.holoplay.update();
  }




}
