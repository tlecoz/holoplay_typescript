class HoloplayApp {

  protected scene:THREE.Scene;
  protected camera:THREE.PerspectiveCamera;
  protected renderer:THREE.WebGLRenderer;
  public holoplay:HoloPlay;
  public ctx:WebGLRenderingContext;




  constructor(quilt:{width:number,height:number,nbX:number,nbY:number},holoAppType:string=HoloAppType.HOLOGRAM){
    if(quilt) this.init(quilt,holoAppType);
  }

  public init(quilt:{width:number,height:number,nbX:number,nbY:number},holoAppType:string=HoloAppType.HOLOGRAM,quiltVideo:HTMLVideoElement=null){
    console.log("init",quilt)
    var fov = 35;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth/window.innerHeight, 1, 1000000);
    this.camera.position.set(0,0,this.camera.getFocalLength());
    console.log(this.camera.getFocalLength())
    this.renderer = new THREE.WebGLRenderer({alpha:true,preserveDrawingBuffer: true});
    this.ctx = this.renderer.context;

    this.renderer.setClearAlpha(0);
    this.renderer.setClearColor(new THREE.Color(0),0);
    this.renderer.autoClear = true;

    document.body.appendChild(this.renderer.domElement);

    var th = this;
    window.addEventListener("resize",function(){ th.holoplay.onResize(); })

    this.holoplay = new HoloPlay(this.scene,this.camera,this.renderer,holoAppType);
    this.holoplay.init(quilt.width,quilt.height,quilt.nbX,quilt.nbY,quiltVideo);
    this.holoplay.onResize();
  }


  public set onReady(f:Function){this.holoplay.eppRom.onReady = f;}

  public get parallaxRatio():number{return this.holoplay.depthRatio}
  public set parallaxRatio(n:number){this.holoplay.depthRatio = n;}

  public getFullscreen():void{ this.renderer.domElement.requestFullscreen(); }
  public useBlackBorderAroundFullscreen(borderSize:number=100){ this.holoplay.useBlackBorderAroundFullscreen(borderSize); }


  public get useClassicRendering():boolean{return this.holoplay.useClassicRendering;}
  public set useClassicRendering(b:boolean){this.holoplay.useClassicRendering = b;}


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
