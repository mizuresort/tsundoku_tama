"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { X, Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (isbn: string) => void;
}

export function BarcodeScanner({
  isOpen,
  onClose,
  onScanSuccess,
}: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    // Dialogが開いてDOM要素が存在することを確認してからスキャナーを開始
    // 少し遅延を入れて確実にDOMに要素が追加されるのを待つ
    const timer = setTimeout(() => {
      if (isOpen && !scannerRef.current && containerRef.current) {
        startScanner();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    // 要素の存在を再確認
    if (!containerRef.current) {
      console.error("Scanner container not found");
      setError("スキャナーの初期化に失敗しました。");
      return;
    }

    try {
      const scanner = new Html5Qrcode("barcode-scanner");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 300, height: 150 }, // バーコード用に横長に設定
        },
        (decodedText) => {
          // ISBNコードを検出
          const isbn = decodedText.trim();
          if (isbn) {
            stopScanner();
            onScanSuccess(isbn);
            onClose();
          }
        },
        (errorMessage) => {
          // エラーは無視（継続的にスキャンするため）
        }
      );

      setIsScanning(true);
      setError(null);
    } catch (err) {
      console.error("Failed to start scanner:", err);
      setError("カメラの起動に失敗しました。カメラの権限を確認してください。");
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current?.clear();
          scannerRef.current = null;
          setIsScanning(false);
        })
        .catch((err) => {
          console.error("Failed to stop scanner:", err);
        });
    }
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white dark:bg-gray-800 rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            バーコードをスキャン
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="relative">
            <div
              id="barcode-scanner"
              ref={containerRef}
              className="w-full rounded-lg overflow-hidden bg-black"
              style={{ minHeight: "200px", aspectRatio: "16/9" }}
            />
            {!isScanning && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                <div className="text-center text-white">
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <p>カメラを起動中...</p>
                </div>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            本のバーコードをカメラに向けてください
          </p>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              <X className="w-4 h-4 mr-2" />
              キャンセル
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
