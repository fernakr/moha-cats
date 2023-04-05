precision mediump float;
  
  uniform sampler2D u_tex0; // input texture
  uniform vec2 u_resolution; // canvas resolution
  uniform float u_time; // time in seconds
  uniform float u_offset; // offset in pixels
  varying vec2 vTexCoord; // texture coordinates
  
  void main() {
    // Get pixel color from input texture
    vec2 uv = vTexCoord;
  
    // the texture is loaded upside down and backwards by default so lets flip it
    uv.y = 1.0 - uv.y;
    vec4 color = texture2D(u_tex0, uv);
    
    // Calculate offset for drip effect
    float offset = sin(u_time * 5.0 + uv.y * 100.0) * u_offset * .0001;
    
    // Apply offset to texture coordinates
    vec2 texCoord = uv + vec2(0.0, offset);
    
    // Get color from updated texture coordinates
    vec4 finalColor = texture2D(u_tex0, texCoord);
    
    // Set final color
    gl_FragColor = finalColor;
  }