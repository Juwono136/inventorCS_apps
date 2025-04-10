import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { Html5Qrcode } from "html5-qrcode";
import { IoClose } from "react-icons/io5";
import { BiRefresh } from "react-icons/bi";

const DialogQRCodeScanner = ({ open, handleClose }) => {
  const qrRef = useRef(null);
  const scannerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

  const config = { fps: 10, qrbox: { width: 280, height: 250 } };
  const qrRegionId = "qr-reader";

  const startScanner = async (cameraId) => {
    try {
      await scannerRef.current.start(
        cameraId,
        config,
        (decodedText) => {
          window.location.href = decodedText;
        },
        (errorMessage) => {
          // Optionally handle scan errors
        }
      );
      setIsReady(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        // 2 = SCANNING, 1 = PAUSED
        if (state === 2) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setIsReady(false);
  };

  const switchCamera = async () => {
    if (cameras.length <= 1) return;
    const nextIndex = (currentCameraIndex + 1) % cameras.length;
    await stopScanner();
    setCurrentCameraIndex(nextIndex);
    startScanner(cameras[nextIndex].id);
  };

  useEffect(() => {
    let isMounted = true;

    if (open) {
      const initialize = async () => {
        await new Promise((r) => requestAnimationFrame(r));

        if (!document.getElementById(qrRegionId)) return;

        scannerRef.current = new Html5Qrcode(qrRegionId);

        try {
          const devices = await Html5Qrcode.getCameras();
          if (devices && devices.length && isMounted) {
            setCameras(devices);
            setCurrentCameraIndex(0);
            startScanner(devices[0].id);
          }
        } catch (err) {
          console.error("Unable to get cameras:", err);
        }
      };

      initialize();
    }

    return () => {
      isMounted = false;
      stopScanner();
    };
  }, [open]);

  return (
    <Dialog
      open={open}
      handler={handleClose}
      size="xs"
      className="flex flex-col items-center justify-center bg-white p-4 rounded-xl"
    >
      <div className="flex w-full justify-between items-center mb-3">
        <h3 className="text-indigo-600 text-lg font-semibold">Scan QR Code</h3>
        <button onClick={handleClose}>
          <IoClose className="text-2xl text-red-500" />
        </button>
      </div>

      {!isReady && (
        <div className="w-full h-[250px] flex items-center justify-center border border-gray-200 rounded-lg mb-2">
          <p className="text-gray-500 text-sm">Loading scanner...</p>
        </div>
      )}

      <div id="qr-reader" ref={qrRef} className="w-full h-auto" />

      {cameras.length > 1 && (
        <button
          onClick={switchCamera}
          className="mt-4 mb-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg flex items-center gap-2"
        >
          <BiRefresh className="text-lg" />
          Switch Camera
        </button>
      )}

      <p className="text-sm text-purple-600 font-semibold mt-2 text-center italic">
        Point the camera at the QR code to scan the link.
      </p>
    </Dialog>
  );
};

export default DialogQRCodeScanner;
