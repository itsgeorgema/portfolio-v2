import React, { useRef, useEffect } from 'react';

export default function SpotifyTrackCard() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const container = containerRef.current;
    if (!overlay || !container) return;

    const iframe = container.querySelector('iframe');

    // Create mouse events that the cursor tracker can detect
    const handleMouseMove = (e: MouseEvent | PointerEvent) => {
      // Create a new mousemove event that bubbles to the document/window
      const newEvent = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: e.clientX,
        clientY: e.clientY,
        movementX: e.movementX,
        movementY: e.movementY,
        view: window
      });

      // Dispatch to both window and document for maximum compatibility
      document.dispatchEvent(newEvent);
      window.dispatchEvent(newEvent);
    };

    const handleMouseEnter = (e: MouseEvent | PointerEvent) => {
      // Temporarily disable iframe pointer events to let cursor pass through
      if (iframe) {
        iframe.style.pointerEvents = 'none';
      }
      
      const newEvent = new MouseEvent('mouseenter', {
        bubbles: true,
        cancelable: true,
        clientX: e.clientX,
        clientY: e.clientY,
        view: window
      });
      document.dispatchEvent(newEvent);
      window.dispatchEvent(newEvent);
    };

    const handleMouseLeave = (e: MouseEvent | PointerEvent) => {
      // Re-enable iframe pointer events when leaving
      if (iframe) {
        iframe.style.pointerEvents = 'auto';
      }
      
      const newEvent = new MouseEvent('mouseleave', {
        bubbles: true,
        cancelable: true,
        clientX: e.clientX,
        clientY: e.clientY,
        view: window
      });
      document.dispatchEvent(newEvent);
      window.dispatchEvent(newEvent);
    };

    // Add event listeners
    overlay.addEventListener('mousemove', handleMouseMove as EventListener, { passive: true });
    overlay.addEventListener('mouseenter', handleMouseEnter as EventListener, { passive: true });
    overlay.addEventListener('mouseleave', handleMouseLeave as EventListener, { passive: true });
    // Pointer events to support pointer capture during drag
    overlay.addEventListener('pointermove', handleMouseMove as EventListener, { passive: true });
    overlay.addEventListener('pointerenter', handleMouseEnter as EventListener, { passive: true });
    overlay.addEventListener('pointerleave', handleMouseLeave as EventListener, { passive: true });

    return () => {
      overlay.removeEventListener('mousemove', handleMouseMove as EventListener);
      overlay.removeEventListener('mouseenter', handleMouseEnter as EventListener);
      overlay.removeEventListener('mouseleave', handleMouseLeave as EventListener);
      overlay.removeEventListener('pointermove', handleMouseMove as EventListener);
      overlay.removeEventListener('pointerenter', handleMouseEnter as EventListener);
      overlay.removeEventListener('pointerleave', handleMouseLeave as EventListener);
      
      // Restore iframe pointer events on cleanup
      if (iframe) {
        iframe.style.pointerEvents = 'auto';
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="rounded-xl overflow-hidden relative"
      style={{
        zIndex: 1,
      }}
    >
      <iframe 
        data-testid="embed-iframe" 
        style={{
          borderRadius: '12px',
          width: '100%',
          height: '200px',
          border: 'none',
          display: 'block'
        }} 
        src="https://open.spotify.com/embed/track/7lXOqE38eCr979gp27O5wr?utm_source=generator&theme=0" 
        frameBorder="0" 
        allowFullScreen 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"
        onPointerDown={(e) => {
          // Start pointer capture to continue receiving move events during drag
          const target = e.currentTarget as HTMLDivElement;
          if ((target as any).setPointerCapture) {
            try {
              (target as any).setPointerCapture(e.pointerId);
            } catch {}
          }
          const container = containerRef.current;
          const iframe = container?.querySelector('iframe') as HTMLIFrameElement | null;
          // Allow iframe to receive interactions while dragging
          if (iframe) iframe.style.pointerEvents = 'auto';
        }}
        onPointerUp={(e) => {
          const target = e.currentTarget as HTMLDivElement;
          if ((target as any).releasePointerCapture) {
            try {
              (target as any).releasePointerCapture(e.pointerId);
            } catch {}
          }
          const container = containerRef.current;
          const iframe = container?.querySelector('iframe') as HTMLIFrameElement | null;
          // Restore to cursor-friendly state after drag
          if (iframe) iframe.style.pointerEvents = 'none';
        }}
      />
      
      {/* Transparent overlay for cursor tracking */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          background: 'transparent',
          pointerEvents: 'auto',
          // Ensure this doesn't interfere with cursor visibility
          isolation: 'isolate'
        }}
        onPointerDown={(e) => {
          const overlay = e.currentTarget as HTMLDivElement;
          const container = containerRef.current;
          const iframe = container?.querySelector('iframe') as HTMLIFrameElement | null;
          // Allow real interaction inside the iframe while pointer is down
          overlay.style.pointerEvents = 'none';
          if (iframe) iframe.style.pointerEvents = 'auto';
        }}
        onPointerUp={(e) => {
          const overlay = e.currentTarget as HTMLDivElement;
          const container = containerRef.current;
          const iframe = container?.querySelector('iframe') as HTMLIFrameElement | null;
          // Restore overlay for cursor tracking
          overlay.style.pointerEvents = 'auto';
          if (iframe) iframe.style.pointerEvents = 'none';
        }}
        onClick={(e) => {
          // Click-through functionality
          const overlay = e.currentTarget;
          const container = containerRef.current;
          const iframe = container?.querySelector('iframe');
          
          // Temporarily disable overlay and enable iframe for click
          overlay.style.pointerEvents = 'none';
          if (iframe) {
            iframe.style.pointerEvents = 'auto';
          }
          
          const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
          if (elementBelow) {
            elementBelow.dispatchEvent(new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              clientX: e.clientX,
              clientY: e.clientY
            }));
          }
          
          // Restore normal state
          setTimeout(() => {
            overlay.style.pointerEvents = 'auto';
            if (iframe) {
              iframe.style.pointerEvents = 'none'; // Keep disabled for cursor
            }
          }, 150);
        }}
      />
    </div>
  );
}

