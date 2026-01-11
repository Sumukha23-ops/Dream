
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { NeuralEmotion } from '../types';

interface NeuralEntityProps {
  emotion: NeuralEmotion;
}

const NeuralEntity: React.FC<NeuralEntityProps> = ({ emotion }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const blinkTimerRef = useRef<number>(0);
  const isBlinkingRef = useRef<boolean>(false);
  const isWinkingRef = useRef<boolean>(false);
  const emoteRef = useRef<THREE.Group | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const width = 600;
    const height = 600;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // --- ROBOT CHARACTER CONSTRUCTION ---
    const robotIconGroup = new THREE.Group();
    scene.add(robotIconGroup);

    // 1. Head Chassis
    const headGeo = new THREE.BoxGeometry(3.2, 2.6, 2.4);
    const headMat = new THREE.MeshPhysicalMaterial({
      color: 0xfefefe,
      metalness: 0.3,
      roughness: 0.1,
      envMapIntensity: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    robotIconGroup.add(head);

    // 2. The Visor (Mood Ring Layer)
    const visorGeo = new THREE.PlaneGeometry(2.8, 1.8);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.1,
      metalness: 0.9,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.z = 1.21;
    head.add(visor);

    // 3. Antennas
    const antGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
    const tipGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const antMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const tipMatL = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 2 });
    const tipMatR = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 2 });

    const createAntenna = (xPos: number, mat: any) => {
      const group = new THREE.Group();
      const stick = new THREE.Mesh(antGeo, antMat);
      const tip = new THREE.Mesh(tipGeo, mat);
      tip.position.y = 0.5;
      group.add(stick, tip);
      group.position.set(xPos, 1.6, 0);
      return group;
    };

    const antL = createAntenna(-0.8, tipMatL);
    const antR = createAntenna(0.8, tipMatR);
    head.add(antL, antR);

    // 4. Eyes
    const eyeGeo = new THREE.PlaneGeometry(0.6, 0.6);
    const eyeMat = new THREE.MeshBasicMaterial({ 
      color: 0x06b6d4, 
      transparent: true, 
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.65, 0, 1.22);
    eyeR.position.set(0.65, 0, 1.22);
    head.add(eyeL, eyeR);

    // 5. Emote Particles Group
    const emoteGroup = new THREE.Group();
    robotIconGroup.add(emoteGroup);
    emoteRef.current = emoteGroup;

    // --- PROCEDURAL SHAPES ---
    const createHeart = () => {
      const shape = new THREE.Shape();
      const x = 0, y = 0;
      shape.moveTo(x + 0.25, y + 0.25);
      shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
      shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
      shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
      shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
      shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
      shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);
      return new THREE.ShapeGeometry(shape);
    };

    const createStar = () => {
      const shape = new THREE.Shape();
      const outerRadius = 0.5;
      const innerRadius = 0.2;
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        if (i === 0) shape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        else shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      return new THREE.ShapeGeometry(shape);
    };

    const createSparkle = () => new THREE.BoxGeometry(0.1, 0.1, 0.1);

    // Lighting
    const mainLight = new THREE.DirectionalLight(0xffffff, 2);
    mainLight.position.set(5, 5, 10);
    scene.add(mainLight);
    const ambient = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambient);

    const updateEmotionState = (state: NeuralEmotion, time: number) => {
      let color = new THREE.Color(0x06b6d4);
      let eyeScaleYL = 1;
      let eyeScaleYR = 1;
      let eyeRotZ = 0;
      let floatIntensity = 1;
      let antWiggle = 0;
      let headTilt = 0;
      let headJitter = 0;
      let headBob = 0;

      // Handle Blinking & Winking
      if (Date.now() > blinkTimerRef.current) {
        if (Math.random() < 0.2 && state === NeuralEmotion.AMUSED) {
          isWinkingRef.current = true;
          blinkTimerRef.current = Date.now() + 200;
        } else {
          isBlinkingRef.current = true;
          blinkTimerRef.current = Date.now() + 120;
        }
        if (Date.now() > blinkTimerRef.current) {
          isBlinkingRef.current = false;
          isWinkingRef.current = false;
          blinkTimerRef.current = Date.now() + 2000 + Math.random() * 4000;
        }
      }

      switch(state) {
        case NeuralEmotion.HAPPY:
          color.set(0x10b981);
          eyeScaleYL = 0.4; eyeScaleYR = 0.4;
          eyeRotZ = Math.PI; 
          floatIntensity = 1.6;
          headBob = Math.sin(time * 5) * 0.1;
          antWiggle = Math.sin(time * 10) * 0.15;
          if (Math.random() < 0.05) {
             const h = new THREE.Mesh(createHeart(), new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.7 }));
             h.scale.setScalar(0.4);
             h.position.set((Math.random()-0.5)*4, 1, (Math.random()-0.5)*2);
             h.rotation.z = Math.PI;
             emoteGroup.add(h);
          }
          break;
        case NeuralEmotion.SAD:
          color.set(0x3b82f6);
          eyeScaleYL = 0.3; eyeScaleYR = 0.3;
          eyeRotZ = -Math.PI / 8;
          floatIntensity = 0.5;
          headTilt = Math.PI / 10;
          break;
        case NeuralEmotion.EXCITED:
          color.set(0xf472b6);
          eyeScaleYL = 1.3; eyeScaleYR = 1.3;
          floatIntensity = 3.5;
          headBob = Math.sin(time * 15) * 0.3;
          antWiggle = Math.sin(time * 25) * 0.5;
          if (Math.random() < 0.15) {
             const s = new THREE.Mesh(createStar(), new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.9 }));
             s.scale.setScalar(0.3);
             s.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*6, (Math.random()-0.5)*2);
             emoteGroup.add(s);
          }
          break;
        case NeuralEmotion.AMUSED:
          color.set(0x84cc16);
          eyeScaleYL = 0.6; eyeScaleYR = 0.6;
          eyeRotZ = Math.PI;
          floatIntensity = 2.0;
          headTilt = Math.sin(time * 4) * 0.2;
          if (isWinkingRef.current) eyeScaleYR = 0.05;
          break;
        case NeuralEmotion.EMPATHETIC:
          color.set(0x2dd4bf);
          eyeScaleYL = 0.8; eyeScaleYR = 0.8;
          floatIntensity = 0.7;
          headTilt = Math.PI / 16;
          if (Math.random() < 0.03) {
            const circle = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.5 }));
            circle.position.set((Math.random()-0.5)*4, (Math.random()-0.5)*4, (Math.random()-0.5)*2);
            emoteGroup.add(circle);
          }
          break;
        case NeuralEmotion.FRUSTRATED:
          color.set(0xf97316);
          eyeScaleYL = 0.2; eyeScaleYR = 0.2;
          floatIntensity = 4.0;
          headJitter = Math.sin(time * 60) * 0.15;
          antWiggle = Math.sin(time * 40) * 0.4;
          break;
        case NeuralEmotion.INSPIRED:
          color.set(0xfef08a);
          eyeScaleYL = 1.1; eyeScaleYR = 1.1;
          floatIntensity = 1.2;
          if (Math.random() < 0.2) {
            const spark = new THREE.Mesh(createSparkle(), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
            spark.position.set((Math.random()-0.5)*5, 1.5 + Math.random()*3, (Math.random()-0.5)*3);
            emoteGroup.add(spark);
          }
          break;
        case NeuralEmotion.CURIOUS:
          color.set(0xf59e0b);
          eyeScaleYL = 1.2; eyeScaleYR = 0.8;
          headTilt = Math.sin(time * 1.5) * 0.3;
          floatIntensity = 1.0;
          break;
        case NeuralEmotion.THINKING:
          color.set(0x8b5cf6);
          eyeScaleYL = 0.15; eyeScaleYR = 0.15;
          eyeRotZ = time * 3;
          floatIntensity = 0.3;
          break;
        case NeuralEmotion.ALERT:
          color.set(0xef4444);
          eyeScaleYL = 1.4; eyeScaleYR = 1.4;
          headJitter = Math.sin(time * 80) * 0.1;
          floatIntensity = 5;
          break;
        case NeuralEmotion.PROUD:
          color.set(0xfbbf24);
          eyeScaleYL = 0.6; eyeScaleYR = 0.6;
          headTilt = -0.1;
          floatIntensity = 1.0;
          break;
        case NeuralEmotion.ERROR:
          color.set(0xef4444);
          eyeRotZ = Math.PI / 4; 
          floatIntensity = 6;
          headJitter = Math.sin(time * 70) * 0.12;
          break;
        default:
          if (isBlinkingRef.current) { eyeScaleYL = 0.05; eyeScaleYR = 0.05; }
      }

      eyeMat.color.copy(color);
      tipMatL.color.copy(color);
      tipMatL.emissive.copy(color);
      tipMatR.color.copy(color);
      tipMatR.emissive.copy(color);
      
      eyeL.scale.y = eyeScaleYL;
      eyeR.scale.y = eyeScaleYR;
      eyeL.rotation.z = eyeRotZ;
      eyeR.rotation.z = -eyeRotZ;

      antL.rotation.x = antWiggle;
      antR.rotation.x = -antWiggle;
      head.rotation.z = headTilt;
      head.position.x = headJitter;
      head.position.y = headBob;

      // Visor Mood Pulse
      const visorPulse = 0.05 + Math.sin(time * 3) * 0.05;
      visorMat.emissive = color;
      visorMat.emissiveIntensity = visorPulse;

      return floatIntensity;
    };

    const animate = () => {
      const time = Date.now() * 0.001;
      requestRef.current = requestAnimationFrame(animate);
      
      const floatFactor = updateEmotionState(emotion, time);

      robotIconGroup.position.y = Math.sin(time * 1.5 * floatFactor) * 0.4;
      robotIconGroup.rotation.y = Math.sin(time * 0.4) * 0.15;
      robotIconGroup.rotation.x = Math.cos(time * 0.5) * 0.1;

      // Animate emotes
      emoteGroup.children.forEach((emote: any) => {
        if (emotion === NeuralEmotion.SAD) {
          emote.position.y -= 0.03;
        } else if (emotion === NeuralEmotion.FRUSTRATED) {
           emote.position.x += (Math.random()-0.5) * 0.2;
           emote.position.y += 0.05;
        } else {
          emote.position.y += 0.02;
        }
        emote.material.opacity = (emote.material.opacity || 1) - 0.006;
        if (emote.material.opacity <= 0) {
          emoteGroup.remove(emote);
        }
      });

      renderer.render(scene, camera);
    };

    blinkTimerRef.current = Date.now() + 2000;
    animate();

    return () => {
      cancelAnimationFrame(requestRef.current);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [emotion]);

  return (
    <div 
      ref={containerRef} 
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 z-0"
      style={{ width: '600px', height: '600px' }}
    />
  );
};

export default NeuralEntity;
