/**
 * Disclaimer: This component is not entirely my own
 */

"use client";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useMouse } from "@/hooks/useMouse";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Gsap Ticker Function
function useTicker(callback: any, paused: boolean) {
  useEffect(() => {
    if (!paused && callback) {
      gsap.ticker.add(callback);
    }
    return () => {
      gsap.ticker.remove(callback);
    };
  }, [callback, paused]);
}

const EMPTY_SET = {} as {
  x: Function;
  y: Function;
  r?: Function;
  width?: Function;
  rt?: Function;
  sx?: Function;
  sy?: Function;
};

const EMPTY_POS = {} as { x: number; y: number };
function useInstance<T>(value: T | (() => T), isEmpty: T): T {
  const ref = useRef<T>(isEmpty);
  if (ref.current === isEmpty) {
    ref.current = typeof value === "function" ? (value as () => T)() : value as T;
  }
  return ref.current;
}

// Function for Mouse Move Scale Change
function getScale(diffX: number, diffY: number) {
  const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
  return Math.min(distance / 735, 0.35);
}

// Function For Mouse Movement Angle in Degrees
function getAngle(diffX: number, diffY: number) {
  return (Math.atan2(diffY, diffX) * 180) / Math.PI;
}

function getRekt(el: HTMLElement): HTMLElement | null {
  // ULTRA-AGGRESSIVE hover detection - check everything possible
  
  // Check the element itself first
  if (el.classList?.contains("cursor-can-hover")) {
    return el;
  }
  
  // Check for ANY interactive element type
  const interactiveElements = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
  if (interactiveElements.includes(el.tagName)) {
    return el;
  }
  
  // Check for interactive roles
  const role = el.getAttribute('role');
  if (role && ['button', 'link', 'menuitem', 'tab', 'option'].includes(role)) {
    return el;
  }
  
  // Check for cursor pointer style
  const computedStyle = window.getComputedStyle(el);
  if (computedStyle.cursor === 'pointer') {
    return el;
  }
  
  // Check onclick handler
  if (el.onclick || el.getAttribute('onclick')) {
    return el;
  }
  
  // Check up to 10 levels of parent elements (more aggressive)
  let currentEl = el.parentElement;
  let depth = 0;
  while (currentEl && depth < 10) {
    if (currentEl.classList?.contains("cursor-can-hover")) {
      return currentEl;
    }
    
    if (interactiveElements.includes(currentEl.tagName)) {
      return currentEl;
    }
    
    const parentRole = currentEl.getAttribute('role');
    if (parentRole && ['button', 'link', 'menuitem', 'tab', 'option'].includes(parentRole)) {
      return currentEl;
    }
    
    const parentStyle = window.getComputedStyle(currentEl);
    if (parentStyle.cursor === 'pointer') {
      return currentEl;
    }
    
    if (currentEl.onclick || currentEl.getAttribute('onclick')) {
      return currentEl;
    }
    
    currentEl = currentEl.parentElement;
    depth++;
  }
  
  return null;
}

const CURSOR_DIAMETER = 50;

function ElasticCursor() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // React Refs for Jelly Blob and Text
  const jellyRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const { x, y } = useMouse();

  // Save pos and velocity Objects
  const pos = useInstance(() => ({ x: 0, y: 0 }), EMPTY_POS);
  const vel = useInstance(() => ({ x: 0, y: 0 }), EMPTY_POS);
  const set = useInstance<{
    x?: Function;
    y?: Function;
    r?: Function;
    width?: Function;
    sx?: Function;
    sy?: Function;
  }>(() => ({}), EMPTY_SET);

  // Track current hover target and active tween to avoid resets
  const hoverTargetRef = useRef<HTMLElement | null>(null);
  const hoverTweenRef = useRef<gsap.core.Tween | null>(null);
  
  // Stabilization - prevent rapid switching between child elements
  const lastHoverTargetRef = useRef<HTMLElement | null>(null);
  const hoverStabilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set GSAP quick setter Values on useLayoutEffect Update
  useLayoutEffect(() => {
    set.x = gsap.quickSetter(jellyRef.current, "x", "px");
    set.y = gsap.quickSetter(jellyRef.current, "y", "px");
    set.r = gsap.quickSetter(jellyRef.current, "rotate", "deg");
    set.sx = gsap.quickSetter(jellyRef.current, "scaleX");
    set.sy = gsap.quickSetter(jellyRef.current, "scaleY");
    set.width = gsap.quickSetter(jellyRef.current, "width", "px");
  }, [set]);

  // Start Animation loop - COMPLETELY disabled during hover, recreate element when not hovering
  const loop = useCallback(() => {
    if (!set.width || !set.sx || !set.sy || !set.r) return;
    
    // COMPLETE SKIP during hover - let fresh elements handle everything
    if (isHovering) return;
    
    // For non-hover state, also recreate element periodically for ultra-fresh state
    if (jellyRef.current && Math.random() > 0.98) { // 2% chance per frame to recreate
      const currentElement = jellyRef.current;
      if (currentElement.parentNode) {
        const parent = currentElement.parentNode;
        
        // Create ultra-fresh element with unique identity
        const loopUniqueId = `loop-cursor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const loopElementType = Math.random() > 0.5 ? 'div' : 'span';
        const ultraFreshElement = document.createElement(loopElementType);
        ultraFreshElement.id = loopUniqueId;
        // Copy minimal positioning only, no transforms
        const currentRect = currentElement.getBoundingClientRect();
        ultraFreshElement.style.cssText = `
          position: fixed;
          left: ${currentRect.left}px;
          top: ${currentRect.top}px;
          width: ${currentRect.width}px;
          height: ${currentRect.height}px;
          border-radius: 25px;
          z-index: 100;
          pointer-events: none;
          border: 2px solid white;
          backdrop-filter: invert(100%);
          margin: 0;
          padding: 0;
          transform: none;
          transition: none;
          animation: none;
        `;
        
        parent.removeChild(currentElement);
        parent.appendChild(ultraFreshElement);
        
        // Update ref
        Object.defineProperty(jellyRef, 'current', {
          value: ultraFreshElement,
          writable: true,
          configurable: true
        });
        
        // Recreate setters for ultra-fresh element
        set.x = gsap.quickSetter(ultraFreshElement, "x", "px");
        set.y = gsap.quickSetter(ultraFreshElement, "y", "px");
        set.r = gsap.quickSetter(ultraFreshElement, "rotate", "deg");
        set.sx = gsap.quickSetter(ultraFreshElement, "scaleX");
        set.sy = gsap.quickSetter(ultraFreshElement, "scaleY");
        set.width = gsap.quickSetter(ultraFreshElement, "width", "px");
      }
    }
    
    // Calculate angle and scale based on velocity
    var rotation = getAngle(+vel.x, +vel.y); // Mouse Move Angle
    var scale = getScale(+vel.x, +vel.y); // Blob Squeeze Amount

    // Set positioning using pure left/top instead of transforms
    if (jellyRef.current) {
      jellyRef.current.style.left = pos.x - CURSOR_DIAMETER/2 + 'px';
      jellyRef.current.style.top = pos.y - CURSOR_DIAMETER/2 + 'px';
      jellyRef.current.style.width = (50 + scale * 300) + 'px';
      jellyRef.current.style.height = (50 + scale * 300) + 'px';
      jellyRef.current.style.transform = `rotate(${rotation}deg) scaleX(${1 + scale}) scaleY(${1 - scale * 2})`;
    }
  }, [isHovering, set, pos.x, pos.y, vel.x, vel.y]);

  const [cursorMoved, setCursorMoved] = useState(false);
  // Run on Mouse Move
  useLayoutEffect(() => {
    if (isMobile) return;
    // Calculate Everything Function
    const setFromEvent = (e: MouseEvent) => {
      if (!jellyRef.current) return;
      if (!cursorMoved) {
        setCursorMoved(true);
      }
      // Mouse X and Y - get this first
      const x = e.clientX;
      const y = e.clientY;
      
      const el = e.target as HTMLElement;
      const hoverElement = getRekt(el);
      
      if (hoverElement) {
        const rect = hoverElement.getBoundingClientRect();
        
        // STABILITY CHECK - prevent rapid switching between child elements of same parent
        const shouldStabilize = lastHoverTargetRef.current && 
          lastHoverTargetRef.current !== hoverElement &&
          (lastHoverTargetRef.current.contains(hoverElement) || 
           hoverElement.contains(lastHoverTargetRef.current) ||
           lastHoverTargetRef.current.parentElement === hoverElement.parentElement);

        if (shouldStabilize) {
          // Clear any existing timeout
          if (hoverStabilityTimeoutRef.current) {
            clearTimeout(hoverStabilityTimeoutRef.current);
          }
          
          // Set a small delay before switching - if mouse moves again, this gets cancelled
          hoverStabilityTimeoutRef.current = setTimeout(() => {
            lastHoverTargetRef.current = hoverElement;
          }, 30); // Reduced from 50ms to 30ms for better responsiveness
          
          // Use the last stable target for now
          return;
        }

        lastHoverTargetRef.current = hoverElement;

        // NUCLEAR BROWSER CACHE BUSTING - Force complete reset every time
        if (hoverTargetRef.current !== hoverElement) {
          hoverTargetRef.current = hoverElement;
          
          // STEP 1: Kill everything and force browser to forget
          if (hoverTweenRef.current) {
            hoverTweenRef.current.kill();
            hoverTweenRef.current = null;
          }
          gsap.killTweensOf(jellyRef.current);
          gsap.killTweensOf(pos);
          gsap.killTweensOf(vel);
          gsap.killTweensOf("*"); // Kill ALL tweens globally

          if (jellyRef.current && jellyRef.current.parentNode) {
            const parent = jellyRef.current.parentNode;
            const oldElement = jellyRef.current;
            
            // FORCE BROWSER COMPOSITOR LAYER RESET
            oldElement.style.transform = 'translateZ(0) scale(1.0001)'; // Force layer
            oldElement.style.willChange = 'transform';
            
            // Force reflow to flush compositor
            oldElement.offsetHeight;
            
            // Remove with extreme prejudice
            parent.removeChild(oldElement);
            
            // Force garbage collection hint
            if (window.gc) window.gc();
          }

          // STEP 2: Create element with browser cache busting
          const timestamp = performance.now();
          const uniqueId = `cursor-${timestamp}-${Math.random().toString(36).substr(2, 12)}`;
          const elementTypes = ['div', 'span', 'section', 'article'];
          const elementType = elementTypes[Math.floor(Math.random() * elementTypes.length)];
          const freshElement = document.createElement(elementType);
          freshElement.id = uniqueId;
          
          // FORCE NEW COMPOSITOR LAYER with unique properties
          const uniqueZIndex = 100 + Math.floor(Math.random() * 10);
          const uniqueBorderWidth = 2 + (Math.random() * 0.1);
          
          freshElement.style.cssText = `
            position: fixed;
            left: ${x - CURSOR_DIAMETER/2}px;
            top: ${y - CURSOR_DIAMETER/2}px;
            width: ${CURSOR_DIAMETER}px;
            height: ${CURSOR_DIAMETER}px;
            border-radius: 25px;
            z-index: ${uniqueZIndex};
            pointer-events: none;
            border: ${uniqueBorderWidth}px solid white;
            backdrop-filter: invert(100%);
            margin: 0;
            padding: 0;
            transform: translateZ(0) scale(1);
            transition: none;
            animation: none;
            will-change: auto;
            contain: layout style paint;
            isolation: isolate;
          `;

          // STEP 3: Force browser to recognize new element
          if (jellyRef.current?.parentNode) {
            jellyRef.current.parentNode.appendChild(freshElement);
            
            // Force immediate layout calculation
            freshElement.offsetHeight;
            freshElement.getBoundingClientRect();
          }
          
          // Update ref
          Object.defineProperty(jellyRef, 'current', {
            value: freshElement,
            writable: true,
            configurable: true
          });

          // STEP 4: Reset ALL state with current mouse position
          pos.x = x;
          pos.y = y;
          vel.x = 0;
          vel.y = 0;

          if (!isHovering) {
            setIsHovering(true);
          }

          // STEP 5: Use fromTo with explicit starting position to override any cache
          hoverTweenRef.current = gsap.fromTo(freshElement, 
            {
              // Explicit starting state - current mouse position
              left: (x - CURSOR_DIAMETER/2) + 'px',
              top: (y - CURSOR_DIAMETER/2) + 'px',
              width: CURSOR_DIAMETER + 'px',
              height: CURSOR_DIAMETER + 'px',
              borderRadius: '25px',
            },
            {
              // Target state - button center
            width: hoverElement.offsetWidth + 20,
            height: hoverElement.offsetHeight + 20,
              left: (rect.left + rect.width / 2) - (hoverElement.offsetWidth + 20)/2 + 'px',
              top: (rect.top + rect.height / 2) - (hoverElement.offsetHeight + 20)/2 + 'px',
            borderRadius: 10,
              duration: 0.2,
            ease: "power2.out",
              overwrite: "auto",
              immediateRender: true,
              force3D: true,
            }
          );
        }
        } else {
        // ULTRA-AGGRESSIVE HOVER EXIT - recreate element multiple times
        if (hoverTargetRef.current) {
          hoverTargetRef.current = null;
        }
        
        // Clear stability tracking on hover exit
        lastHoverTargetRef.current = null;
        if (hoverStabilityTimeoutRef.current) {
          clearTimeout(hoverStabilityTimeoutRef.current);
          hoverStabilityTimeoutRef.current = null;
        }
        if (hoverTweenRef.current) {
          hoverTweenRef.current.kill();
          hoverTweenRef.current = null;
        }
        
        // BROWSER CACHE BUSTING ON EXIT - Force complete reset for next hover
        if (jellyRef.current && jellyRef.current.parentNode) {
          // Kill ALL tweens globally
          gsap.killTweensOf("*");
          gsap.killTweensOf(jellyRef.current);
          gsap.killTweensOf(pos);
          gsap.killTweensOf(vel);

          const parent = jellyRef.current.parentNode;
          const oldElement = jellyRef.current;
          
          // Force compositor layer flush
          oldElement.style.transform = 'translateZ(0) scale(0.9999)';
          oldElement.style.willChange = 'transform';
          oldElement.offsetHeight; // Force reflow
          
          parent.removeChild(oldElement);

          // Create exit element with browser cache busting
          const exitTimestamp = performance.now();
          const exitUniqueId = `exit-cursor-${exitTimestamp}-${Math.random().toString(36).substr(2, 15)}`;
          const exitElementTypes = ['div', 'span', 'section', 'article', 'aside'];
          const exitElementType = exitElementTypes[Math.floor(Math.random() * exitElementTypes.length)];
          const exitElement = document.createElement(exitElementType);
          exitElement.id = exitUniqueId;
          
          // Force new compositor layer with unique properties
          const exitZIndex = 95 + Math.floor(Math.random() * 15);
          const exitBorderWidth = 1.8 + (Math.random() * 0.4);
          
          exitElement.style.cssText = `
            position: fixed;
            left: ${x - CURSOR_DIAMETER/2}px;
            top: ${y - CURSOR_DIAMETER/2}px;
            width: ${CURSOR_DIAMETER}px;
            height: ${CURSOR_DIAMETER}px;
            border-radius: 25px;
            z-index: ${exitZIndex};
            pointer-events: none;
            border: ${exitBorderWidth}px solid white;
            backdrop-filter: invert(100%);
            margin: 0;
            padding: 0;
            transform: translateZ(0) scale(1);
            transition: none;
            animation: none;
            will-change: auto;
            contain: layout style paint;
            isolation: isolate;
          `;

          parent.appendChild(exitElement);
          
          // Force layout calculation
          exitElement.offsetHeight;
          exitElement.getBoundingClientRect();
          
          // Update ref
          Object.defineProperty(jellyRef, 'current', {
            value: exitElement,
            writable: true,
            configurable: true
          });

          // Reset state to current mouse position
        pos.x = x;
        pos.y = y;
        vel.x = 0;
        vel.y = 0;

          // Recreate setters for exit element
          set.x = gsap.quickSetter(exitElement, "x", "px");
          set.y = gsap.quickSetter(exitElement, "y", "px");
          set.r = gsap.quickSetter(exitElement, "rotate", "deg");
          set.sx = gsap.quickSetter(exitElement, "scaleX");
          set.sy = gsap.quickSetter(exitElement, "scaleY");
          set.width = gsap.quickSetter(exitElement, "width", "px");
        }
        
        if (isHovering) {
          setIsHovering(false);
        }
        
        // Normal cursor following with elastic animation using left/top
        gsap.to(pos, {
          x: x,
          y: y,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)",
          onUpdate: () => {
            // @ts-ignore
            vel.x = (x - pos.x) * 1.2;
            // @ts-ignore
            vel.y = (y - pos.y) * 1.2;
            
            // Update element position using left/top
            if (jellyRef.current) {
              jellyRef.current.style.left = pos.x - CURSOR_DIAMETER/2 + 'px';
              jellyRef.current.style.top = pos.y - CURSOR_DIAMETER/2 + 'px';
            }
          },
        });
      }

      loop();
    };

    window.addEventListener("mousemove", setFromEvent);
    return () => {
      window.removeEventListener("mousemove", setFromEvent);
    };
  }, [cursorMoved, isHovering, isMobile, loop, pos, vel, set]);

  useTicker(loop, !cursorMoved || isMobile);
  if (isMobile) return null;
  // Return UI
  return (
    <>
      <div
        ref={jellyRef}
        id={`initial-cursor-${Date.now()}`}
        style={{
          position: 'fixed',
          left: '0px',
          top: '0px',
          width: `${CURSOR_DIAMETER}px`,
          height: `${CURSOR_DIAMETER}px`,
          borderRadius: '25px',
          zIndex: 100,
          pointerEvents: 'none',
          border: '2px solid white',
          backdropFilter: 'invert(100%)',
          margin: 0,
          padding: 0,
          transform: 'none',
          transition: 'none',
          animation: 'none',
          willChange: 'auto',
        }}
      ></div>
      <div
        style={{
          position: 'fixed',
          top: y - 6,
          left: x - 6,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          pointerEvents: 'none',
          backdropFilter: 'invert(100%)',
          transform: 'none',
          transition: 'none',
        }}
      ></div>
    </>
  );
}

export default ElasticCursor;
