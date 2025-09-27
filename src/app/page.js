"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Menu, 
  X, 
  Info, 
  Navigation,
  Maximize2,
  Minimize2,
  Search,
  MapPin,
  Globe,
  Settings,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import MapSvg from "@/components/MapSvg";

export default function Home() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [controlsExpanded, setControlsExpanded] = useState(false);
  
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  // Check if screen is mobile/tablet
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-fit map on mobile
      if (mobile && scale === 1) {
        const containerWidth = window.innerWidth - 32; // Account for padding
        const mapWidth = 1875.5; // SVG viewBox width
        const optimalScale = Math.min((containerWidth / mapWidth) * 1.2, 1);
        setScale(optimalScale);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [scale]);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev * 1.3, isMobile ? 3 : 4));
  }, [isMobile]);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev / 1.3, 0.2));
  }, []);

  const handleReset = useCallback(() => {
    if (isMobile) {
      // Smart reset for mobile - fit to screen
      const containerWidth = window.innerWidth - 32;
      const mapWidth = 1875.5;
      const optimalScale = Math.min((containerWidth / mapWidth) * 1.2, 1);
      setScale(optimalScale);
    } else {
      setScale(1);
    }
    setPosition({ x: 0, y: 0 });
  },[isMobile]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen && isMobile) {
      // On mobile fullscreen, optimize scale
      setTimeout(() => {
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        const mapWidth = 1875.5;
        const mapHeight = 860.859;
        
        const scaleX = containerWidth / mapWidth;
        const scaleY = containerHeight / mapHeight;
        const optimalScale = Math.min(scaleX, scaleY) * 0.9;
        
        setScale(optimalScale);
        setPosition({ x: 0, y: 0 });
      }, 100);
    }
  }, [isFullscreen, isMobile]);

  const handleWheel = useCallback(
    (e) => {
      if (isMobile) return; // Disable wheel zoom on mobile
      
      e.preventDefault();
      const rect = mapRef.current?.getBoundingClientRect();
      if (!rect) return;

      const zoomIntensity = 0.1;
      const wheel = e.deltaY < 0 ? 1 : -1;
      const zoom = Math.exp(wheel * zoomIntensity);
      
      const maxScale = isMobile ? 3 : 4;
      const newScale = Math.min(Math.max(scale * zoom, 0.2), maxScale);
      
      // Calculate zoom center point
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const scaleChange = newScale / scale;
      const newX = position.x - (mouseX - position.x) * (scaleChange - 1);
      const newY = position.y - (mouseY - position.y) * (scaleChange - 1);
      
      setScale(newScale);
      setPosition({ x: newX, y: newY });
    },
    [scale, position, isMobile]
  );

  const handleMouseDown = (e) => {
    if (e.target.closest('g[class*="province"]')) return;
    
    isDragging.current = true;
    startPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    if (mapRef.current) {
      mapRef.current.style.cursor = "grabbing";
    }
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      isDragging.current = true;
      startPos.current = {
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      };
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - startPos.current.x,
      y: touch.clientY - startPos.current.y,
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (mapRef.current) {
      mapRef.current.style.cursor = "grab";
    }
  };

  // Keyboard navigation (desktop only)
  useEffect(() => {
    if (isMobile) return;
    
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleReset();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          setShowInfo(false);
          setControlsExpanded(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleReset, handleZoomIn, handleZoomOut, isMobile, toggleFullscreen]);

  useEffect(() => {
    const mapElement = mapRef.current;
    if (mapElement && !isMobile) {
      mapElement.addEventListener("wheel", handleWheel, { passive: false });
      return () => mapElement.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel, isMobile]);

  const zoomLevel = Math.round(scale * 100);

  // Mobile Controls Component
  const MobileControls = () => (
    <div className="fixed bottom-4 right-4 z-30">
      <motion.div
        initial={false}
        animate={{ height: controlsExpanded ? "auto" : "56px" }}
        className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border overflow-hidden"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setControlsExpanded(!controlsExpanded)}
          className="w-full h-14 px-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-gold rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-medium text-gray-900">Kontrol</span>
          </div>
          {controlsExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>

        {/* Expanded Controls */}
        <AnimatePresence>
          {controlsExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 pt-0 space-y-3"
            >
              {/* Zoom Controls */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={scale <= 0.2}
                  variant="outline"
                  className="h-12 flex flex-col gap-1 text-xs"
                >
                  <ZoomOut className="w-4 h-4" />
                  <span>Kecil</span>
                </Button>
                <Button
                  size="sm"
                  onClick={handleReset}
                  variant="outline"
                  className="h-12 flex flex-col gap-1 text-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </Button>
                <Button
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={scale >= 3}
                  className="h-12 bg-primary-gold hover:bg-primary-gold/90 text-black flex flex-col gap-1 text-xs"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span>Besar</span>
                </Button>
              </div>

              {/* Fullscreen */}
              <Button
                onClick={toggleFullscreen}
                variant="outline"
                className="w-full h-12 justify-start gap-3"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span>{isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}</span>
              </Button>

              {/* Zoom Level */}
              <div className="text-center">
                <Badge variant="secondary" className="px-3 py-1">
                  Zoom: {zoomLevel}%
                </Badge>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );

  // Desktop Controls Component
  const DesktopControls = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="absolute top-6 right-6 z-20"
    >
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-lg">
        <CardContent className="p-3">
          <div className="flex flex-col gap-2">
            {/* Zoom Controls */}
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={handleZoomIn}
                disabled={scale >= 4}
                className="bg-primary-gold hover:bg-primary-gold/90 text-black w-10 h-10 p-0"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleZoomOut}
                disabled={scale <= 0.2}
                className="bg-primary-gold hover:bg-primary-gold/90 text-black w-10 h-10 p-0"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Reset & Fullscreen */}
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={handleReset}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 w-10 h-10 p-0"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={toggleFullscreen}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 w-10 h-10 p-0"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>

            {/* Zoom Level */}
            <div className="px-2 py-1">
              <Badge variant="secondary" className="text-xs w-full justify-center">
                {zoomLevel}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <TooltipProvider>
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        
        {/* Header - Hidden on mobile fullscreen */}
        {!(isMobile && isFullscreen) && (
          <motion.header 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-14 md:h-16">
                {/* Logo */}
                <motion.div 
                  className="flex items-center gap-2 md:gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-gold rounded-xl flex items-center justify-center">
                    <MapPin className="w-4 h-4 md:w-6 md:h-6 text-black" />
                  </div>
                  <div>
                    <h1 className="text-lg md:text-xl font-bold text-gray-900">Peta Indonesia</h1>
                    <p className="text-xs text-gray-500 hidden sm:block">Jelajahi Nusantara</p>
                  </div>
                </motion.div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary-gold">
                    <Globe className="w-4 h-4 mr-2" />
                    Provinsi
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary-gold">
                    <Search className="w-4 h-4 mr-2" />
                    Cari
                  </Button>
                </nav>

                {/* Mobile/Tablet Menu */}
                <div className="lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Menu className="w-5 h-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-3">
                        <Button variant="ghost" className="w-full justify-start">
                          <Globe className="w-4 h-4 mr-3" />
                          Provinsi
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <Search className="w-4 h-4 mr-3" />
                          Cari
                        </Button>
                        <div className="pt-4 border-t">
                          <h3 className="text-sm font-medium mb-3 text-gray-900">Bantuan</h3>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div>• Seret untuk menggeser peta</div>
                            <div>• {isMobile ? 'Pinch untuk zoom' : 'Scroll untuk zoom'}</div>
                            <div>• Klik provinsi untuk detail</div>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </motion.header>
        )}

        {/* Main Content */}
        <main 
          ref={containerRef}
          className={`relative transition-all duration-500 ${
            isFullscreen 
              ? 'h-screen' 
              : isMobile 
                ? 'h-[calc(100vh-3.5rem)]' 
                : 'h-[calc(100vh-4rem)]'
          }`}
        >
          {/* Controls */}
          {isMobile ? <MobileControls /> : <DesktopControls />}

          {/* Status Bar - Desktop only */}
          {!isMobile && !isFullscreen && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute bottom-6 left-6 z-20"
            >
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-lg">
                <CardContent className="p-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4" />
                      <span>Zoom: {zoomLevel}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            ref={mapRef}
            className="h-full w-full bg-gradient-to-br from-blue-50/30 to-slate-50/30 cursor-grab active:cursor-grabbing overflow-hidden relative touch-pan-x touch-pan-y"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            role="img"
            aria-label="Interactive map of Indonesia provinces"
            tabIndex={0}
          >
            {/* Grid Pattern Overlay - Hidden on mobile for performance */}
            {!isMobile && (
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{
                  backgroundImage: `
                    radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)
                  `,
                  backgroundSize: '20px 20px'
                }} />
              </div>
            )}

            <motion.div
              className="w-full h-full transition-transform duration-200 ease-out will-change-transform"
              style={{
                transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
                transformOrigin: "center center",
              }}
              animate={{ scale, x: position.x, y: position.y }}
              transition={{ type: "tween", duration: 0.2 }}
            >
              <MapSvg />
            </motion.div>

            {/* Loading Overlay */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center pointer-events-none"
            >
              <div className="text-center px-4">
                <div className="w-8 h-8 border-4 border-primary-gold border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
                <p className="text-sm text-gray-600">Memuat peta Indonesia...</p>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </TooltipProvider>
  );
}