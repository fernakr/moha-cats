#ifdef GL_ES
precision mediump float;
#endif

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform vec2 uMouse;
uniform float uTime;

void main() {
  vec2 uv = vTexCoord;
  
  // the texture is loaded upside down and backwards by default so lets flip it
  uv.y = 1.0 - uv.y;
  
  vec4 tex = texture2D(tex0, uv);
  
  float gray = (tex.r + tex.g + tex.b) / 3.0;
  
  float res = 20.0;
  float scl = res / (10.0);
 
  float threshR = (fract(floor(tex.r*res + 1.0 * cos(uv.x * 2.0 * uv.y + uMouse.x + .0001 * uTime))/scl)*scl) * gray;
  float threshG = (fract(floor(tex.g*res + 0.5 * sin(uv.y * 8.0 * uv.y + uMouse.x + .0001 * uTime))/scl)*scl) * gray ;
  float threshB = (fract(floor(tex.b*res + 0.5 * tan(uv.x * 2.0 * uv.y + uMouse.x + .0001 * uTime))/scl)*scl) * gray ;
  vec3 thresh = vec3(threshR, threshG, threshB);

  // render the output
  gl_FragColor = vec4(thresh, 1.0);
}
