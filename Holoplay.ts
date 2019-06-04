

class HoloPlay {

  public scene:THREE.Scene;
  public camera:THREE.PerspectiveCamera;
  public renderer:THREE.WebGLRenderer;
  public useClassicRendering:boolean = false;
  public mode:string;
  public width:number;
  public height:number;

  protected finalRenderScene:THREE.Scene;
  protected finalRenderCamera:THREE.Camera;

  public multiViewRenderer:HoloMultiViewRenderer;
  public eppRom:HoloEppRom;
  public screen:HoloScreen;

  private useBorderInFullscreen:boolean = false;
  private fullscreenBorderSize:number = 100;
  private useEppRom:boolean = true;
  private quiltPlane:THREE.Mesh;
  private quiltPlayer:boolean = false;

  constructor(scene:THREE.Scene,camera:THREE.PerspectiveCamera,renderer:THREE.WebGLRenderer, holoAppType:string = HoloAppType.HOLOGRAM){
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    if(holoAppType == HoloAppType.CLASSIC_RENDERING){
      holoAppType = HoloAppType.HOLOGRAM;
      this.useClassicRendering = true;
    }
    if(holoAppType == HoloAppType.QUILT_PLAYER){
      holoAppType = HoloAppType.HOLOGRAM;
      this.quiltPlayer = true;

    }

    this.mode = holoAppType;

  }


  private quiltTexture:any = null;
  private nbViewX:number;
  private nbViewY:number;

  public init(textureW:number=4096,textureH:number=4096,nbViewX:number=7,nbViewY:number=7,quiltVideo:HTMLVideoElement=null):void{

    this.finalRenderScene = new THREE.Scene();
    this.finalRenderCamera = new THREE.OrthographicCamera(-0.5,0.5,0.5,-0.5,0.001,300000);
    this.finalRenderCamera.position.z = 2;

    this.nbViewX = nbViewX;
    this.nbViewY = nbViewY;



    if(quiltVideo) this.quiltTexture = new THREE.VideoTexture(quiltVideo);
    else this.multiViewRenderer = new HoloMultiViewRenderer(this,textureW/nbViewX,textureH/nbViewY,nbViewX,nbViewY);

    this.screen = new HoloScreen(this);

    this.quiltPlane = new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:this.textureViews}))
    this.quiltPlane.material.needsUpdate = true;

    //console.log(this.multiViewRenderer.width,this.multiViewRenderer.height)

    this.finalRenderScene.add(this.finalRenderCamera);
    this.finalRenderScene.add(this.screen);
    this.finalRenderScene.add(this.quiltPlane);

    if(this.useEppRom) this.eppRom = new HoloEppRom(this);
    else this.initScreen(false);

  }

  public get nbX():number{
    return this.nbViewX;
  }
  public get nbY():number{
    return this.nbViewY;
  }
  public get nbView():number{
    return this.nbViewX * this.nbViewY;
  }


  public get textureViews():any{
    //console.log(this.quiltPlayer)
    if(this.quiltPlayer == false) return this.multiViewRenderer.texture;
    else return this.quiltTexture;
  }


  public initScreen(useEppRom:boolean=true):void{
    this.useEppRom = useEppRom;
    this.screen.init(this.DPI, this.pitch, this.slope,  this.center);
    this.onResize();

  }

  public get ready():boolean{return  (this.useEppRom == false) || this.eppRom.initialized}

  public get DPI():number{
    if(this.useEppRom) return this.eppRom.jsonObj.DPI.value;
    else return 338;
  }


  public get slope():number{
    if(this.useEppRom) return this.eppRom.jsonObj.slope.value;
    else return -5.392934799194336
  }
  public get pitch():number{
    if(this.useEppRom) return this.eppRom.jsonObj.pitch.value;
    else return 47.58308029174805;

  }


  public get center():number{
    if(this.useEppRom) return this.eppRom.jsonObj.center.value;
    else return -0.028532594442367554;
  }


  public get depthRatio():number{return this.screen.depthRatio;}
  public set depthRatio(n:number){ this.screen.depthRatio = n}



  public onResize():void{

    var w;
    var h;
    //console.log("onResize = ",this.mode)

    this.quiltPlane.visible = this.mode == HoloAppType.QUILT_VIDEO_ENCODER;
    this.screen.visible = (this.mode == HoloAppType.HOLOGRAM || this.mode == HoloAppType.HOLOGRAM_VIDEO_ENCODER);



    if(this.mode == HoloAppType.HOLOGRAM){
     w = window.innerWidth;
     h = window.innerHeight;
   }else if(this.mode == HoloAppType.HOLOGRAM_VIDEO_ENCODER || this.mode == HoloAppType.QUILT_VIDEO_ENCODER){
      w = 2560;
      h = 1600;
    }

    this.width = w;
    this.height = h;

    this.renderer.setSize(w,h);
    this.camera.aspect = w/h;
    this.camera.updateProjectionMatrix();
    this.screen.updateViewConePitchAndTilt();
  }

  public useBlackBorderAroundFullscreen(borderSize:number=100){
    this.useBorderInFullscreen = true;
    this.fullscreenBorderSize = borderSize;
  }

  public update():void{

    this.renderer.clear(true,true,true);

    if(this.useClassicRendering){

      this.renderer.render(this.scene,this.camera);

    }else{

      this.renderer.setSize(this.width,this.height);

      if(!this.quiltPlayer) this.multiViewRenderer.captureViews();


      if(this.mode == HoloAppType.HOLOGRAM || this.mode == HoloAppType.HOLOGRAM_VIDEO_ENCODER){
        if(document["fullscreen"] && this.useBorderInFullscreen && window.innerWidth == 2560 && window.innerHeight == 1600){
          this.renderer.setScissorTest(true);
          var size = this.fullscreenBorderSize;
          this.renderer.setScissor(size,size,2560-size*2,1600-size*2)
        }else{
          this.renderer.setScissorTest(false);
        }
      }

      if(this.mode == HoloAppType.QUILT_VIDEO_ENCODER) this.renderer.setSize(this.multiViewRenderer.width,this.multiViewRenderer.height);
      this.renderer.render(this.finalRenderScene,this.finalRenderCamera);
    }



  }


}
