# holoplay_typescript
an implementation of the library Holoplay.js (based on Three.js) in typescript. 
(It mush be used with the holographic display "the looking glass") 
More info about it here : https://lookingglassfactory.com/ 


My implementation doesn't represents exactly the original Holoplay.js create by the LookingGlass - team. 
I customize a bit the calibration to make it workable in windowed-mode. 

(known issue : in windowed mode, the parallax works as expected when you are in front of the device, but if you move too far, the view become incorrect ; I tryed to fix it as much as possible, it's not perfect but it's usable most of the time ; there is no problem in fullscreen)


Contrary to Holoplay.js I decomposed the project into classes : 

- HoloMultiViewRenderer : it represents the "spritesheet-texture" containing all the views of the scene 

- TextureQuality : an enumeration of values in power-of-two (from 512 to 8192) that will be used as size for the HoloMultiViewRenderer 
- ViewQuality : an enumeration of values (from 4 to 8) that will be used as grid-size for the HoloMultiViewRenderer 

- HoloScreen : it represent the final output (the holographic shader is here)  

- HoloEppRom : it handle the connection with the driver and apply the calibration value(pitch, slope and center ) on the HoloScreen
               If the connection failed, a default calibration will be applyed 
               
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
Look at this at this class and the index.html to see how it works

You can see the demo here : http://beginfill.com/holoplay_typescript/demo/
