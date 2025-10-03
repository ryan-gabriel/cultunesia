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
  List, // Import List icon for the new link
} from "lucide-react";
import Link from "next/link"; // Import Link for navigation
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const lastTouchDistance = useRef(0);
  const animationFrameId = useRef(null);

  const mapWidth = 1875.5;
  const mapHeight = 1000;

  // Prevent pull-to-refresh on mobile
  useEffect(() => {
    const preventPullToRefresh = (e) => {
      if (e.touches.length === 1 && mapRef.current?.contains(e.target)) {
        e.preventDefault();
      }
    };
    const preventOverscroll = (e) => {
      if (mapRef.current?.contains(e.target)) {
        e.preventDefault();
      }
    };
    document.addEventListener("touchstart", preventPullToRefresh, {
      passive: false,
    });
    document.addEventListener("touchmove", preventOverscroll, {
      passive: false,
    });
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.removeEventListener("touchstart", preventPullToRefresh);
      document.removeEventListener("touchmove", preventOverscroll);
      document.body.style.overscrollBehavior = "auto";
    };
  }, []);

  // 🛠️ Check screen size and set initial map position/scale
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        // --- 🎯 CHANGE 1: Set initial scale to 1 (100%) on mobile ---
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;

        const targetScale = 1; // Always start at 100% zoom (1)
        setScale(targetScale);

        const scaledMapWidth = mapWidth * targetScale;
        const scaledMapHeight = mapHeight * targetScale;

        // Center the map, which will likely push the edges off-screen
        const offsetX = (containerWidth - scaledMapWidth) / 2;
        const offsetY = (containerHeight - scaledMapHeight) / 2;

        setPosition({ x: offsetX, y: offsetY });
      } else {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const smoothSetScale = useCallback((newScale) => {
    if (animationFrameId.current)
      cancelAnimationFrame(animationFrameId.current);
    setScale(newScale);
  }, []);

  const smoothSetPosition = useCallback((newPosition) => {
    if (animationFrameId.current)
      cancelAnimationFrame(animationFrameId.current);
    setPosition(newPosition);
  }, []);

  const handleZoomIn = useCallback(() => {
    smoothSetScale((prev) => Math.min(prev * 1.3, 10));
  }, [smoothSetScale]);

  const handleZoomOut = useCallback(() => {
    // Keep minimum scale for mobile at a reasonable value, even if initial is 1
    const minScale = isMobile ? 0.2 : 0.5;
    smoothSetScale((prev) => Math.max(prev / 1.3, minScale));
  }, [isMobile, smoothSetScale]);

  // 🛠️ Reset ulang sesuai mode (Adjusted for new mobile scale logic)
  const handleReset = useCallback(() => {
    if (isMobile) {
      // --- 🎯 CHANGE 2: Set reset scale to 1 (100%) on mobile ---
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      
      const targetScale = 1; // Reset to 100% zoom
      smoothSetScale(targetScale);

      const scaledMapWidth = mapWidth * targetScale;
      const scaledMapHeight = mapHeight * targetScale;
      
      // Center position
      const offsetX = (containerWidth - scaledMapWidth) / 2;
      const offsetY = (containerHeight - scaledMapHeight) / 2;

      smoothSetPosition({ x: offsetX, y: offsetY });
    } else {
      smoothSetScale(1);
      smoothSetPosition({ x: 0, y: 0 });
    }
  }, [isMobile, smoothSetScale, smoothSetPosition]);

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
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleWheel = useCallback(
    (e) => {
      if (isMobile) return;

      e.preventDefault();
      const rect = mapRef.current?.getBoundingClientRect();
      if (!rect) return;

      const zoomIntensity = 0.1;
      const wheel = e.deltaY < 0 ? 1 : -1;
      const zoom = Math.exp(wheel * zoomIntensity);

      const newScale = Math.min(Math.max(scale * zoom, 0.5), 10);

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const scaleChange = newScale / scale;
      const newX = position.x - (mouseX - position.x) * (scaleChange - 1);
      const newY = position.y - (mouseY - position.y) * (scaleChange - 1);

      smoothSetScale(newScale);
      smoothSetPosition({ x: newX, y: newY });
    },
    [scale, position, isMobile, smoothSetScale, smoothSetPosition]
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

  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      isDragging.current = true;
      startPos.current = {
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      };
    } else if (e.touches.length === 2) {
      // Pinch zoom start
      isDragging.current = false;
      lastTouchDistance.current = getTouchDistance(e.touches);
    }
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging.current) return;
      e.preventDefault();

      smoothSetPosition({
        x: e.clientX - startPos.current.x,
        y: e.clientY - startPos.current.y,
      });
    },
    [smoothSetPosition]
  );

  const handleTouchMove = useCallback(
    (e) => {
      e.preventDefault(); // Prevent pull-to-refresh

      if (e.touches.length === 1 && isDragging.current) {
        const touch = e.touches[0];
        smoothSetPosition({
          x: touch.clientX - startPos.current.x,
          y: touch.clientY - startPos.current.y,
        });
      } else if (e.touches.length === 2) {
        // Pinch zoom
        const currentDistance = getTouchDistance(e.touches);
        const distanceChange = currentDistance - lastTouchDistance.current;

        if (Math.abs(distanceChange) > 5) {
          const zoomFactor = currentDistance / lastTouchDistance.current;
          const newScale = Math.min(Math.max(scale * zoomFactor, 0.2), 10);

          // Zoom towards the center of the two touches
          const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          const rect = mapRef.current?.getBoundingClientRect();

          if (rect) {
            const relX = centerX - rect.left;
            const relY = centerY - rect.top;

            const scaleChange = newScale / scale;
            const newX = position.x - (relX - position.x) * (scaleChange - 1);
            const newY = position.y - (relY - position.y) * (scaleChange - 1);

            smoothSetScale(newScale);
            smoothSetPosition({ x: newX, y: newY });
          }

          lastTouchDistance.current = currentDistance;
        }
      }
    },
    [scale, position, smoothSetScale, smoothSetPosition]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    if (mapRef.current) {
      mapRef.current.style.cursor = "grab";
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
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
          setShowInfo(false);
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

  // Mouse wheel listener
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
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-xl border dark:border-gray-700 overflow-hidden"
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
                  disabled={scale <= 0.2}
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
                  disabled={scale >= 10}
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

  // Desktop Controls Component
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
                disabled={scale >= 10}
                className="bg-primary-gold hover:bg-primary-gold/90 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-black w-10 h-10 p-0"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
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

  // New Mobile Tip/Link Component
  const MobileProvinceTip = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="absolute bottom-4 left-4 z-30"
    >
      <Card className="border-0 shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg dark:border-gray-700">
        <CardContent className="p-3">
          <Link href="/provinces" passHref>
            <Button
              variant="default"
              className="w-full justify-start gap-3 bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-800 h-12"
            >
              <List className="w-5 h-5" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Lihat Daftar Provinsi</span>
                <span className="text-xs opacity-80">Versi ringan & cepat</span>
              </div>
            </Button>
          </Link>
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
            {isMobile ? (
              <>
                <MobileControls />
                <MobileProvinceTip /> {/* Add the new mobile tip */}
              </>
            ) : (
              <DesktopControls />
            )}

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

              <motion.div
                className="w-full h-full"
                style={{
                  transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
                  transformOrigin: "center center",
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