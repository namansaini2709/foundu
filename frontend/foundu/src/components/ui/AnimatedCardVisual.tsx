import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AnimatedCardVisual = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) }
            },
            vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;

        #define NUM_OCTAVES 3

        float rand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u = fract(p);
          u = u*u*(3.0-2.0*u);

          float res = mix(
            mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
            mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
          return res * res;
        }

        float fbm(vec2 x) {
          float v = 0.0;
          float a = 0.3;
          vec2 shift = vec2(100);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 p = gl_FragCoord.xy / iResolution.xy;
          vec2 uv = p * 2.0 - 1.0;
          uv.x *= iResolution.x / iResolution.y;

          float time = iTime * 0.2;
          
          vec3 color = vec3(0.0);
          
          // Cyberpunk grid/glow effect
          float glow = 0.0;
          for(float i = 0.0; i < 3.0; i++) {
            vec2 offset = vec2(i * 0.1, i * 0.2);
            float noiseVal = fbm(uv * (2.0 + i) + offset + time);
            glow += 0.1 / length(uv - vec2(sin(time + i), cos(time * 0.7 + i)) * 0.5);
            color += vec3(0.05, 0.2, 0.5) * glow * noiseVal;
          }
          
          // Add some scanlines
          float scanline = sin(uv.y * 100.0 + time * 10.0) * 0.02;
          color += vec3(scanline);

          gl_FragColor = vec4(color, 1.0);
        }
      `
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        let frameId: number;
        const animate = () => {
            material.uniforms.iTime.value += 0.02;
            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
            if (!container) return;
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            material.uniforms.iResolution.value.set(width, height);
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);

        return () => {
            cancelAnimationFrame(frameId);
            resizeObserver.disconnect();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full bg-black relative overflow-hidden">
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Overlay UI Elements */}
            <div className="absolute top-12 left-12 z-10 pointer-events-none">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    <span className="text-blue-400 font-mono text-xs tracking-[0.2em] uppercase">System Online</span>
                </div>
                <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight leading-tight drop-shadow-2xl">
                    FoundU<br />
                    <span className="text-blue-500">Access</span>
                </h1>
            </div>

            <div className="absolute bottom-12 left-12 z-10 w-64 pointer-events-none">
                <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 transform transition-all duration-500 hover:scale-105 hover:border-blue-500/30">
                    <div className="font-mono text-xs text-blue-300 mb-3 border-b border-white/5 pb-2 flex justify-between">
                        <span>$ ./init_sequence.sh</span>
                        <span className="animate-pulse">_</span>
                    </div>
                    <div className="space-y-2 text-gray-400 font-mono text-[10px] leading-relaxed">
                        <div className="flex gap-2">
                            <span className="text-blue-500">›</span>
                            <span>Connecting to secure nodes...</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-blue-500">›</span>
                            <span>Establishing handshake...</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-emerald-400">›</span>
                            <span className="text-emerald-400">Connection established.</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <span className="text-white animate-pulse">›</span>
                            <span className="text-white font-bold">Ready to build.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimatedCardVisual;
