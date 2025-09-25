"use client";

import React, { useEffect, useRef, useCallback } from 'react';

interface FluidSimulationProps {
  className?: string;
}

export default function FluidSimulation({ className = "" }: FluidSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseRef = useRef<{ x: number; y: number; prevX: number; prevY: number }>({ 
    x: 0, y: 0, prevX: 0, prevY: 0 
  });

  // Vertex shader source
  const vertexShaderSource = `#version 300 es
    in vec2 a_position;
    in vec2 a_texCoord;
    out vec2 v_texCoord;
    
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texCoord = a_texCoord;
    }
  `;

  // Fragment shader for fluid simulation
  const fragmentShaderSource = `#version 300 es
    precision highp float;
    
    in vec2 v_texCoord;
    out vec4 fragColor;
    
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform vec2 u_velocity;
    uniform float u_time;
    uniform sampler2D u_texture;
    
    // Noise function for fluid turbulence
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
      vec2 uv = v_texCoord;
      vec2 pixel = 1.0 / u_resolution;
      
      // Calculate distance to mouse
      vec2 mouseUV = u_mouse / u_resolution;
      float dist = length(uv - mouseUV);
      
      // Create fluid effect based on distance and velocity
      float influence = exp(-dist * 8.0);
      vec2 velocity = u_velocity * influence * 0.01;
      
      // Sample neighboring pixels for fluid advection
      vec4 color = texture(u_texture, uv - velocity);
      
      // Add new fluid at mouse position
      if (dist < 0.05) {
        float intensity = (0.05 - dist) / 0.05;
        vec3 fluidColor = vec3(
          0.2 + sin(u_time * 2.0) * 0.1,
          0.6 + cos(u_time * 1.5) * 0.2,
          0.9 + sin(u_time * 3.0) * 0.1
        );
        color.rgb += fluidColor * intensity * length(u_velocity) * 0.1;
      }
      
      // Fluid dissipation
      color.rgb *= 0.995;
      
      // Add some turbulence
      vec2 turbulence = vec2(
        noise(uv * 10.0 + u_time),
        noise(uv * 10.0 + u_time + 100.0)
      ) * 0.002;
      
      color.rgb += texture(u_texture, uv + turbulence).rgb * 0.1;
      
      fragColor = color;
    }
  `;

  const createShader = useCallback((gl: WebGL2RenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }, []);

  const createProgram = useCallback((gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    
    return program;
  }, []);

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }

    glRef.current = gl;

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    programRef.current = program;

    // Create quad vertices
    const vertices = new Float32Array([
      -1, -1, 0, 0,
       1, -1, 1, 0,
      -1,  1, 0, 1,
       1,  1, 1, 1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Set up attributes
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(texCoordLocation);

    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);

    // Create textures for double buffering
    const texture1 = gl.createTexture();
    const texture2 = gl.createTexture();

    [texture1, texture2].forEach(texture => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    });

    // Create framebuffers
    const framebuffer1 = gl.createFramebuffer();
    const framebuffer2 = gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer1);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture1, 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture2, 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // Store references
    (gl as any).fluidTextures = [texture1, texture2];
    (gl as any).fluidFramebuffers = [framebuffer1, framebuffer2];
    (gl as any).currentTexture = 0;

  }, [createShader, createProgram]);

  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    
    if (!gl || !program || !canvas) return;

    const currentTexture = (gl as any).currentTexture;
    const nextTexture = 1 - currentTexture;

    // Render to framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, (gl as any).fluidFramebuffers[nextTexture]);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.useProgram(program);

    // Set uniforms
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const velocityLocation = gl.getUniformLocation(program, 'u_velocity');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const textureLocation = gl.getUniformLocation(program, 'u_texture');

    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);
    gl.uniform2f(velocityLocation, velocityRef.current.x, velocityRef.current.y);
    gl.uniform1f(timeLocation, performance.now() * 0.001);
    gl.uniform1i(textureLocation, 0);

    // Bind current texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, (gl as any).fluidTextures[currentTexture]);

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Render to screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.bindTexture(gl.TEXTURE_2D, (gl as any).fluidTextures[nextTexture]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Swap textures
    (gl as any).currentTexture = nextTexture;

    // Decay velocity
    velocityRef.current.x *= 0.95;
    velocityRef.current.y *= 0.95;

    requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    initWebGL();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = canvas.height - (e.clientY - rect.top); // Flip Y coordinate

      velocityRef.current.x = (x - mouseRef.current.x) * 0.5;
      velocityRef.current.y = (y - mouseRef.current.y) * 0.5;

      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
    };

    const handleResize = () => {
      resizeCanvas();
      initWebGL();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Start render loop
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [initWebGL, render]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-[1] pointer-events-none ${className}`}
      style={{ 
        opacity: 0.7,
        mixBlendMode: 'screen'
      }}
    />
  );
}
