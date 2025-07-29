import React from 'react';

export default function GradientDesign({children}: React.PropsWithChildren<{}>) {
  return (
    <div 
      className="w-full h-screen relative overflow-hidden"
    >
      {children}
      {/* Main gradient background */}
      <div 
        className="absolute inset-0  z-10"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, #f2c063 0%, transparent 50%),
            radial-gradient(ellipse at 80% 30%, #5a736c 0%, transparent 50%),
            radial-gradient(ellipse at 40% 80%, #5a736c 0%, transparent 40%),
            linear-gradient(135deg, #0b1e1a 0%, #5a736c 50%, #0b1e1a 100%)
          `
        }}
      />
      
      {/* Overlay gradients for depth */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: `
            radial-gradient(circle at 15% 40%, rgba(242, 192, 99, 0.6) 0%, transparent 30%),
            radial-gradient(circle at 85% 60%, rgba(90, 115, 108, 0.4) 0%, transparent 40%),
            radial-gradient(circle at 50% 20%, rgba(242, 192, 99, 0.3) 0%, transparent 35%)
          `,
          filter: 'blur(80px)'
        }}
      />
      
      {/* Additional soft light effects */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: `
            radial-gradient(ellipse at 30% 70%, rgba(242, 192, 99, 0.8) 0%, transparent 25%),
            radial-gradient(ellipse at 70% 40%, rgba(90, 115, 108, 0.6) 0%, transparent 30%)
          `,
          filter: 'blur(120px)',
          mixBlendMode: 'soft-light'
        }}
      />
      
      {/* Fine detail layer */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: `
            radial-gradient(circle at 25% 60%, rgba(242, 192, 99, 0.4) 0%, transparent 20%),
            radial-gradient(circle at 75% 25%, rgba(90, 115, 108, 0.3) 0%, transparent 25%),
            radial-gradient(circle at 60% 80%, rgba(11, 30, 26, 0.8) 0%, transparent 30%)
          `,
          filter: 'blur(60px)'
        }}
      />
      
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: `
            linear-gradient(45deg, transparent 48%, rgba(242, 192, 99, 0.1) 50%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(90, 115, 108, 0.1) 50%, transparent 52%)
          `,
          backgroundSize: '100px 100px',
          opacity: 0.3
        }}
      />
      
      {/* Grainy film overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0),
            radial-gradient(circle at 2px 3px, rgba(0,0,0,0.1) 1px, transparent 0),
            radial-gradient(circle at 3px 1px, rgba(255,255,255,0.1) 1px, transparent 0),
            radial-gradient(circle at 1px 4px, rgba(0,0,0,0.08) 1px, transparent 0),
            radial-gradient(circle at 4px 2px, rgba(255,255,255,0.12) 1px, transparent 0),
            radial-gradient(circle at 2px 1px, rgba(0,0,0,0.06) 1px, transparent 0)
          `,
          backgroundSize: '5px 5px, 7px 7px, 6px 6px, 8px 8px, 9px 9px, 4px 4px',
          backgroundPosition: '0 0, 1px 2px, 3px 1px, 2px 4px, 1px 1px, 4px 3px',
          opacity: 0.4,
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Additional fine grain layer */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(255,255,255,0.03) 1px,
              rgba(255,255,255,0.03) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 1px,
              rgba(0,0,0,0.02) 1px,
              rgba(0,0,0,0.02) 2px
            )
          `,
          opacity: 0.6
        }}
      />
    </div>
  );
}