class TextureQuality {
  public static VERY_LOW:number = 0; //512
  public static LOW:number = 1;       //1024
  public static MEDIUM:number = 2;    //2048
  public static HIGH:number = 3;      //4096
  public static VERY_HIGH:number = 4; //8192
  public static ULTRA:number = 5;     //16384
}

class ViewQuality {
  public static VERY_LOW:number = 0;  //4x4
  public static LOW:number = 1;       //5x5
  public static MEDIUM:number = 2;    //6x6
  public static HIGH:number = 3;      //7x7
  public static VERY_HIGH:number = 4; //8x8
}

class HoloPlay {

  public scene:THREE.Scene;
  public camera:THREE.PerspectiveCamera;
  public renderer:THREE.WebGLRenderer;

  protected finalRenderScene:THREE.Scene;
  protected finalRenderCamera:THREE.Camera;

  public multiViewRenderer:HoloMultiViewRenderer;
  public eppRom:HoloEppRom;
  public screen:HoloScreen;

  private useBorderInFullscreen:boolean = false;
  private fullscreenBorderSize:number = 100;
  private useEppRom:boolean;


  constructor(scene:THREE.Scene,camera:THREE.PerspectiveCamera,renderer:THREE.WebGLRenderer,useEppRom:boolean=true){
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.useEppRom = useEppRom;
  }


  public init(textureQuality:number = TextureQuality.HIGH,viewQuality:number = ViewQuality.MEDIUM):void{

    this.finalRenderScene = new THREE.Scene();
    this.finalRenderCamera = new THREE.OrthographicCamera(-0.5,0.5,0.5,-0.5,0.001,300000);
    this.finalRenderCamera.position.z = 2;



    var textureSize = Math.pow(2,9 + textureQuality);
    var nb = 4 + viewQuality;

    this.multiViewRenderer = new HoloMultiViewRenderer(this,textureSize/nb,textureSize/nb,nb,nb);
    this.screen = new HoloScreen(this);

    this.finalRenderScene.add(this.finalRenderCamera);
    this.finalRenderScene.add(this.screen);

    if(this.useEppRom) this.eppRom = new HoloEppRom(this);
    else this.initScreen(false);

  }


  public initScreen(useEppRom:boolean=true):void{
    this.useEppRom = useEppRom;
    this.screen.init(this.DPI, this.pitch, this.slope,  this.center);
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
    this.renderer.setSize(window.innerWidth,window.innerHeight);
    this.camera.aspect = window.innerWidth/window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.screen.updateViewConePitchAndTilt();
  }

  public useBlackBorderAroundFullscreen(borderSize:number=100){
    this.useBorderInFullscreen = true;
    this.fullscreenBorderSize = borderSize;
  }

  public update():void{

    this.multiViewRenderer.captureViews();

    if(document["fullscreen"] && this.useBorderInFullscreen && window.innerWidth == 2560 && window.innerHeight == 1600){
      this.renderer.setScissorTest(true);
      var size = this.fullscreenBorderSize;
      this.renderer.setScissor(size,size,2560-size*2,1600-size*2)
    }else{
      this.renderer.setScissorTest(false);
    }

    this.renderer.render(this.finalRenderScene,this.finalRenderCamera);
  }


}
