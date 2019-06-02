class HoloAppType {

  /*
  *   normal usage of the looking glass
  *   => the rendering size is based on the window -> enter in fullscreen onclick
  */
  public static HOLOGRAM:string = "HOLOGRAM";




  /*
  *  should be used when you want to create a video of the pre-processed hologram rendering
  *  The video will work only with the looking glass (and its calibration) used during the encoding of the video
  *  In order to increase performance during the encoding, the rendering output is not added to the html-body
  *  Because every things is pre-processed, you can create very complex animation, using a huge quilt-texture-size and a huge amount of view
  *  It will be slow to encode but once it will be encoded as a video, it would be the lightest solution with the highest quality possible
  *  WARNING : The output video will be readable on every video player but the content will appear as expected only on the LG in fullscreen
  */
  public static HOLOGRAM_VIDEO_ENCODER:string = "HOLOGRAM_VIDEO_ENCODER";



  /*
  *  should be used when you want to create a quilt-video containing every views
  *  In order to increase performance during the encoding, the rendering output is not added to the html-body
  *  The quilt-video will need a quilt-player in order to render the hologram as expected.
  *  The quilt-video will be runnable on every looking glass (this is the version you should share on the looking glass library)
  */
  public static QUILT_VIDEO_ENCODER:string = "QUILT_VIDEO_ENCODER";




  /*
  *  classic rendering usable on regular screen , without multi-view-capture & hologramEffect
  *  Should be used when you create your demo, before to deploy on the looking glass
  */
  public static CLASSIC_RENDERING:string = "CLASSIC_RENDERING";

}
