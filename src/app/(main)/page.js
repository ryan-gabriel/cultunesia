"use client";

import Navbar from "@/components/Navbar/Navbar";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
  Maximize2,
  Minimize2,
  Settings,
  ChevronUp,
  ChevronDown,
  List, // Used for the new link
} from "lucide-react";
import Link from "next/link"; // Import Link for navigation
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
// Removed Sheet imports as they are no longer strictly needed for the link
import MapSvg from "@/components/MapSvg";

// --- 🗺️ MAP CONSTANTS ---
const MAP_WIDTH = 1875.5;
const MAP_HEIGHT = 1000;
const MIN_SCALE_ZOOM = 0.6;
const MAX_SCALE_ZOOM = 10;
const ZOOM_FACTOR = 1.3;

export default function Home() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [controlsExpanded, setControlsExpanded] = useState(false);

  // Refs for DOM elements and interaction state
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startMousePos = useRef({ x: 0, y: 0 });
  const startMapPos = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef(0);
  const animationFrameId = useRef(null);

  // Use a ref for container dimensions to access them inside callbacks
  const containerDims = useRef({ width: 0, height: 0 });

  // --- CORE ALGORITHM: FIT-TO-CONTAINER & CLAMPING ---

  const calculateFitParams = useCallback((containerWidth, containerHeight) => {
    const scaleX = containerWidth / MAP_WIDTH;
    const scaleY = containerHeight / MAP_HEIGHT;
    const fitScale = Math.min(scaleX, scaleY);

    const scaledMapWidth = MAP_WIDTH * fitScale;
    const scaledMapHeight = MAP_HEIGHT * fitScale;

    const offsetX = (containerWidth - scaledMapWidth) / 2;
    const offsetY = (containerHeight - scaledMapHeight) / 2;

    return {
      scale: fitScale,
      position: { x: offsetX, y: offsetY },
    };
  }, []);

  const clampPosition = useCallback(
    (currentPosition, currentScale, containerWidth, containerHeight) => {
      const scaledMapWidth = MAP_WIDTH * currentScale;
      const scaledMapHeight = MAP_HEIGHT * currentScale;

      // Limits
      const maxPosX = Math.max(0, (containerWidth - scaledMapWidth) / 2);
      const minPosX = Math.min(0, containerWidth - scaledMapWidth);
      const maxPosY = Math.max(0, (containerHeight - scaledMapHeight) / 2);
      const minPosY = Math.min(0, containerHeight - scaledMapHeight);

      // Clamping
      const clampedX = Math.max(minPosX, Math.min(maxPosX, currentPosition.x));
      const clampedY = Math.max(minPosY, Math.min(maxPosY, currentPosition.y));

      return { x: clampedX, y: clampedY };
    },
    []
  );

  // 🛠️ Check screen size and set initial map position/scale
  useEffect(() => {
    const setInitialState = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        containerDims.current = {
          width: containerWidth,
          height: containerHeight,
        };

        const { scale: initialScale, position: initialPosition } =
          calculateFitParams(containerWidth, containerHeight);

        setScale(initialScale);
        setPosition(initialPosition);
      }
    };

    const timeoutId = setTimeout(setInitialState, 100);

    window.addEventListener("resize", setInitialState);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", setInitialState);
    };
  }, [calculateFitParams]);

  // --- Panning and Zooming Handlers ---

  const smoothSetPosition = useCallback(
    (newPosition) => {
      const { width, height } = containerDims.current;
      const clampedPosition = clampPosition(newPosition, scale, width, height);

      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      setPosition(clampedPosition);
    },
    [scale, clampPosition]
  );

  const smoothSetScale = useCallback(
    (newScale) => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);

      const clampedScale = Math.max(
        MIN_SCALE_ZOOM,
        Math.min(newScale, MAX_SCALE_ZOOM)
      );

      setScale(clampedScale);

      const { width, height } = containerDims.current;
      setPosition((prevPos) =>
        clampPosition(prevPos, clampedScale, width, height)
      );
    },
    [clampPosition]
  );

  const handleZoom = useCallback(
    (zoom, center) => {
      const newScale = Math.min(
        Math.max(scale * zoom, MIN_SCALE_ZOOM),
        MAX_SCALE_ZOOM
      );

      const rect = mapRef.current?.getBoundingClientRect();
      if (!rect) return;

      const zoomPointX = center ? center.x - rect.left : rect.width / 2;
      const zoomPointY = center ? center.y - rect.top : rect.height / 2;

      const scaleChange = newScale / scale;
      const newX = position.x - (zoomPointX - position.x) * (scaleChange - 1);
      const newY = position.y - (zoomPointY - position.y) * (scaleChange - 1);

      smoothSetScale(newScale);
      smoothSetPosition({ x: newX, y: newY });
    },
    [scale, position, smoothSetScale, smoothSetPosition]
  );

  const handleZoomIn = useCallback(() => {
    handleZoom(ZOOM_FACTOR);
  }, [handleZoom]);

  const handleZoomOut = useCallback(() => {
    handleZoom(1 / ZOOM_FACTOR);
  }, [handleZoom]);

  const handleReset = useCallback(() => {
    const { width, height } = containerDims.current;
    const { scale: resetScale, position: resetPosition } = calculateFitParams(
      width,
      height
    );

    smoothSetScale(resetScale);
    smoothSetPosition(resetPosition);
  }, [calculateFitParams, smoothSetScale, smoothSetPosition]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Recalculate layout on fullscreen change
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        containerDims.current = {
          width: containerWidth,
          height: containerHeight,
        };
        const { scale: newScale, position: newPosition } = calculateFitParams(
          containerWidth,
          containerHeight
        );
        setScale(newScale);
        setPosition(newPosition);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [calculateFitParams]);

  // --- Mouse & Touch Interaction (Same as before) ---

  const handleMouseDown = (e) => {
    if (e.target.closest('g[class*="province"]')) return;

    isDragging.current = true;
    startMousePos.current = { x: e.clientX, y: e.clientY };
    startMapPos.current = position;
    if (mapRef.current) {
      mapRef.current.style.cursor = "grabbing";
    }
    e.preventDefault();
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging.current) return;
      e.preventDefault();

      const dx = e.clientX - startMousePos.current.x;
      const dy = e.clientY - startMousePos.current.y;

      const newPosition = {
        x: startMapPos.current.x + dx,
        y: startMapPos.current.y + dy,
      };

      smoothSetPosition(newPosition);
    },
    [smoothSetPosition]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    if (mapRef.current) {
      mapRef.current.style.cursor = "grab";
    }
    smoothSetPosition(position); // Clamp one last time
  }, [position, smoothSetPosition]);

  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      isDragging.current = true;
      startMousePos.current = { x: touch.clientX, y: touch.clientY };
      startMapPos.current = position;
    } else if (e.touches.length === 2) {
      isDragging.current = false;
      lastTouchDistance.current = getTouchDistance(e.touches);
    }
  };

  const handleTouchMove = useCallback(
    (e) => {
      e.preventDefault();

      if (e.touches.length === 1 && isDragging.current) {
        const touch = e.touches[0];
        const dx = touch.clientX - startMousePos.current.x;
        const dy = touch.clientY - startMousePos.current.y;

        const newPosition = {
          x: startMapPos.current.x + dx,
          y: startMapPos.current.y + dy,
        };

        smoothSetPosition(newPosition);
      } else if (e.touches.length === 2) {
        const currentDistance = getTouchDistance(e.touches);

        if (Math.abs(currentDistance - lastTouchDistance.current) > 5) {
          const zoomFactor = currentDistance / lastTouchDistance.current;

          const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

          handleZoom(zoomFactor, { x: centerX, y: centerY });

          lastTouchDistance.current = currentDistance;
        }
      }
    },
    [handleZoom, smoothSetPosition]
  );

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();

      const rect = mapRef.current?.getBoundingClientRect();
      if (!rect) return;

      const wheel = e.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;

      const center = { x: e.clientX, y: e.clientY };

      handleZoom(wheel, center);
    },
    [handleZoom]
  );

  // Keyboard navigation and Wheel listener (Same as before)
  useEffect(() => {
    // ... (keyboard logic)
    if (isMobile) return;

    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT") return;

      switch (e.key) {
        case "+":
        case "=":
          e.preventDefault();
          handleZoomIn();
          break;
        case "-":
          e.preventDefault();
          handleZoomOut();
          break;
        case "r":
        case "R":
          e.preventDefault();
          handleReset();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          setControlsExpanded(false);
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleReset, handleZoomIn, handleZoomOut, isMobile, toggleFullscreen]);

  useEffect(() => {
    const mapElement = mapRef.current;
    if (mapElement && !isMobile) {
      mapElement.addEventListener("wheel", handleWheel, { passive: false });
      return () => mapElement.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel, isMobile]);

  const zoomLevel = Math.round(scale * 100);

  // --- NEW COMPONENT: MobileProvinceLink (Top-left button) ---
  const MobileProvinceLink = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="absolute top-4 left-4 z-30" // Positioned at top-left
    >
      <Link href="/provinces" passHref>
        <Button
          size="lg"
          className="h-12 px-5 font-semibold rounded-xl shadow-lg backdrop-blur-md 
               bg-primary-gold text-white 
               hover:brightness-90 
               dark:bg-primary-gold
               dark:hover:brightness-110"
        >
          <List className="w-5 h-5 mr-2" />
          <span>Daftar Provinsi</span>
        </Button>
      </Link>
    </motion.div>
  );

  // --- Components (MobileControls and DesktopControls remain as is) ---

  const MobileControls = () => (
    <div className="fixed bottom-4 right-4 z-30">
      <motion.div
        initial={false}
        animate={{ height: controlsExpanded ? "auto" : "56px" }}
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-xl border-2 dark:border-gray-600 border-gray-500 overflow-hidden"
      >
        <button
          onClick={() => setControlsExpanded(!controlsExpanded)}
          className="w-full h-14 px-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-gold dark:bg-yellow-500 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Kontrol
            </span>
          </div>
          {controlsExpanded ? (
            <ChevronDown className="w-5 h-5 dark:text-white" />
          ) : (
            <ChevronUp className="w-5 h-5 dark:text-white" />
          )}
        </button>
        <AnimatePresence>
          {controlsExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 pt-0 space-y-3"
            >
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={scale <= MIN_SCALE_ZOOM}
                  variant="outline"
                  className="h-12 flex flex-col gap-1 text-xs dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  <ZoomOut className="w-4 h-4" />
                  <span>Kecil</span>
                </Button>
                <Button
                  size="sm"
                  onClick={handleReset}
                  variant="outline"
                  className="h-12 flex flex-col gap-1 text-xs dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </Button>
                <Button
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={scale >= MAX_SCALE_ZOOM}
                  className="h-12 bg-primary-gold hover:bg-primary-gold/90 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-black flex flex-col gap-1 text-xs"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span>Besar</span>
                </Button>
              </div>
              <Button
                onClick={toggleFullscreen}
                variant="outline"
                className="w-full h-12 justify-start gap-3 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
                <span>
                  {isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
                </span>
              </Button>
              <div className="text-center">
                <Badge
                  variant="secondary"
                  className="px-3 py-1 dark:bg-gray-700 dark:text-white"
                >
                  Zoom: {zoomLevel}%
                </Badge>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );

  const DesktopControls = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="absolute top-6 right-6 z-20"
    >
      <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg dark:border-gray-700">
        <CardContent className="p-3">
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={handleZoomIn}
                disabled={scale >= MAX_SCALE_ZOOM}
                className="bg-primary-gold hover:bg-primary-gold/90 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-black w-10 h-10 p-0"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleZoomOut}
                disabled={scale <= MIN_SCALE_ZOOM}
                className="bg-primary-gold hover:bg-primary-gold/90 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-black w-10 h-10 p-0"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={handleReset}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white w-10 h-10 p-0"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={toggleFullscreen}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white w-10 h-10 p-0"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="px-2 py-1">
              <Badge
                variant="secondary"
                className="text-xs w-full justify-center dark:bg-gray-700 dark:text-white"
              >
                {zoomLevel}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <>
      <Navbar />
      <TooltipProvider>
        <div
          className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500 ${
            isFullscreen ? "fixed inset-0 z-50 bg-white dark:bg-gray-900" : ""
          }`}
        >
          <main
            ref={containerRef}
            className="relative h-screen transition-all duration-500"
          >
            {/* Conditional Mobile Components */}
            {isMobile && !isFullscreen ? (
              <>
                {/* NEW LINK: Appears on mobile, outside of fullscreen */}
                <MobileProvinceLink />
                <MobileControls />
              </>
            ) : (
              <DesktopControls />
            )}

            {/* Desktop Zoom/Info Display */}
            {!isMobile && !isFullscreen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute bottom-6 left-6 z-20"
              >
                <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg dark:border-gray-700">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
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
              className="h-full w-full bg-gradient-to-br from-blue-50/30 to-slate-50/30 dark:from-gray-900/30 dark:to-gray-800/30 cursor-grab active:cursor-grabbing overflow-hidden relative touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              role="img"
              aria-label="Peta interaktif provinsi Indonesia"
              tabIndex={0}
              style={{ touchAction: "none" }}
            >
              {/* Grid Background */}
              {!isMobile && (
                <div className="absolute inset-0 opacity-5 dark:opacity-10">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
                      backgroundSize: "20px 20px",
                    }}
                  />
                </div>
              )}

              {/* Transformable Map SVG */}
              <motion.div
                className="w-[1875.5px] h-[1000px] bg-red-500/0 absolute top-0 left-0"
                style={{
                  transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
                  transformOrigin: "top left",
                  willChange: "transform",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.5,
                }}
              >
                <MapSvg />
              </motion.div>

              {/* Initial Loading Overlay */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center pointer-events-none"
              >
                <div className="text-center px-4">
                  <div className="w-8 h-8 border-4 border-primary-gold dark:border-yellow-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Memuat peta Indonesia...
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </TooltipProvider>
    </>
  );
}
