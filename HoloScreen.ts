class HoloScreen extends THREE.Mesh {

  public holoplay:HoloPlay;
  public multiViewRenderer:HoloMultiViewRenderer;

  protected _depthRatio:number = 1;

  constructor(holoplay:HoloPlay){




    super(new THREE.PlaneGeometry(1,1),new THREE.ShaderMaterial({
      vertexShader:`
      varying vec2 iUv;

      void main() {
          iUv = uv;
          vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * modelViewPosition;

      }
      `,

      fragmentShader:`
        uniform sampler2D multiTexture;
        uniform float pitch;
        uniform float tilt;
        uniform float center;
        uniform float subp;
        uniform float tilesX;
        uniform float tilesY;
        uniform float numViews;


        varying vec2 iUv;

        vec2 texArr(in vec3 uvz, out vec2 result) {
            float z = floor(uvz.z * numViews);
            result.x = (mod(z, tilesX) + uvz.x) / tilesX;
            result.y = (floor(z / tilesX) + uvz.y) / tilesY;
            return result;
        }

        float Remap(float value, float from1, float to1, float from2, float to2){
           return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
        }

        void main()
        {

            vec3 nuv = vec3(iUv.xy, 0.0);
            vec2 resultUv = vec2(0.0);


            gl_FragColor = vec4(1.0);


            nuv.z = (nuv.x + nuv.y * tilt) * pitch - center;
            nuv.z = mod(nuv.z + ceil(abs(nuv.z)), 1.0);
            gl_FragColor.r = texture2D(multiTexture, texArr(nuv , resultUv) ).r;

            nuv.z = (nuv.x + subp + nuv.y * tilt) * pitch - center;
            nuv.z = mod(nuv.z + ceil(abs(nuv.z)), 1.0);
            gl_FragColor.g = texture2D(multiTexture, texArr(nuv , resultUv)).g;

            nuv.z = (nuv.x + 2.0 * subp + nuv.y * tilt) * pitch - center;
            nuv.z = mod(nuv.z + ceil(abs(nuv.z)), 1.0);
            gl_FragColor.b = texture2D(multiTexture, texArr(nuv , resultUv)).b;


        }
      `,
      uniforms:{
        multiTexture: {value: holoplay.multiViewRenderer.texture},
        pitch: {value:0},
        tilt: {value:0},
        center: {value:0},
        subp: {value:0},
        numViews: {value:0},
        tilesX: {value:0},
        tilesY: {value:0},
      }
    }))

    this.holoplay = holoplay;
    this.multiViewRenderer = holoplay.multiViewRenderer;
  }

  public get uniforms():any{return (this.material as THREE.ShaderMaterial).uniforms}


  public updateViewConePitchAndTilt():void{
    const uniforms:any = this.uniforms;
    const holo:HoloPlay = this.holoplay;
    if(!holo.ready) return;



    var aspect = window.innerWidth / window.innerHeight;
    var screenInches = (window.innerWidth /  holo.DPI)   ;
    var newPitch = holo.pitch * screenInches ;
    //account for tilt in measuring pitch horizontally
    newPitch *= Math.cos(Math.atan(1.0 / holo.slope ));
    uniforms.pitch.value = newPitch;





    this.multiViewRenderer.viewCone = Math.sqrt(newPitch  * screenInches  )   *  (window.innerHeight/1600) / (5 * 2560/window.innerWidth)   * this._depthRatio;

    //console.log("this.multiViewRenderer.viewCone = ",this.multiViewRenderer.viewCone,"  :  ",this._depthRatio)

    //tilt
    var newTilt = window.innerHeight / (window.innerWidth * holo.slope);
    uniforms.tilt.value = newTilt;
  }

  public get depthRatio():number{return this._depthRatio};
  public set depthRatio(n:number){
    this._depthRatio = n;
    this.updateViewConePitchAndTilt();
  }




  public init(dpi:number, pitch:number, slope:number, center:number){
        console.log("INIT => ",dpi,pitch,slope,center)


        const uniforms:any = this.uniforms;

        this.updateViewConePitchAndTilt();

        //center
        //I need the relationship between the amount of pixels I have moved over to the amount of lenticulars I have jumped
        //ie how many pixels are there to a lenticular?
        uniforms.center.value = center // ((window.innerWidth/window.innerHeight) / 1.6) ;

        //uniforms.subp.value = 1/(window.innerWidth*3)
        //uniforms.subp.value = 1/(this.multiViewRenderer.viewWidth*3)
        //uniforms.subp.value = 1/(screenW * 3);
        uniforms.subp.value = 1 / (this.multiViewRenderer.width*3)   //(dx*3) ;


        uniforms.tilesX.value = this.multiViewRenderer.nbX;
        uniforms.tilesY.value = this.multiViewRenderer.nbY;
        uniforms.numViews.value = this.multiViewRenderer.nbView;
        this.material.needsUpdate = true;
  }




}
