import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { Html5Qrcode } from "html5-qrcode";
import { IoClose } from "react-icons/io5";

const DialogQRCodeScanner = ({ open, handleClose }) => {
  const qrRef = useRef(null);
  const scannerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (open) {
      const config = { fps: 10, qrbox: { width: 300, height: 300 } };
      const qrRegionId = "qr-reader";

      const initializeScanner = async () => {
        await new Promise((resolve) => requestAnimationFrame(resolve));

        if (!document.getElementById(qrRegionId)) {
          console.warn("QR container not found.");
          return;
        }

        scannerRef.current = new Html5Qrcode(qrRegionId);

        try {
          const devices = await Html5Qrcode.getCameras();
          if (devices && devices.length) {
            let selectedCameraId = devices[0].id;

            // Cari kamera belakang yang bukan ultra wide
            const backCamera = devices.find(
              (device) =>
                /back|environment/i.test(device.label) &&
                !/ultra/i.test(device.label)
            );

            if (backCamera) {
              selectedCameraId = backCamera.id;
            }

            await scannerRef.current.start(
              selectedCameraId,
              config,
              (decodedText) => {
                if (isMounted) {
                  window.location.href = decodedText;
                }
              },
              (errorMessage) => {
                // Scan error handling opsional
              }
            );

            if (isMounted) setIsReady(true);
          }
        } catch (err) {
          console.error("Error starting QR scanner:", err);
        }
      };

      initializeScanner();

      return () => {
        isMounted = false;
        if (scannerRef.current) {
          scannerRef.current
            .stop()
            .then(() => scannerRef.current.clear())
            .catch((err) => console.error("Error stopping scanner:", err));
        }
        setIsReady(false);
      };
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      size="sm"
      className="flex flex-col items-center justify-center bg-white p-4 rounded-xl"
    >
      <div className="flex w-full justify-between items-center mb-3">
        <h3 className="bg-gradient-to-r from-blue-500  to-purple-700 bg-clip-text text-transparent text-lg font-semibold">
          Scan QR Code
        </h3>
        <button onClick={handleClose}>
          <IoClose className="text-2xl text-red-500" />
        </button>
      </div>

      {!isReady && (
        <div className="w-full h-[250px] flex items-center justify-center border border-gray-200 rounded-lg mb-2">
          <p className="text-gray-500 text-sm">Loading Camera...</p>
        </div>
      )}

      <div id="qr-reader" ref={qrRef} className={`w-full h-auto`} />

      <p className="text-xs text-purple-600 italic mt-3 text-center">
        Point the camera at the QR code to scan the link.
      </p>
    </Dialog>
  );
};

export default DialogQRCodeScanner;
