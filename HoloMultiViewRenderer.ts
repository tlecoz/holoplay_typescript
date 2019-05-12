class HoloMultiViewRenderer extends THREE.WebGLRenderTarget {


  public holoplay:HoloPlay;

  protected scene:THREE.Scene;
  protected camera:THREE.PerspectiveCamera;
  protected renderer:THREE.WebGLRenderer;


  protected w:number;
  protected h:number;
  protected viewW:number;
  protected viewH:number;
  protected x:number;
  protected y:number;

  //camera variables :
  public focalPointVector:Float32Array = new Float32Array(3);
  public constantCenter:boolean;
  public center:THREE.Vector3;
  public viewScale:number;

  public viewCone:number;
  protected startNear:number;
  protected startFar:number;
  protected startDist:number;
  protected cameraForward:THREE.Vector3;
  protected cameras:any;




  constructor(holoplay:HoloPlay,viewWidth:number=1024,viewHeight:number=1024,nbX:number=8,nbY:number=6){
    super(viewWidth * nbX, viewHeight * nbY);

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


  public get nbX():number{return this.x;}
  public get nbY():number{return this.y;}
  public get nbView():number{return this.x * this.y;}
  public get viewWidth():number{return this.viewW;}
  public get viewHeight():number{return this.viewH;}
  public get textureWidth():number{return this.w;}
  public get textureHeight():number{return this.h;}

  public setupCameras(constantCenter:boolean=true,focalPointVector:THREE.Vector3=null){
    this.cameraForward = new THREE.Vector3(0,0,0);
    this.camera.getWorldDirection(this.cameraForward);

    if(focalPointVector){
       this.focalPointVector.set([focalPointVector.x,focalPointVector.y,focalPointVector.z]);
       this.center = new THREE.Vector3(focalPointVector[0], focalPointVector[1], focalPointVector[2]);
       this.viewScale = Math.max(this.center.distanceTo(this.camera.position), 1) //Sets the focal distance to either the distance to center or just ahead of the camera


    }else{

      var vector = new THREE.Vector3();
      this.camera.getWorldDirection(vector); //Sets the vector to the camera forward

      this.viewScale = Math.max(this.camera.position.length(), 1);
      //Sets the focal distance to either the distance to center or just ahead of the camera
      //Because no center was provided in the constructor, it assumes that the center is 0,0,0

      this.center = new THREE.Vector3(0,0,0);
      vector.multiplyScalar(this.viewScale);
      this.focalPointVector.set([this.camera.position.x + vector.x, this.camera.position.y + vector.y, this.camera.position.z + vector.z]);
      //Sets the focal point to the front of the camera as far away as it is from (0,0,0)
    }

    this.constantCenter = constantCenter;


    this.viewCone = 40;

    this.startNear = this.camera.near;
    this.startFar = this.camera.far;
    this.startDist = this.viewScale;

    //render texture dimensions
    var nbX = this.nbX;
    var nbY = this.nbY;
    var renderSizeX = this.viewW;//renderResolution / tilesX;
    var renderSizeY = this.viewH;//renderResolution / tilesY;

    //arraycamera
    var cameras = [];
    var subCamera:any;
    var x,y,nbX = this.x,nbY = this.y;
    for ( y = 0; y < nbY; y ++ ) {
      for ( x = 0; x < nbX; x ++ ) {
        subCamera = new THREE.PerspectiveCamera();
        subCamera.viewport = new THREE.Vector4( x * renderSizeX, y * renderSizeY, renderSizeX, renderSizeY );
        cameras.push(subCamera);
      }
    }

    this.cameras = new THREE["ArrayCamera"](cameras);

  }


  public captureViews(){

      if(!this.cameras) return;

      const renderer:THREE.WebGLRenderer = this.renderer;

      renderer.setRenderTarget(this);
      renderer.clear(true,true,true);


      const cam:any = this.camera;
      var worldRight = new THREE.Vector3(1,0,0);
      cam.right = worldRight.applyQuaternion(cam.quaternion);

      if(this.constantCenter === false){
          cam.getWorldDirection(this.cameraForward);
          this.cameraForward.multiplyScalar(this.viewScale);
          this.center.addVectors(cam.position, this.cameraForward);
      } else{

          var dist = cam.position.distanceTo(this.center);
          cam.near = this.startNear * dist / this.viewScale;
          cam.far = this.startFar * dist / this.viewScale;
          cam.updateProjectionMatrix();
      }



      const scene = this.scene;
      const origPosition = new THREE.Vector3(cam.position.x, cam.position.y, cam.position.z);
      const start = -this.viewCone/2;
      const end = this.viewCone/2;
      const distance = this.center.distanceTo(cam.position);
      const size = 2 * distance * Math.tan(0.5 * THREE.Math.degToRad(cam.fov));
      const cameras = this.cameras;
      let subcamera;
      let radians,offsetX,offsetY,tempRight;
      cameras.copy(cam);

      let i,len = this.nbView;
      for(i = 0; i < len; i++) {

          subcamera = cameras.cameras[ i ];
          subcamera.position.copy(origPosition);
          subcamera.rotation.copy(cam.rotation);

          radians = THREE.Math.degToRad(THREE.Math["lerp"](start, end, i/(len - 1)));

          //angle needs to be in radians
          offsetX = distance * Math.tan(radians);

          //Get the right direction
          tempRight = new THREE.Vector3(cam.right.x * offsetX, cam.right.y * offsetX, cam.right.z * offsetX);

          subcamera.position.add(tempRight);
          subcamera.updateMatrixWorld();

          subcamera.projectionMatrix.copy(cam.projectionMatrix);
          subcamera.projectionMatrix.elements[8] = -2 * offsetX / (size * cam.aspect);
      }


     renderer.render(scene, this.cameras);
     renderer.setRenderTarget(null);
  };





















}
