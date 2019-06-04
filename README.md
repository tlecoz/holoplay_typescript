# holoplay_typescript
an implementation of the library Holoplay.js (based on Three.js) in typescript. 
(It mush be used with the holographic display "the looking glass") 
More info about it here : https://lookingglassfactory.com/ 

the project is composed by theses classes : 

- HoloMultiViewRenderer : it represents the "spritesheet-texture" containing all the views of the scene 

- HoloScreen : it represent the final output (the holographic shader is here)  

- HoloEppRom : it handle the connection with the driver and apply the calibration value(pitch, slope and center ) on the HoloScreen
               If the connection failed, a default calibration will be applyed 
               IMPORTANT : the default configuration is the confiration of my looking glass, you should update these values 
                            by yours (you should see it in the console when the connection works)
                            
       the connection may failed because of the looking-glass-driver for three.js, don't know why
       but I need to re-install it everyday if I want it to work 
       (most of the time my app use the default values)
               
- Holoplay : a top level object that drives the other classes 

- HoloplayApp : a kind of template-base-class (your demo should/could extends this class) 



HoloplayApp contains few methods and property :

- HoloplayApp.addEventListener is a "bridge" to HoloplayApp.renderer.domElement.addEventListener ; 
it allow you to handle a mouse-event (for example) directly from the app

- HoloplayApp.getFullscreen is a "bridge" to HoloplayApp.renderer.domElement.requestFullScreen ; 

- useBlackBorderAroundFullscreen : if you call this function, it will add a black border around the screen. 
  It will prevent the "mirror effect" that you can see when an object is touching an edge of the screen 

- fieldOfVision is a "bridge" to HoloplayApp.camera.fieldOfVision ; it update the projectionMatrix when you update the value.

- HoloplayApp.parallaxRatio allow you to customize the "strength" of the parallax (default is 1) 


I join a class Demo that extends HoloplayApp 
Look at this class and the index.html to see how it works

You can see the demo here : http://beginfill.com/holoplay_typescript/demo/


I recently added a class QuiltPlayer. 
It's a video-player that take a video composed by a grid of views in input, apply the holographic shader and output the result. 
You can create your "quilt-videos" with this tool (it's made with nwjs and should be usable on mac and linux but I'm using the Windows version)

https://github.com/tlecoz/holoplayToMp4

You can try the quilt-player here : 
http://beginfill.com/quiltPlayer/ 

and try to play this short video (a single second) inside :
http://beginfill.com/quiltPlayer/output_6_6_2048_2048.mp4



