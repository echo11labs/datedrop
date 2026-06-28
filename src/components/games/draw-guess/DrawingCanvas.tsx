"use client";

import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";

interface DrawingCanvasProps {
  isDrawing: boolean;
  onDraw: (data: DrawData) => void;
  onClear: () => void;
  disabled?: boolean;
}

export interface DrawData {
  type: "stroke" | "clear" | "fill";
  points?: { x: number; y: number }[];
  color?: string;
  size?: number;
}

export interface DrawingCanvasHandle {
  drawOnCanvas: (data: DrawData) => void;
}

const COLORS = ["#000000","#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899","#ffffff"];
const SIZES = [3, 6, 10, 16];

const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  function DrawingCanvas({ isDrawing, onDraw, onClear, disabled }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [currentColor, setCurrentColor] = useState("#000000");
    const [currentSize, setCurrentSize] = useState(6);
    const [showTools, setShowTools] = useState(false);
    const currentPoints = useRef<{ x: number; y: number }[]>([]);

    const drawOnCanvas = useCallback((data: DrawData) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (data.type === "clear") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }

      if (data.type === "fill") {
        ctx.fillStyle = data.color || "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }

      if (data.type === "stroke" && data.points && data.points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = data.color || "#000000";
        ctx.lineWidth = data.size || 6;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(data.points[0].x, data.points[0].y);
        for (let i = 1; i < data.points.length; i++) {
          ctx.lineTo(data.points[i].x, data.points[i].y);
        }
        ctx.stroke();
      }
    }, []);

    useImperativeHandle(ref, () => ({ drawOnCanvas }), [drawOnCanvas]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    const getPos = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      if ("touches" in e) {
        const touch = e.touches[0];
        return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
      }
      return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    }, []);

    const handleStart = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (disabled || !isDrawing) return;
      e.preventDefault();
      setIsMouseDown(true);
      currentPoints.current = [getPos(e)];
    }, [disabled, isDrawing, getPos]);

    const handleMove = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isMouseDown || disabled || !isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      currentPoints.current.push(pos);
      const data: DrawData = { type: "stroke", points: currentPoints.current.slice(-2), color: currentColor, size: currentSize };
      drawOnCanvas(data);
      onDraw(data);
    }, [isMouseDown, disabled, isDrawing, getPos, currentColor, currentSize, drawOnCanvas, onDraw]);

    const handleEnd = useCallback(() => {
      setIsMouseDown(false);
      currentPoints.current = [];
    }, []);

    const handleClear = useCallback(() => {
      const data: DrawData = { type: "clear" };
      drawOnCanvas(data);
      onClear();
      onDraw(data);
    }, [drawOnCanvas, onClear, onDraw]);

    const handleFill = useCallback(() => {
      const data: DrawData = { type: "fill", color: "#ffffff" };
      drawOnCanvas(data);
      onDraw(data);
    }, [drawOnCanvas, onDraw]);

    return (
      <div className="flex flex-col items-center gap-3">
        <div className="relative border-[3px] border-black rounded-xl shadow-brutal overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            width={500}
            height={400}
            className="w-full max-w-[500px] h-auto cursor-crosshair touch-none"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          />
          {isDrawing && !disabled && (
            <button
              onClick={() => setShowTools(!showTools)}
              className="absolute top-2 right-2 w-8 h-8 bg-white border-[3px] border-black rounded-lg shadow-brutal-sm flex items-center justify-center font-black text-sm hover:bg-gray-100"
            >
              🎨
            </button>
          )}
        </div>

        {isDrawing && !disabled && showTools && (
          <div className="flex flex-col items-center gap-2 bg-white border-[3px] border-black rounded-xl shadow-brutal px-4 py-3">
            <div className="flex gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrentColor(c)}
                  className={`w-7 h-7 rounded-lg border-[3px] transition-all ${
                    currentColor === c ? "border-black scale-110 shadow-brutal-sm" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex gap-2 items-center">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setCurrentSize(s)}
                  className={`rounded-full border-[3px] transition-all ${
                    currentSize === s ? "border-black shadow-brutal-sm" : "border-gray-300"
                  }`}
                  style={{ width: s + 16, height: s + 16, backgroundColor: currentColor }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleClear} className="btn-action px-3 py-1 text-[10px]">Clear All</button>
              <button onClick={handleFill} className="btn-action px-3 py-1 text-[10px]">Fill White</button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default DrawingCanvas;
